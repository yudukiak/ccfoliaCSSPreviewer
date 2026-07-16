import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { ElectronWebViewElement } from "@/vite-env";
import { expandCssImports } from "@/lib/expandCssImports";
import { injectCssIntoWebview } from "@/lib/webviewCss";

export function usePreviewWebviewCss(
  webviewRef: RefObject<ElectronWebViewElement | null>,
  src: string,
  cssText: string,
) {
  const readyRef = useRef(false);
  const insertedKeyRef = useRef<string | null>(null);
  const cssTextRef = useRef(cssText);
  const injectChainRef = useRef(Promise.resolve());
  const injectEpochRef = useRef(0);
  cssTextRef.current = cssText;

  const enqueueInject = useCallback(
    (css: string, reason: string) => {
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
          console.info("[CcfoliaPreviewWebview] injected", {
            reason,
            bytes: css.length,
            key,
          });
        } catch (error) {
          if (epoch === injectEpochRef.current) {
            console.error("[CcfoliaPreviewWebview] CSS inject failed:", error);
          }
        }
      };

      injectChainRef.current = injectChainRef.current.then(run, run);
      return injectChainRef.current;
    },
    [webviewRef],
  );

  const applyCss = useCallback(
    async (css: string) => {
      await enqueueInject(css, "manual");
    },
    [enqueueInject],
  );

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
        const css = await expandCssImports(source);
        if (cancelled || effectEpoch !== injectEpochRef.current) return;
        // cssText が解決中に変わっていたら最新を優先
        if (source !== cssTextRef.current) return;
        await enqueueInject(css, reason);
      } catch (error) {
        if (!cancelled && effectEpoch === injectEpochRef.current) {
          console.error("[CcfoliaPreviewWebview] CSS resolve failed:", error);
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
  }, [cssText, enqueueInject, src, webviewRef]);

  return { applyCss };
}
