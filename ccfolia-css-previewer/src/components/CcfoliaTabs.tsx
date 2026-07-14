import { FaGithub } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CssWebview } from "@/components/CssWebview";
import { cssLists, type PreviewTarget } from "@/data/cssLists";

const TRIGGER_CLASS_NAME =
  "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30";

type CcfoliaTabsProps = {
  preview: PreviewTarget;
};

export function CcfoliaTabs({ preview }: CcfoliaTabsProps) {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl);
  const assetCssLists = cssLists.filter((list) => !list.hpUrl);

  return (
    <Tabs defaultValue={publishedCssLists[0]?.title ?? cssLists[0].title}>
      <div className="flex flex-col gap-3">
        <TabsList className="group-data-horizontal/tabs:h-auto flex h-auto w-full flex-col gap-3 bg-transparent p-0">
          <div className="flex w-full flex-col gap-1.5">
            <p className="px-1 text-sm font-medium text-foreground">公開CSS</p>
            <div className="grid w-full grid-cols-4 gap-1">
              {publishedCssLists.map((list) => (
                <TabsTrigger
                  key={list.title}
                  value={list.title}
                  className={TRIGGER_CLASS_NAME}
                >
                  {list.title}
                </TabsTrigger>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <p className="px-1 text-sm font-medium text-foreground">アセット</p>
            <div className="grid w-full grid-cols-4 gap-1">
              {assetCssLists.map((list) => (
                <TabsTrigger
                  key={list.title}
                  value={list.title}
                  className={TRIGGER_CLASS_NAME}
                >
                  {list.title}
                </TabsTrigger>
              ))}
            </div>
          </div>
        </TabsList>
      </div>

      {cssLists.map((list) => {
        const { title, hpUrl, cssUrl, style } = list;
        const previewUrl = /status\/main\.css/.test(cssUrl)
          ? preview.characterUrl
          : preview.roomUrl;

        return (
          <TabsContent key={title} value={title}>
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="space-x-4">
                  {hpUrl && (
                    <p className="inline-flex items-center gap-1">
                      <LuExternalLink className="size-4 shrink-0" />
                      <Link href={hpUrl}>{hpUrl}</Link>
                    </p>
                  )}
                  {cssUrl && (
                    <p className="inline-flex items-center gap-1">
                      <FaGithub className="size-4 shrink-0" />
                      <Link href={cssUrl}>{cssUrl}</Link>
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <CssWebview
                  src={previewUrl}
                  cssUrl={cssUrl}
                  extraCss={style}
                  className="h-[480px] w-full rounded-md border"
                />
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
