import { useAtomValue } from "jotai";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CcfoliaCssSourceDialog } from "@/components/CcfoliaCssSourceDialog";
import { CcfoliaPreviewWebview } from "@/components/CcfoliaPreviewWebview";
import {
  assetCssIdsAtom,
  customCssTextAtom,
  previewTargetAtom,
  publishedCssIdAtom,
} from "@/atoms/ccfolia";
import { assetCssLists, getCssListItem } from "@/data/cssLists";
import { buildCssSource } from "@/lib/cssSource";
import { resolvePreviewUrl } from "@/lib/previewUrl";
import { DevToolsButtons } from "@/components/DevToolsButtons";

export function CcfoliaPreview() {
  const preview = useAtomValue(previewTargetAtom);
  const publishedCssId = useAtomValue(publishedCssIdAtom);
  const customCssText = useAtomValue(customCssTextAtom);
  const assetCssIds = useAtomValue(assetCssIdsAtom);
  const selectedList = getCssListItem(publishedCssId);
  const { cssUrl, extraCss } = selectedList ?? {
    cssUrl: "",
    extraCss: undefined,
  };
  const selectedAssets = assetCssLists.filter((list) =>
    assetCssIds.includes(list.id),
  );
  const cssSource = buildCssSource(
    cssUrl,
    extraCss,
    selectedAssets.map((asset) => asset.cssUrl),
    customCssText,
  );
  const previewUrl = resolvePreviewUrl(preview, cssUrl);

  return (
    <section className="h-full">
      <Card className="h-full p-0 gap-0">
        <CardContent className="flex h-full items-center justify-center bg-muted-foreground text-sm text-background p-0">
          {previewUrl ? (
            <CcfoliaPreviewWebview src={previewUrl} cssText={cssSource} />
          ) : (
            <p>ルームURLとキャラIDを入力すると表示されます</p>
          )}
        </CardContent>
        <CardFooter className="p-4">
          <DevToolsButtons />
          <CcfoliaCssSourceDialog cssSource={cssSource} />
        </CardFooter>
      </Card>
    </section>
  );
}
