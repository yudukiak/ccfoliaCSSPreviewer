import type { PreviewTarget } from "@/data/cssLists";

export function resolvePreviewUrl(
  preview: PreviewTarget | null,
  cssUrl: string,
): string | null {
  if (!preview) return null;

  return /status\/main\.css/.test(cssUrl)
    ? preview.characterUrl
    : preview.roomUrl;
}
