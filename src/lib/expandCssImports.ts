const IMPORT_URL_RE = /@import\s+url\(["']([^"']+)["']\)\s*;/g;

export async function expandCssImports(cssText: string): Promise<string> {
  if (!cssText.trim()) return "";

  const urls: string[] = [];
  const remainder = cssText.replace(
    new RegExp(IMPORT_URL_RE.source, "g"),
    (_, url: string) => {
      urls.push(url);
      return "";
    },
  );

  const parts: string[] = [];

  if (urls.length > 0) {
    if (!window.electronAPI?.fetchText) {
      throw new Error("electronAPI.fetchText がありません（preload未読込）");
    }
    for (const url of urls) {
      parts.push(await window.electronAPI.fetchText(url));
    }
  }

  const rest = remainder.trim();
  if (rest) {
    parts.push(rest);
  }

  return parts.join("\n");
}
