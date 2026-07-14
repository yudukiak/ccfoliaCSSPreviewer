import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { LuExternalLink } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Link } from "@/components/ui/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CssWebview, type CssWebviewHandle } from "@/components/CssWebview";
import { cssLists, type PreviewTarget } from "@/data/cssLists";

const TRIGGER_CLASS_NAME =
  "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30";

type CcfoliaTabsProps = {
  preview: PreviewTarget;
};

export function CcfoliaTabs({ preview }: CcfoliaTabsProps) {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl);
  const assetCssLists = cssLists.filter((list) => !list.hpUrl);
  const [manualCss, setManualCss] = useState("");

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

          <div className="flex w-full flex-col gap-1.5">
            <p className="px-1 text-sm font-medium text-foreground">手動</p>
            <div className="grid w-full grid-cols-4 gap-1">
              <TabsTrigger
                value="manual-room"
                className={TRIGGER_CLASS_NAME}
              >
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

      <TabsContent value="manual-room">
        <ManualCssPanel
          title="手動（ルームURL）"
          src={preview.roomUrl}
          cssText={manualCss}
          onCssTextChange={setManualCss}
        />
      </TabsContent>

      <TabsContent value="manual-character">
        <ManualCssPanel
          title="手動（キャラURL）"
          src={preview.characterUrl}
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
  src: string;
  cssText: string;
  onCssTextChange: (value: string) => void;
}) {
  const webviewRef = useRef<CssWebviewHandle>(null);
  const [applying, setApplying] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="break-all">{src}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor={`manual-css-${src}`}>CSS（ベタ打ち）</FieldLabel>
          <Textarea
            id={`manual-css-${src}`}
            className="min-h-40 font-mono text-xs"
            placeholder={"/* 例 */\nbody { background: red !important; }"}
            value={cssText}
            onChange={(e) => onCssTextChange(e.target.value)}
          />
        </Field>

        <Button
          disabled={!cssText.trim() || applying}
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

        <CssWebview
          ref={webviewRef}
          src={src}
          className="h-[480px] w-full rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
