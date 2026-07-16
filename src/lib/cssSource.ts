export function buildCssSource(
  publishedCssUrl: string,
  publishedExtraCss: string | undefined,
  assetCssUrls: string[],
  customCssText: string,
): string {
  const blocks: string[] = [];

  if (publishedCssUrl) {
    blocks.push("/* 公開CSS */");
    blocks.push(`@import url("${publishedCssUrl}");`);
  }

  const assetUrls = assetCssUrls.filter(Boolean);
  if (assetUrls.length > 0) {
    blocks.push("/* アセットCSS */");
    blocks.push(assetUrls.map((url) => `@import url("${url}");`).join("\n"));
  }

  if (publishedExtraCss?.trim()) {
    blocks.push(publishedExtraCss.trim());
  }

  if (customCssText.trim()) {
    blocks.push("/* カスタムCSS */");
    blocks.push(customCssText.trim());
  }

  return blocks.length > 0 ? blocks.join("\n") : "";
}
