import { useAtomValue } from "jotai";
import { FaGithub, FaHome } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { CssWebview } from "@/components/CssWebview";
import { publishedCssIdAtom } from "@/atoms/ccfolia";
import { getCssListItem, type PreviewTarget } from "@/data/cssLists";

type CcfoliaTabsProps = {
  preview: PreviewTarget | null;
};

export function CcfoliaTabs({ preview }: CcfoliaTabsProps) {
  const publishedCssId = useAtomValue(publishedCssIdAtom);
  const selectedList = getCssListItem(publishedCssId);
  const { title, homepageUrl, cssUrl, extraCss } = selectedList ?? {
    title: "",
    homepageUrl: undefined,
    cssUrl: "",
    extraCss: undefined,
  };
  const previewUrl =
    preview && cssUrl
      ? /status\/main\.css/.test(cssUrl)
        ? preview.characterUrl
        : preview.roomUrl
      : null;

  return (
      <section className="h-full">
        <Card className="h-full grid grid-rows-[auto_minmax(0,1fr)]">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <ul>
                <li>
                  <FaHome className="inline-block size-4 shrink-0 mr-1" />
                  {homepageUrl ? (
                    <Link href={homepageUrl}>{homepageUrl}</Link>
                  ) : (
                    <span className="text-muted-foreground"></span>
                  )}
                </li>
                <li>
                  <FaGithub className="inline-block size-4 shrink-0 mr-1" />
                  {cssUrl ? (
                    <Link href={cssUrl}>{cssUrl}</Link>
                  ) : (
                    <span className="text-muted-foreground"></span>
                  )}
                </li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {previewUrl ? (
              <CssWebview
                src={previewUrl}
                cssUrl={cssUrl}
                extraCss={extraCss}
              />
            ) : (
              <WebviewPlaceholder />
            )}
          </CardContent>
        </Card>
      </section>
  );
}

function WebviewPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted-foreground text-sm text-background">
      ココフォリアの盤面が表示されます
    </div>
  );
}
