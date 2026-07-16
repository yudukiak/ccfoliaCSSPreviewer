# issue-worklog

## 目的

作業内容を GitHub Issue コメントに残す。

このコマンドは、Cursor の Plan / Build / 修正 / コミット / push が終わった後に、今回の作業ログを Issue に残すための専用コマンドである。

Issue に作業記録を残すことで、後から以下を追えるようにする。

- 何をしたか
- なぜその対応にしたか
- どのファイルや領域を触ったか
- 検証で何を実行したか
- 問題点や未解決事項があったか
- ユーザーから追加の修正指示があったか
- 実装中に疑念・判断保留・今後見直すべき点があったか
- どのコミットで対応したか
- push 済みかどうか

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

このコマンドは GitHub Issue への記録専用であり、次の操作は行わない。

- コード修正
- `git add`
- `git commit`
- `git push`
- Issue の close
- Issue タイトルや本文の変更
- ラベル変更
- milestone 変更
- assignee 変更

## 最初に確認すること

まず、必ず以下を確認する。

```bash
git status --branch --short
git branch --show-current
git log -1 --pretty=format:'%h %an %ae %s'
git log -1 --pretty=format:'%B'
git remote -v
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

必要に応じて、Issue番号の推定材料として以下も確認する。

```bash
git branch --show-current
git log -1 --pretty=format:'%s'
git log -1 --pretty=format:'%B'
```

## Issue 番号の特定

Issue 番号は、以下の優先順位で特定する。

1. ユーザーが明示した Issue 番号
2. 直近コミットの1行目に含まれる `#9` のような Issue 番号
3. 直近コミット本文に含まれる `#9` のような Issue 番号
4. ブランチ名に含まれる Issue 番号
5. 直近の会話で明確に参照されている Issue 番号

Issue 番号が明確に特定できない場合は、コメントを投稿しない。

その場合は、次の形式で止める。

```text
# 要確認:
Issue 番号を特定できません。

# 確認した内容:
- ブランチ: feature/example
- 直近コミット: abc1234 [fix] XXXXX
- コミット本文: Issue 番号なし

# 次の対応:
コメントを投稿する Issue 番号を指定してください。

例:
Issue #9 に作業ログを残して
```

## GitHub コメント投稿の方針

GitHub Issue に投稿する前に、必ずコメント案を表示してユーザー承認を得る。

ユーザーが明示的に承認するまで、GitHub Issue へコメントを投稿してはならない。

承認例:

- `OK。Issueに投稿`
- `OK。投稿して`
- `その内容でIssueに残して`
- `Issue #9 に投稿して`

コメント投稿後は、投稿先 Issue 番号とコメント投稿済みであることを報告する。

## コメントに必ず含める内容

Issue コメントには、原則として以下を含める。

- 作業日時
- 対応したコミット
- 対応ブランチ
- push 状態
- 今回の対応内容
- 変更した主な領域・ファイル
- 実施した検証
- 修正指示への対応
- 問題点・詰まった点
- 疑念・判断保留
- 未対応・今後の確認事項
- 次に見る人向けの補足

ただし、存在しない情報を捏造しない。

不明な場合は「不明」または「記録なし」と書く。

実行していない検証を「実行済み」と書かない。

## 作業内容の整理観点

作業ログを作るときは、以下の観点で整理する。

### 何をしたか

- Issue の要求に対して、どの対応を行ったか
- 実装した内容
- 削除した内容
- 移動・リネームした内容
- 設定変更した内容
- ドキュメント更新した内容

### なぜそうしたか

- Issue の目的にどう対応したか
- 既存構成や方針に合わせた理由
- 別案を採用しなかった理由
- 安全性、保守性、運用性の観点

### どこを触ったか

- `src/main.ts`
- `src/preload.ts`
- `src/components/`
- `src/atoms/`
- `src/data/`
- `src/lib/`
- Forge / Vite 設定
- その他の具体的なファイル

### 検証

- 実行したコマンド
- 成功・失敗の結果
- 実行していない理由
- 検証不能だった理由

### 問題点

- 実装中に詰まった点
- 仕様が曖昧だった点
- 将来バグになりそうな点
- 既存実装の気になった点
- 追加調査が必要な点

### 修正指示

- ユーザーから途中で出た修正指示
- 指示に対してどう直したか
- 指示を反映しなかった場合の理由

### 疑念・判断保留

- 判断に迷った点
- 今後見直した方がよい点
- Issue 外として扱った点
- 別 Issue 化した方がよい点

## 出力形式

### 出力の見た目ルール

- 出力見出しは Markdown 見出し形式にする。
- 主要見出しは `# 見出し:` の形式にする。
- GitHub に投稿するコメント案は `# Issueコメント案:` の中に Markdown として出す。
- コメント案はコードブロックで囲む。
- コメント案以外の説明は、通常の Markdown で出す。
- 実行予定の投稿先 Issue を明示する。

## コメント案の出力例

```text
# 投稿先:
- Repository: yudukiak/ccfoliaCSSPreviewer
- Issue: #9
- 操作: Issue コメント追加

# Issueコメント案:
```md
## 作業ログ

### 対応コミット

- Commit: abc1234
- Branch: feature/example
- Push: 済み
- Author: 紅坂柚月 akasaka@example.com

### 対応内容

- Webview のミュート処理を整理しました。
- プレビュー再生時に音声が鳴らないよう設定を調整しました。
- 既存実装の不整合を修正しました。

### 変更した主な領域

- `src/components/CssWebview.tsx`
- `src/atoms/ccfolia.ts`

### 検証

- `npm run lint`: 成功
- `npm start`: 目視でミュート動作を確認

### 修正指示への対応

- 途中で追加された Webview 設定に関する指示を反映しました。

### 問題点・詰まった点

- Webview の属性設定が一部コンポーネント間で揃っていませんでした。

### 疑念・判断保留

- ローカルストレージ連携の拡張は今回の Issue 範囲外として扱いました。
- 後続でタブ切り替え時の再注入方針確認が必要です。

### 未対応・今後の確認事項

- 表示確認は `npm start` での目視確認が必要です。
```

# 投稿実行の確認:
この内容で Issue #9 にコメントする場合は「OK。Issueに投稿」と指示してください。
```

## コメント本文のテンプレート

GitHub Issue に投稿するコメント本文は、原則として以下のテンプレートを使う。

```md
## 作業ログ

### 対応コミット

- Commit: <短縮SHA>
- Branch: <ブランチ名>
- Push: <済み / 未確認 / 未実行>
- Author: <作者名 メールアドレス>

### 対応内容

- <今回行った対応>
- <今回行った対応>
- <今回行った対応>

### 変更した主な領域

- `<path>`
- `<path>`

### 検証

- `<command>`: <成功 / 失敗 / 未実行>
- `<command>`: <成功 / 失敗 / 未実行>

### 修正指示への対応

- <修正指示と対応内容>
- 記録なし

### 問題点・詰まった点

- <問題点>
- 記録なし

### 疑念・判断保留

- <疑念や判断保留>
- 記録なし

### 未対応・今後の確認事項

- <未対応事項>
- 記録なし
```

## push 状態の判断

push 状態は、以下で確認する。

```bash
git status --branch --short
```

判断例:

- `ahead 0` または差分なし: push 済みと判断してよい
- `ahead 1` 以上: 未push
- upstream 未設定: 未確認
- コマンド失敗: 未確認

曖昧な場合は「未確認」と書く。

## コメント投稿前の確認

コメント投稿前に、必ず以下を確認する。

- 投稿先 Repository
- 投稿先 Issue 番号
- コメント本文
- 直近コミット
- ブランチ
- push 状態
- 検証結果
- 未対応事項

## 承認ルール

ユーザーが明示的に承認するまで、GitHub Issue へコメントを投稿してはならない。

承認例:

- `OK。Issueに投稿`
- `OK。投稿して`
- `Issueに残して`
- `Issue #9 に投稿して`

承認後の動作:

1. 投稿先 Issue 番号を再確認する。
2. コメント本文を再確認する。
3. GitHub MCP の `add_issue_comment` で Issue にコメントを投稿する。
4. 投稿結果を報告する。

## 投稿後の報告例

```text
# Issueコメント投稿完了:
- Repository: yudukiak/ccfoliaCSSPreviewer
- Issue: #9
- 操作: コメント追加

# 投稿内容:
作業ログを投稿しました。
```

## エラー対応

Issue コメント投稿が失敗した場合は、以下を報告する。

- 投稿先 Repository
- 投稿先 Issue 番号
- エラーメッセージ
- コメント本文
- 次に取るべき対応案

代表例:

- Issue 番号が不明
- Issue が存在しない
- GitHub 認証エラー
- 権限不足
- ネットワークエラー
- コメント本文が空
- 投稿先 Repository が違う

## NG

- ユーザー承認前に Issue コメントを投稿しない。
- Issue 番号が不明な状態でコメントを投稿しない。
- Issue 本文を勝手に編集しない。
- Issue を勝手に close しない。
- ラベル、milestone、assignee を勝手に変更しない。
- `git add` しない。
- `git commit` しない。
- `git push` しない。
- 実行していない検証を実行済みとして書かない。
- 不明な情報を捏造しない。
- 問題点や疑念があった場合に省略しない。
- ユーザーからの修正指示があった場合に省略しない。
