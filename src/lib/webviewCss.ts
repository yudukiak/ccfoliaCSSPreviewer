import type { ElectronWebViewElement } from "@/vite-env";

export const INJECTED_STYLE_ID = "ccfolia-css-previewer-style";

export async function clearInjectedCss(
  webview: ElectronWebViewElement,
  previousKey: string | null,
) {
  if (previousKey) {
    try {
      await webview.removeInsertedCSS(previousKey);
    } catch {
      // ignore
    }
  }

  try {
    await webview.executeJavaScript(
      `(() => {
        const id = ${JSON.stringify(INJECTED_STYLE_ID)};
        const el = document.getElementById(id);
        if (el) el.remove();
        return true;
      })()`,
    );
  } catch {
    // navigate 中などは無視
  }
}

export async function injectCssIntoWebview(
  webview: ElectronWebViewElement,
  css: string,
  previousKey: string | null,
) {
  await clearInjectedCss(webview, previousKey);

  if (!css.trim()) {
    return null;
  }

  const key = await webview.insertCSS(css);

  await webview.executeJavaScript(
    `(() => {
      const id = ${JSON.stringify(INJECTED_STYLE_ID)};
      const cssText = ${JSON.stringify(css)};
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        (document.head || document.documentElement).appendChild(el);
      }
      el.textContent = cssText;
      return true;
    })()`,
  );

  return key;
}
