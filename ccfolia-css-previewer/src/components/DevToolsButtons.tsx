import { Button } from "@/components/ui/button";
import type { ElectronWebViewElement } from "@/vite-env";

function openVisibleWebviewDevTools() {
  const webviews = document.querySelectorAll("webview");
  for (const node of webviews) {
    const el = node as ElectronWebViewElement;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      el.openDevTools();
      return;
    }
  }
}

export function DevToolsButtons() {
  return (
    <section className="fixed right-2 bottom-2 z-50 grid grid-cols-2 gap-2">
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={() => {
          void window.electronAPI?.openDevTools();
        }}
      >
        App DevTools
      </Button>
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={openVisibleWebviewDevTools}
      >
        Web DevTools
      </Button>
    </section>
  );
}
