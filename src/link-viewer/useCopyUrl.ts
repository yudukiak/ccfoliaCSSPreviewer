import { useEffect, useRef, useState } from "react";
import { CheckIcon, CircleAlertIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "success" | "error";

export function useCopyUrl(url: string) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const copyResetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCopyState("idle");
    if (copyResetTimerRef.current !== null) {
      window.clearTimeout(copyResetTimerRef.current);
      copyResetTimerRef.current = null;
    }
  }, [url]);

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

  return {
    handleCopy,
    CopyStatusIcon,
    copyButtonClassName,
  };
}
