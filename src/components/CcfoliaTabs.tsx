import { useState } from "react";
import { useAtomValue } from "jotai";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CssWebview } from "@/components/CssWebview";
import {
  assetCssIdsAtom,
  customCssTextAtom,
  previewTargetAtom,
  publishedCssIdAtom,
} from "@/atoms/ccfolia";
import { assetCssLists, getCssListItem } from "@/data/cssLists";
import { DevToolsButtons } from "@/components/DevToolsButtons";

function buildExportCssSource(
  publishedCssUrl: string,
  publishedExtraCss: string | undefined,
  assetCssUrls: string[],
  customCssText: string,
) {
  const blocks: string[] = [];

  if (publishedCssUrl) {
    blocks.push(`/* 公開CSS */`);
    blocks.push(`@import url("${publishedCssUrl}");`);
  }

  const assetUrls = assetCssUrls.filter(Boolean);
  if (assetUrls.length > 0) {
    blocks.push(`/* アセットCSS */`);
    blocks.push(assetUrls.map((url) => `@import url("${url}");`).join("\n"));
  }

  if (publishedExtraCss?.trim()) {
    blocks.push(publishedExtraCss.trim());
  }

  if (customCssText.trim()) {
    blocks.push(`/* カスタムCSS */`);
    blocks.push(customCssText.trim());
  }

  return blocks.length > 0 ? `${blocks.join("\n")}` : "";
}

export function CcfoliaTabs() {
  const preview = useAtomValue(previewTargetAtom);
  const publishedCssId = useAtomValue(publishedCssIdAtom);
  const customCssText = useAtomValue(customCssTextAtom);
  const assetCssIds = useAtomValue(assetCssIdsAtom);
  const [copied, setCopied] = useState(false);
  const selectedList = getCssListItem(publishedCssId);
  const { cssUrl, extraCss } = selectedList ?? {
    cssUrl: "",
    extraCss: undefined,
  };
  const selectedAssets = assetCssLists.filter((list) =>
    assetCssIds.includes(list.id),
  );
  const exportCssSource = buildExportCssSource(
    cssUrl,
    extraCss,
    selectedAssets.map((asset) => asset.cssUrl),
    customCssText,
  );
  const displayCssSource = exportCssSource || "/* 表示するCSSがありません */";
  const previewUrl = preview
    ? /status\/main\.css/.test(cssUrl)
      ? preview.characterUrl
      : preview.roomUrl
    : null;

  const handleCopy = async () => {
    if (!exportCssSource) return;
    try {
      await navigator.clipboard.writeText(exportCssSource);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("[CcfoliaTabs] copy failed:", error);
    }
  };

  return (
    <section className="h-full">
      <Card className="h-full p-0 gap-0">
        <CardContent className="flex h-full items-center justify-center bg-muted-foreground text-sm text-background p-0">
          {previewUrl ? (
            <CssWebview src={previewUrl} cssText={exportCssSource} />
          ) : (
            <p>ココフォリアの盤面が表示されます</p>
          )}
        </CardContent>
        <CardFooter className="p-4">
          <DevToolsButtons />
          <Dialog>
            <DialogTrigger render={<Button className="mr-0 ml-auto">CSSソースを閲覧する</Button>} />
            <DialogContent className="flex max-h-[85dvh] w-full max-w-[calc(100%-2rem)] flex-col overflow-hidden sm:max-w-2xl">
              <DialogHeader className="shrink-0">
                <DialogTitle>CSSソース</DialogTitle>
                <DialogDescription>
                  公開CSS・アセット・カスタムCSSをまとめたソースです。コピーして使えます。
                </DialogDescription>
              </DialogHeader>
              <div className="relative min-w-0">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-4 z-10"
                  disabled={!exportCssSource}
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
        </CardFooter>
      </Card>
    </section>
  );
}
