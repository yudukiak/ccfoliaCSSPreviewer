export const UNSET_PUBLISHED_ID = "unset";

export type CssListItem = {
  id: string;
  title: string;
  cssUrl: string;
  homepageUrl?: string;
  extraCss?: string;
};

export type PreviewTarget = {
  roomUrl: string;
  characterUrl: string;
};

export const publishedCssLists: CssListItem[] = [
  {
    id: UNSET_PUBLISHED_ID,
    title: "未設定",
    cssUrl: "",
  },
  {
    id: "board",
    title: "盤面のみ",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/board.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-board/",
  },
  {
    id: "movie",
    title: "動画のみ",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/movie.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-movie/",
  },
  {
    id: "balloon",
    title: "吹き出しのみ（デザイン変更可）",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/balloon/main.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-balloon-2/",
  },
  {
    id: "status",
    title: "ステータス（固定化）",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/status/main.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-status2/",
  },
  {
    id: "chat",
    title: "ルームチャット",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/chat/main.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-chat/",
    extraCss:
      ".MuiList-root>div:nth-child(1)>div>div:nth-last-child(-n+3)>div { display: flex !important; }",
  },
  {
    id: "timer",
    title: "タイマー",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/timer.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-timer/",
  },
  {
    id: "bgm",
    title: "BGM",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/bgm/bgm.css",
    homepageUrl: "https://ydk.vc/obs-ccfolia-css-bgm/",
  },
];

export const assetCssLists: CssListItem[] = [
  {
    id: "asset-balloon",
    title: "吹き出しを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/balloon.css",
  },
  {
    id: "asset-board",
    title: "盤面そのものを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/board.css",
  },
  {
    id: "asset-board-background",
    title: "盤面の「背景」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/boardBackground.css",
  },
  {
    id: "asset-board-foreground",
    title: "盤面の「前景」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/boardForeground.css",
  },
  {
    id: "asset-card-deck",
    title: "「カードデッキ」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/cardDeck.css",
  },
  {
    id: "asset-character",
    title: "盤面の「キャラクター」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/character.css",
  },
  {
    id: "asset-chat",
    title: "「ルームチャット」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/chat.css",
  },
  {
    id: "asset-ctrl-drag",
    title: "「Ctrl + ドラッグ」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/ctrlDrag.css",
  },
  {
    id: "asset-cut-in",
    title: "「カットイン」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/cutIn.css",
  },
  {
    id: "asset-dice-symbol",
    title: "「ダイスシンボル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/diceSymbol.css",
  },
  {
    id: "asset-edit",
    title: "鉛筆マークを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/edit.css",
  },
  {
    id: "asset-header",
    title: "ヘッダー周りのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/header.css",
  },
  {
    id: "asset-marker-panel",
    title: "「マーカーパネル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/markerPanel.css",
  },
  {
    id: "asset-modal",
    title: "広告動画のUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/modal.css",
  },
  {
    id: "asset-monitoring",
    title: "監視モードのお知らせを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/monitoring.css",
  },
  {
    id: "asset-new-dice",
    title: "盤面上を転がるダイスを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/newDice.css",
  },
  {
    id: "asset-scaling",
    title: "拡大縮小のUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/scaling.css",
  },
  {
    id: "asset-screen-panel",
    title: "「スクリーンパネル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/screenPanel.css",
  },
  {
    id: "asset-status",
    title: "キャラのステータスのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/status.css",
  },
  {
    id: "asset-timer",
    title: "「タイマー」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/timer.css",
  },
  {
    id: "asset-volume",
    title: "BGM周りのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/volume.css",
  },
];

export const cssListById = Object.fromEntries(
  [...publishedCssLists, ...assetCssLists].map((item) => [item.id, item]),
) as Record<string, CssListItem>;

export function getCssListItem(id: string) {
  return cssListById[id];
}
