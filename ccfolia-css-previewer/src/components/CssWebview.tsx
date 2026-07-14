import { useEffect, useRef } from "react";
import type { ElectronWebViewElement } from "@/vite-env";

const INJECTED_STYLE_ID = "ccfolia-css-previewer-style";

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
) {
  // 1) Chromium レベル注入（CSP回避。Head には <style> が増えない）
  const key = await webview.insertCSS(css);

  // 2) DevTools の Head で見えるように実 DOM にも <style> を置く
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
      return {
        inHead: !!document.getElementById(id),
        length: cssText.length,
      };
    })()`,
  );

  return key;
}

export function CssWebview({
  src,
  cssUrl,
  extraCss,
  className,
}: CssWebviewProps) {
  const webviewRef = useRef<ElectronWebViewElement | null>(null);
  const readyRef = useRef(false);
  const insertedKeyRef = useRef<string | null>(null);
  const cssPayloadRef = useRef({ cssUrl, extraCss });
  cssPayloadRef.current = { cssUrl, extraCss };

  useEffect(() => {
    readyRef.current = false;
    insertedKeyRef.current = null;
  }, [src]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !src) return;

    let cancelled = false;
    const retryTimers: number[] = [];

    const injectCss = async (reason: string) => {
      try {
        const { cssUrl: url, extraCss: extra } = cssPayloadRef.current;
        const css = await loadCssText(url, extra);
        if (cancelled || !css) return;

        if (insertedKeyRef.current) {
          try {
            await webview.removeInsertedCSS(insertedKeyRef.current);
          } catch {
            // ignore
          }
          insertedKeyRef.current = null;
        }

        insertedKeyRef.current = await injectCssIntoWebview(webview, css);
        console.info("[CssWebview] injected", {
          reason,
          cssUrl: url,
          bytes: css.length,
          key: insertedKeyRef.current,
        });
      } catch (error) {
        console.error("[CssWebview] CSS inject failed:", error);
      }
    };

    const onReady = () => {
      readyRef.current = true;
      void injectCss("ready");
      // CCFOLIA は SPA なので、少し遅れて再注入
      for (const ms of [500, 1500, 3000]) {
        retryTimers.push(
          window.setTimeout(() => {
            if (!cancelled) void injectCss(`retry-${ms}`);
          }, ms),
        );
      }
    };

    webview.addEventListener("dom-ready", onReady);
    webview.addEventListener("did-finish-load", onReady);
    webview.addEventListener("did-navigate", onReady);
    webview.addEventListener("did-navigate-in-page", onReady);

    if (readyRef.current) {
      void injectCss("already-ready");
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

  return <webview ref={webviewRef} src={src} className={className} />;
}
