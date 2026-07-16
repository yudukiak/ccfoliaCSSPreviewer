import { forwardRef, useImperativeHandle, useRef } from "react";
import type { ElectronWebViewElement } from "@/vite-env";
import { usePreviewWebviewCss } from "@/hooks/usePreviewWebviewCss";
import { cn } from "@/lib/utils";

export type CcfoliaPreviewWebviewHandle = {
  applyCss: (css: string) => Promise<void>;
};

type CcfoliaPreviewWebviewProps = {
  src: string;
  /** ダイアログ表示と同じソース（@import + 本文）。注入時は @import を展開する */
  cssText?: string;
  className?: string;
};

export const CcfoliaPreviewWebview = forwardRef<
  CcfoliaPreviewWebviewHandle,
  CcfoliaPreviewWebviewProps
>(function CcfoliaPreviewWebview({ src, cssText = "", className }, ref) {
  const webviewRef = useRef<ElectronWebViewElement | null>(null);
  const { applyCss } = usePreviewWebviewCss(webviewRef, src, cssText);

  useImperativeHandle(ref, () => ({
    applyCss,
  }));

  return (
    <webview
      ref={webviewRef}
      src={src}
      className={cn("h-full w-full bg-white overflow-hidden", className)}
    />
  );
});
