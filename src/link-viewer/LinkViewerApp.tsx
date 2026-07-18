import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopyUrl } from "./useCopyUrl";
import { useLinkViewerNavigation } from "./useLinkViewerNavigation";

export function LinkViewerApp() {
  const { url, webviewRef } = useLinkViewerNavigation();
  const { handleCopy, CopyStatusIcon, copyButtonClassName } = useCopyUrl(url);

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
