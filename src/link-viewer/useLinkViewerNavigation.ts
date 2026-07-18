import { useEffect, useRef, useState } from "react";
import type { ElectronWebViewElement } from "@/vite-env";

export function useLinkViewerNavigation() {
  const [url, setUrl] = useState("");
  const webviewRef = useRef<ElectronWebViewElement | null>(null);

  useEffect(() => {
    const unsubscribe = window.linkViewer.onNavigate((nextUrl) => {
      setUrl(nextUrl);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !url) return;
    if (webview.src !== url) {
      webview.src = url;
    }
  }, [url]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const onNavigate = (event: Event) => {
      const nextUrl = (event as Event & { url: string }).url;
      if (nextUrl) setUrl(nextUrl);
    };

    webview.addEventListener("did-navigate", onNavigate);
    webview.addEventListener("did-navigate-in-page", onNavigate);

    return () => {
      webview.removeEventListener("did-navigate", onNavigate);
      webview.removeEventListener("did-navigate-in-page", onNavigate);
    };
  }, []);

  return { url, webviewRef };
}
