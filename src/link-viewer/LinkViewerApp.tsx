import { useEffect, useRef, useState } from "react";
import { CheckIcon, CircleAlertIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ElectronWebViewElement } from "@/vite-env";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "success" | "error";

export function LinkViewerApp() {
  const [url, setUrl] = useState("");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const webviewRef = useRef<ElectronWebViewElement | null>(null);
  const copyResetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = window.linkViewer.onNavigate((nextUrl) => {
      setUrl(nextUrl);
      setCopyState("idle");
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

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current !== null) {
        window.clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!url) return;
    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle");
      copyResetTimerRef.current = null;
    }, 1500);
  };

  const CopyStatusIcon =
    copyState === "success"
      ? CheckIcon
      : copyState === "error"
        ? CircleAlertIcon
        : CopyIcon;
  const copyButtonClassName = cn(
    copyState === "success" &&
      "border-green-600 text-green-700 hover:bg-green-50 hover:text-green-700 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950 dark:hover:text-green-400",
    copyState === "error" &&
      "border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-950 dark:hover:text-orange-400",
  );

  return (
    <main className="flex h-dvh flex-col">
      <header className="px-4 py-2 flex items-center gap-2 border-b">
        <Input
          readOnly
          value={url}
          placeholder="URL"
          spellCheck={false}
          onFocus={(event) => event.currentTarget.select()}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!url}
          className={copyButtonClassName}
          onClick={() => void handleCopy()}
        >
          <CopyStatusIcon />
        </Button>
      </header>
      <webview ref={webviewRef} className="min-h-0 w-full flex-1" />
    </main>
  );
}
