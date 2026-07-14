import { useRef, useState } from "react";
import { FaGithub, FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Link } from "@/components/ui/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CssWebview, type CssWebviewHandle } from "@/components/CssWebview";
import { cssLists, type PreviewTarget } from "@/data/cssLists";

const TRIGGER_CLASS_NAME =
  "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30";

type CcfoliaTabsProps = {
  preview: PreviewTarget | null;
};

export function CcfoliaTabs({ preview }: CcfoliaTabsProps) {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl);
  const assetCssLists = cssLists.filter((list) => !list.hpUrl);
  const [manualCss, setManualCss] = useState("");

  return (
    <Tabs
      defaultValue={publishedCssLists[0]?.title ?? cssLists[0].title}
      className="grid h-full min-h-0 grid-cols-[240px_1fr] grid-rows-1"
    >
      <TabsList className="h-full! w-full! block! bg-transparent p-0">
        <ScrollArea className="h-full space-y-4 pr-4">
          <div className="">
            <p className="px-1 text-sm font-medium text-foreground">公開CSS</p>
            <div className="grid w-full grid-cols-1 gap-1">
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

          <div className="">
            <p className="px-1 text-sm font-medium text-foreground">アセット</p>
            <div className="grid w-full grid-cols-1 gap-1">
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

          <div className="">
            <p className="px-1 text-sm font-medium text-foreground">手動</p>
            <div className="grid w-full grid-cols-1 gap-1">
              <TabsTrigger value="manual-room" className={TRIGGER_CLASS_NAME}>
                ルームURL
              </TabsTrigger>
              <TabsTrigger
                value="manual-character"
                className={TRIGGER_CLASS_NAME}
              >
                キャラURL
              </TabsTrigger>
            </div>
          </div>
        </ScrollArea>
      </TabsList>

      {cssLists.map((list) => {
        const { title, hpUrl, cssUrl, style } = list;
        const previewUrl = preview
          ? /status\/main\.css/.test(cssUrl)
            ? preview.characterUrl
            : preview.roomUrl
          : null;

        return (
          <TabsContent key={title} value={title} className="min-h-0">
            <Card className="h-full min-h-0">
              <CardHeader className="shrink-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription className="space-x-4">
                  {hpUrl && (
                    <p className="inline-flex items-center gap-1">
                      <FaHome className="size-4 shrink-0" />
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
              <CardContent className="flex min-h-0 flex-1 flex-col text-sm text-muted-foreground">
                {previewUrl ? (
                  <CssWebview
                    src={previewUrl}
                    cssUrl={cssUrl}
                    extraCss={style}
                    className="min-h-0 flex-1 w-full rounded-md border"
                  />
                ) : (
                  <WebviewPlaceholder />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}

      <TabsContent value="manual-room" className="min-h-0">
        <ManualCssPanel
          title="手動（ルームURL）"
          src={preview?.roomUrl}
          cssText={manualCss}
          onCssTextChange={setManualCss}
        />
      </TabsContent>

      <TabsContent value="manual-character" className="min-h-0">
        <ManualCssPanel
          title="手動（キャラURL）"
          src={preview?.characterUrl}
          cssText={manualCss}
          onCssTextChange={setManualCss}
        />
      </TabsContent>
    </Tabs>
  );
}

function ManualCssPanel({
  title,
  src,
  cssText,
  onCssTextChange,
}: {
  title: string;
  src?: string;
  cssText: string;
  onCssTextChange: (value: string) => void;
}) {
  const webviewRef = useRef<CssWebviewHandle>(null);
  const [applying, setApplying] = useState(false);

  return (
    <Card className="h-full min-h-0">
      <CardHeader className="shrink-0">
        <CardTitle>{title}</CardTitle>
        {src && <CardDescription className="break-all">{src}</CardDescription>}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
        <Field className="shrink-0">
          <FieldLabel htmlFor={`manual-css-${src ?? "pending"}`}>
            CSS（ベタ打ち）
          </FieldLabel>
          <Textarea
            id={`manual-css-${src ?? "pending"}`}
            className="min-h-40 font-mono text-xs"
            placeholder={"/* 例 */\nbody { background: red !important; }"}
            value={cssText}
            onChange={(e) => onCssTextChange(e.target.value)}
          />
        </Field>

        <Button
          className="shrink-0"
          disabled={!src || !cssText.trim() || applying}
          onClick={async () => {
            setApplying(true);
            try {
              await webviewRef.current?.applyCss(cssText);
            } finally {
              setApplying(false);
            }
          }}
        >
          {applying ? "挿入中…" : "Webviewに挿入"}
        </Button>

        <div className="flex min-h-0 flex-1 flex-col">
          {src ? (
            <CssWebview
              ref={webviewRef}
              src={src}
              className="min-h-0 flex-1 w-full rounded-md border"
            />
          ) : (
            <WebviewPlaceholder />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WebviewPlaceholder() {
  return (
    <div className="flex min-h-0 flex-1 w-full items-center justify-center rounded-md border bg-muted-foreground text-sm text-background">
      表示されるよー
    </div>
  );
}
