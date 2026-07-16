import { useRef, useState } from "react";
import { FaGithub, FaHome } from "react-icons/fa";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle, } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [selectedTitle, setSelectedTitle] = useState(
    publishedCssLists[0]?.title ?? "",
  );
  const selectedList =
    publishedCssLists.find((list) => list.title === selectedTitle) ??
    publishedCssLists[0];
  const { title, hpUrl, cssUrl, style } = selectedList ?? {
    title: "",
    hpUrl: undefined,
    cssUrl: "",
    style: undefined,
  };
  const previewUrl = preview
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
                  {hpUrl ? (
                    <Link href={hpUrl}>{hpUrl}</Link>
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
                extraCss={style}
              />
            ) : (
              <WebviewPlaceholder />
            )}
          </CardContent>
        </Card>
      </section>
  );
  /*
  return (
    <Tabs
      defaultValue={publishedCssLists[0]?.title ?? cssLists[0].title}
      className="grid h-full min-h-0 grid-cols-[240px_1fr] grid-rows-1"
    >
      <TabsList className="h-full! w-full! block! bg-transparent p-0">
        <ScrollArea className="h-full space-y-4 p-2 pr-4 border rounded-lg">
          <div className="">
            <p className="px-1 text-sm font-medium text-foreground">公開CSS</p>
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
                <CardDescription>
                  <ul>
                    <li>
                      <FaHome className="inline-block size-4 shrink-0 mr-1" />
                      {hpUrl ? <Link href={hpUrl}>{hpUrl}</Link> : <span className="text-muted-foreground"></span>}
                    </li>
                    <li>
                      <FaGithub className="inline-block size-4 shrink-0 mr-1" />
                      {cssUrl ? <Link href={cssUrl}>{cssUrl}</Link> : <span className="text-muted-foreground"></span>}
                    </li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col text-sm text-muted-foreground">
                {previewUrl ? (
                  <CssWebview
                    src={previewUrl}
                    cssUrl={cssUrl}
                    extraCss={style}
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
  */
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
      <CardContent className="grid grid-cols-[300px_1fr] gap-4 min-h-0 flex-1">
        <Field className="h-full">
          <Textarea
            className="h-full font-mono text-xs field-sizing-fixed"
            placeholder={"/* 例 */\nbody { background: red !important; }"}
            wrap="off"
            value={cssText}
            onChange={(e) => onCssTextChange(e.target.value)}
          />
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
        </Field>

        <div className="flex min-h-0 flex-1 flex-col">
          {src ? (
            <CssWebview
              ref={webviewRef}
              src={src}
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
    <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted-foreground text-sm text-background">
      ココフォリアの盤面が表示されます
    </div>
  );
}
