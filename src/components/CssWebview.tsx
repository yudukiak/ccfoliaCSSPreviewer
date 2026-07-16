import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { ElectronWebViewElement } from "@/vite-env";
import { cn } from "@/lib/utils";

const INJECTED_STYLE_ID = "ccfolia-css-previewer-style";
const IMPORT_URL_RE = /@import\s+url\(["']([^"']+)["']\)\s*;/g;

export type CssWebviewHandle = {
  applyCss: (css: string) => Promise<void>;
};

type CssWebviewProps = {
  src: string;
  /** ダイアログ表示と同じソース（@import + 本文）。注入時は @import を展開する */
  cssText?: string;
  className?: string;
};

async function resolveCssTextForInject(cssText: string) {
  if (!cssText.trim()) return "";

  const urls: string[] = [];
  const remainder = cssText.replace(
    new RegExp(IMPORT_URL_RE.source, "g"),
    (_, url: string) => {
      urls.push(url);
      return "";
    },
  );

  const parts: string[] = [];

  if (urls.length > 0) {
    if (!window.electronAPI?.fetchText) {
      throw new Error("electronAPI.fetchText がありません（preload未読込）");
    }
    for (const url of urls) {
      parts.push(await window.electronAPI.fetchText(url));
    }
  }

  const rest = remainder.trim();
  if (rest) {
    parts.push(rest);
  }

  return parts.join("\n");
}

async function clearInjectedCss(
  webview: ElectronWebViewElement,
  previousKey: string | null,
) {
  if (previousKey) {
    try {
      await webview.removeInsertedCSS(previousKey);
    } catch {
      // ignore
    }
  }

  try {
    await webview.executeJavaScript(
      `(() => {
        const id = ${JSON.stringify(INJECTED_STYLE_ID)};
        const el = document.getElementById(id);
        if (el) el.remove();
        return true;
      })()`,
    );
  } catch {
    // navigate 中などは無視
  }
}

async function injectCssIntoWebview(
  webview: ElectronWebViewElement,
  css: string,
  previousKey: string | null,
) {
  await clearInjectedCss(webview, previousKey);

  if (!css.trim()) {
    return null;
  }

  const key = await webview.insertCSS(css);

  await webview.executeJavaScript(
    `(() => {
      const id = ${JSON.stringify(INJECTED_STYLE_ID)};
      const cssText = ${JSON.stringify(css)};
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        (document.head || document.documentElement).appendChild(el);
      }
      el.textContent = cssText;
      return true;
    })()`,
  );

  return key;
}

export const CssWebview = forwardRef<CssWebviewHandle, CssWebviewProps>(
  function CssWebview({ src, cssText = "", className }, ref) {
    const webviewRef = useRef<ElectronWebViewElement | null>(null);
    const readyRef = useRef(false);
    const insertedKeyRef = useRef<string | null>(null);
    const cssTextRef = useRef(cssText);
    const injectChainRef = useRef(Promise.resolve());
    const injectEpochRef = useRef(0);
    cssTextRef.current = cssText;

    const enqueueInject = (css: string, reason: string) => {
      const epoch = ++injectEpochRef.current;
      const run = async () => {
        if (epoch !== injectEpochRef.current) return;

        const webview = webviewRef.current;
        if (!webview) return;

        try {
          const key = await injectCssIntoWebview(
            webview,
            css,
            insertedKeyRef.current,
          );
          if (epoch !== injectEpochRef.current) {
            if (key) {
              try {
                await webview.removeInsertedCSS(key);
              } catch {
                // ignore
              }
            }
            return;
          }
          insertedKeyRef.current = key;
          console.info("[CssWebview] injected", {
            reason,
            bytes: css.length,
            key,
          });
        } catch (error) {
          if (epoch === injectEpochRef.current) {
            console.error("[CssWebview] CSS inject failed:", error);
          }
        }
      };

      injectChainRef.current = injectChainRef.current.then(run, run);
      return injectChainRef.current;
    };

    useImperativeHandle(ref, () => ({
      applyCss: async (css: string) => {
        await enqueueInject(css, "manual");
      },
    }));

    useEffect(() => {
      readyRef.current = false;
      // src 変更でページが切り替わると旧 insertCSS は無効になる想定
      insertedKeyRef.current = null;
      injectEpochRef.current += 1;
    }, [src]);

    useEffect(() => {
      const webview = webviewRef.current;
      if (!webview || !src) return;

      let cancelled = false;
      const retryTimers: number[] = [];
      const effectEpoch = ++injectEpochRef.current;

      const clearRetryTimers = () => {
        for (const timer of retryTimers) window.clearTimeout(timer);
        retryTimers.length = 0;
      };

      const injectFromProps = async (reason: string) => {
        try {
          const source = cssTextRef.current;
          const css = await resolveCssTextForInject(source);
          if (cancelled || effectEpoch !== injectEpochRef.current) return;
          // cssText が解決中に変わっていたら最新を優先
          if (source !== cssTextRef.current) return;
          await enqueueInject(css, reason);
        } catch (error) {
          if (!cancelled && effectEpoch === injectEpochRef.current) {
            console.error("[CssWebview] CSS resolve failed:", error);
          }
        }
      };

      const onReady = () => {
        readyRef.current = true;
        clearRetryTimers();
        void injectFromProps("ready");
        for (const ms of [500, 1500, 3000]) {
          retryTimers.push(
            window.setTimeout(() => {
              if (!cancelled) void injectFromProps(`retry-${ms}`);
            }, ms),
          );
        }
      };

      webview.addEventListener("dom-ready", onReady);
      webview.addEventListener("did-finish-load", onReady);
      webview.addEventListener("did-navigate", onReady);
      webview.addEventListener("did-navigate-in-page", onReady);

      if (readyRef.current) {
        void injectFromProps("already-ready");
      }

      return () => {
        cancelled = true;
        clearRetryTimers();
        webview.removeEventListener("dom-ready", onReady);
        webview.removeEventListener("did-finish-load", onReady);
        webview.removeEventListener("did-navigate", onReady);
        webview.removeEventListener("did-navigate-in-page", onReady);
        injectEpochRef.current += 1;
      };
    }, [src, cssText]);

    return (
      <webview
        ref={webviewRef}
        src={src}
        className={cn("h-full w-full bg-white overflow-hidden", className)}
      />
    );
  },
);
