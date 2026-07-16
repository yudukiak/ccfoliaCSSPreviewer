import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { ElectronWebViewElement } from "@/vite-env";
import { cn } from "@/lib/utils";
const INJECTED_STYLE_ID = "ccfolia-css-previewer-style";

export type CssWebviewHandle = {
  applyCss: (css: string) => Promise<void>;
};

type CssWebviewProps = {
  src: string;
  cssUrl?: string;
  extraCss?: string;
  className?: string;
};

async function loadCssText(cssUrl?: string, extraCss?: string) {
  const parts: string[] = [];

  if (cssUrl) {
    if (!window.electronAPI?.fetchText) {
      throw new Error("electronAPI.fetchText がありません（preload未読込）");
    }
    parts.push(await window.electronAPI.fetchText(cssUrl));
  }

  if (extraCss) {
    parts.push(extraCss);
  }

  return parts.join("\n");
}

async function injectCssIntoWebview(
  webview: ElectronWebViewElement,
  css: string,
  previousKey: string | null,
) {
  if (previousKey) {
    try {
      await webview.removeInsertedCSS(previousKey);
    } catch {
      // ignore
    }
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
  function CssWebview({ src, cssUrl, extraCss, className }, ref) {
    const webviewRef = useRef<ElectronWebViewElement | null>(null);
    const readyRef = useRef(false);
    const insertedKeyRef = useRef<string | null>(null);
    const cssPayloadRef = useRef({ cssUrl, extraCss });
    cssPayloadRef.current = { cssUrl, extraCss };

    const applyCss = async (css: string, reason: string) => {
      const webview = webviewRef.current;
      if (!webview || !css.trim()) return;

      insertedKeyRef.current = await injectCssIntoWebview(
        webview,
        css,
        insertedKeyRef.current,
      );
      console.info("[CssWebview] injected", {
        reason,
        bytes: css.length,
        key: insertedKeyRef.current,
      });
    };

    useImperativeHandle(ref, () => ({
      applyCss: async (css: string) => {
        try {
          await applyCss(css, "manual");
        } catch (error) {
          console.error("[CssWebview] manual inject failed:", error);
          throw error;
        }
      },
    }));

    useEffect(() => {
      readyRef.current = false;
      insertedKeyRef.current = null;
    }, [src]);

    useEffect(() => {
      const webview = webviewRef.current;
      if (!webview || !src) return;

      let cancelled = false;
      const retryTimers: number[] = [];

      const injectFromProps = async (reason: string) => {
        try {
          const { cssUrl: url, extraCss: extra } = cssPayloadRef.current;
          const css = await loadCssText(url, extra);
          if (cancelled || !css) return;
          await applyCss(css, reason);
        } catch (error) {
          console.error("[CssWebview] CSS inject failed:", error);
        }
      };

      const onReady = () => {
        readyRef.current = true;
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
        for (const timer of retryTimers) window.clearTimeout(timer);
        webview.removeEventListener("dom-ready", onReady);
        webview.removeEventListener("did-finish-load", onReady);
        webview.removeEventListener("did-navigate", onReady);
        webview.removeEventListener("did-navigate-in-page", onReady);
      };
    }, [src, cssUrl, extraCss]);

    return <webview ref={webviewRef} src={src} className={cn("h-full w-full rounded-md border overflow-hidden", className)} />;
  },
);
