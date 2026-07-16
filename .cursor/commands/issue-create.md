# issue-create

## 目的

会話から Issue 案を作成し、承認後に起票する。

このコマンドは、作業開始前に新タスクを Issue として起票するための専用コマンドである。

`/issue-worklog` が作業後の記録用であるのに対し、このコマンドは作業前の起票用である。

- タイトルと本文案を提示する。
- 類似 Issue があれば警告する。
- ユーザー承認があるまで Issue を作成しない。
- ユーザーが明示した場合のみラベル・assignee を付ける。

## このリポジトリの前提

このリポジトリは ccfoliaCSSPreviewer（ココフォリア向けカスタム CSS プレビュー用 Electron アプリ）である。

技術スタック: Electron Forge + Vite + React + TypeScript + Tailwind + jotai + shadcn

主な構成:

- `src/main.ts`: Electron メインプロセス
- `src/preload.ts`: preload スクリプト
- `src/renderer.tsx` / `src/App.tsx`: React レンダラー
- `src/components/`: UI・プレビュー関連コンポーネント
- `src/atoms/`: jotai 状態
- `src/data/`: CSS リスト等のデータ
- `src/lib/`: ユーティリティ
- `forge.config.ts` / `vite.*.config.*`: Electron Forge + Vite 設定

このコマンドは GitHub Issue の新規作成専用であり、次の操作は行わない。

- コード修正
- `git add`
- `git commit`
- `git push`
- 既存 Issue へのコメント
- Issue の close
- 既存 Issue タイトルや本文の変更
- ラベル・milestone・assignee の勝手な変更

## 最初に確認すること

まず、必ず以下を確認する。

```bash
git remote -v
```

Repository は `git remote -v` の `origin` から特定する。通常は `yudukiak/ccfoliaCSSPreviewer` である。

## 基本方針

1. 会話・ユーザー指示からタイトルと本文を整理する。
2. 類似 Issue を検索する。
3. Issue 作成案を表示する。
4. ユーザー承認後にのみ Issue を作成する。
5. 作成後に Issue 番号と URL を報告する。

## Issue 作成手段

Issue 作成は、次の優先順位で行う。

1. `gh issue create`（優先）
2. GitHub MCP `create_issue`（`gh` が使えない場合のみ）

## 入力の整理

会話・ユーザー指示から以下を抽出する。

### タイトル（必須）

- 1行で簡潔に書く。
- リポジトリの既存 Issue タイトル調に合わせる。
- タイトルが確定できない場合は Issue を作成しない。

### 本文（必須）

- Markdown で書く。
- 会話にない内容を捏造しない。
- 背景・過去の議論の冗長な転記は避ける。

### ラベル / assignee（任意）

- ユーザーが明示した場合のみ提案・付与する。
- 明示がない場合は付けない。

## 重複チェック

Issue 作成案を出す前に、類似 Issue を確認する。

```bash
gh issue list --search "キーワード" --limit 5
```

`gh` が使えない場合は GitHub MCP `search_issues` を使う。

類似 Issue が見つかった場合は、`# Issue作成案:` より前に警告する。

```text
# 要確認:
類似 Issue が見つかりました。

- #28 タイトル例
- #15 タイトル例

新規作成を続ける場合は、その旨を指示してください。
```

類似 Issue がなければ、そのまま作成案を出す。

## Issue 本文テンプレート

Issue 本文は、原則として以下のテンプレートを使う。

```md
## 概要

## 背景

## やること

## 受け入れ条件
```

会話にないセクションは省略するか「記載なし」と書く。

## 出力形式

### 出力の見た目ルール

- 出力見出しは Markdown 見出し形式にする。
- 主要見出しは `# 見出し:` の形式にする。
- GitHub に作成する Issue 案は `# Issue作成案:` の中に Markdown として出す。
- Issue 案はコードブロックで囲む。
- Issue 案以外の説明は、通常の Markdown で出す。
- 作成先 Repository を明示する。

## 作成案の出力例

```text
# 作成先:
- Repository: yudukiak/ccfoliaCSSPreviewer
- 操作: Issue 新規作成

# Issue作成案:
- タイトル: Webview でカスタム CSS の反映を確認できるようにする

```md
## 概要

プレビュー用 Webview にカスタム CSS を注入し、反映結果を確認できるようにする。

## 背景

現状では CSS 編集後の見た目確認がしづらい。

## やること

- CssWebview への CSS 注入処理を確認する
- ナビ・タブ切り替え時の再反映を整理する

## 受け入れ条件

- `npm start` で起動し、編集した CSS がプレビューに反映される
```

# 実行予定:
> gh issue create --repo yudukiak/ccfoliaCSSPreviewer --title "Webview でカスタム CSS の反映を確認できるようにする" --body-file <一時ファイル>

# Issue作成の確認:
この内容で Issue を作成する場合は「OK。Issueを作成」と指示してください。
```

ラベル・assignee を付ける場合は、実行予定コマンドに `--label` / `--assignee` を明示する。

## Issue 作成前の確認

Issue 作成前に、必ず以下を確認する。

- 作成先 Repository
- タイトル
- 本文
- ラベル（指定がある場合）
- assignee（指定がある場合）
- 類似 Issue の有無

## 承認ルール

ユーザーが明示的に承認するまで、GitHub Issue を作成してはならない。

承認例:

- `OK。Issueを作成`
- `OK。作成して`
- `その内容でIssueを作成`

承認後の動作:

1. タイトルと本文を再確認する。
2. `gh issue create`（または GitHub MCP `create_issue`）で Issue を作成する。
3. 作成された Issue 番号と URL を報告する。

## 作成後の報告例

```text
# Issue作成完了:
- Repository: yudukiak/ccfoliaCSSPreviewer
- Issue: #42
- URL: https://github.com/yudukiak/ccfoliaCSSPreviewer/issues/42

# 作成内容:
- タイトル: Webview でカスタム CSS の反映を確認できるようにする
```

## エラー対応

Issue 作成が失敗した場合は、以下を報告する。

- 作成先 Repository
- 実行したコマンドまたは MCP 操作
- エラーメッセージ
- タイトル
- 本文
- 次に取るべき対応案

代表例:

- タイトルが空
- 本文が空
- GitHub 認証エラー
- 権限不足
- ネットワークエラー
- 存在しないラベル・assignee
- 作成先 Repository が違う

## NG

- ユーザー承認前に Issue を作成しない。
- タイトル未確定の状態で Issue を作成しない。
- ラベル・assignee をユーザー明示なしに付けない。
- milestone を勝手に設定しない。
- 既存 Issue へコメントしない。
- 既存 Issue を勝手に close しない。
- 既存 Issue タイトルや本文を勝手に編集しない。
- `git add` しない。
- `git commit` しない。
- `git push` しない。
- 不明な情報を捏造しない。
- 会話にない背景や過去情報を冗長に転記しない。
