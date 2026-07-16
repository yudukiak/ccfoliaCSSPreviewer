import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type CcfoliaCssSourceDialogProps = {
  cssSource: string;
};

export function CcfoliaCssSourceDialog({
  cssSource,
}: CcfoliaCssSourceDialogProps) {
  const [copied, setCopied] = useState(false);
  const displayCssSource = cssSource || "/* 表示するCSSがありません */";

  const handleCopy = async () => {
    if (!cssSource) return;
    try {
      await navigator.clipboard.writeText(cssSource);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("[CcfoliaCssSourceDialog] copy failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="mr-0 ml-auto">カスタムCSSを閲覧する</Button>
        }
      />
      <DialogContent className="flex max-h-[85dvh] w-full max-w-[calc(100%-2rem)] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>カスタムCSS</DialogTitle>
          <DialogDescription>
            適用中のCSSです。コピーして使えます。
          </DialogDescription>
        </DialogHeader>
        <div className="relative min-w-0">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-4 z-10"
            aria-label="コピー"
            disabled={!cssSource}
            onClick={() => void handleCopy()}
          >
            {copied ? (
              <CheckIcon data-icon="inline-start" />
            ) : (
              <CopyIcon data-icon="inline-start" />
            )}
          </Button>
          <ScrollArea className="h-[min(60dvh,calc(85dvh-8rem))] w-full min-w-0 rounded-md bg-muted-foreground text-background">
            <pre className="max-w-full whitespace-pre-wrap wrap-break-wor p-4 pr-24 font-mono text-xs">
              <code className="whitespace-pre">{displayCssSource}</code>
            </pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
