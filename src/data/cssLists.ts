export type CssListItem = {
  title: string;
  cssUrl: string;
  hpUrl?: string;
  style?: string;
};

export type PreviewTarget = {
  roomUrl: string;
  characterUrl: string;
};

export const cssLists: CssListItem[] = [
  // 公開されているCSS
  {
    title: "未設定",
    cssUrl: "",
    hpUrl: "",
  },
  {
    title: "盤面のみ",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/board.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-board/",
  },
  {
    title: "動画のみ",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/movie.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-movie/",
  },
  {
    title: "吹き出しのみ（デザイン変更可）",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/balloon/main.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-balloon-2/",
  },
  {
    title: "ステータス（固定化）",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/status/main.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-status2/",
  },
  {
    title: "ルームチャット",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/chat/main.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-chat/",
    style:
      ".MuiList-root>div:nth-child(1)>div>div:nth-last-child(-n+3)>div { display: flex !important; }",
  },
  {
    title: "タイマー",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/timer.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-timer/",
  },
  {
    title: "BGM",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/bgm/bgm.css",
    hpUrl: "https://ydk.vc/obs-ccfolia-css-bgm/",
  },
  // アセット一覧
  {
    title: "吹き出しを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/balloon.css",
  },
  {
    title: "盤面そのものを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/board.css",
  },
  {
    title: "盤面の「背景」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/boardBackground.css",
  },
  {
    title: "盤面の「前景」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/boardForeground.css",
  },
  {
    title: "「カードデッキ」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/cardDeck.css",
  },
  {
    title: "盤面の「キャラクター」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/character.css",
  },
  {
    title: "「ルームチャット」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/chat.css",
  },
  {
    title: "「Ctrl + ドラッグ」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/ctrlDrag.css",
  },
  {
    title: "「カットイン」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/cutIn.css",
  },
  {
    title: "「ダイスシンボル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/diceSymbol.css",
  },
  {
    title: "鉛筆マークを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/edit.css",
  },
  {
    title: "ヘッダー周りのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/header.css",
  },
  {
    title: "「マーカーパネル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/markerPanel.css",
  },
  {
    title: "広告動画のUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/modal.css",
  },
  {
    title: "監視モードのお知らせを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/monitoring.css",
  },
  {
    title: "盤面上を転がるダイスを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/newDice.css",
  },
  {
    title: "拡大縮小のUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/scaling.css",
  },
  {
    title: "「スクリーンパネル」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/screenPanel.css",
  },
  {
    title: "キャラのステータスのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/status.css",
  },
  {
    title: "「タイマー」を消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/timer.css",
  },
  {
    title: "BGM周りのUIを消す",
    cssUrl: "https://yudukiak.github.io/ccfoliaCSS/CSS/asset/volume.css",
  },
];
