# stage-select

## 目的

会話内容からステージ対象を選び、承認後に git add する。

- Cursor との会話で扱ったファイルだけを候補にする。
- 会話外のファイルはステージしない。
- 変更内容を確認する。
- ステージ対象ファイルを明示する。
- ユーザー承認があるまで `git add` しない。
- `git commit` は実行しない。
- `git push` は実行しない。
- `git add -A` は原則使用しない。

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

このコマンドはステージング判断専用であり、次の操作は行わない。

- `git commit`
- `git push`
- 承認前の `git add`
- 承認前の `git add -A`
- 勝手な `git add -p`

## 最初に確認すること

まず、必ず以下を確認する。

```bash
git status --short
git status --branch --short
git branch --show-current
git diff --stat
git diff --name-status
git diff --cached --stat
git diff --cached --name-status
git ls-files --others --exclude-standard
```

必要に応じて内容確認のために以下も使う。

```bash
git diff
git diff --cached
```

## 最重要ルール

このコマンドでは、**Cursor との会話外のファイルをステージしてはいけない**。

たとえば、`git status` に以下が出ていても、

```text
M src/components/CcfoliaNav.tsx
M src/components/CcfoliaTabs.tsx
M README.md
?? tmp/debug.txt
```

Cursor との会話で `CcfoliaNav.tsx` と `CcfoliaTabs.tsx` だけを扱っていた場合、`README.md` と `tmp/debug.txt` はステージ禁止。

```bash
git add src/components/CcfoliaNav.tsx src/components/CcfoliaTabs.tsx
```

のように、対象ファイルを明示する。

## ファイル分類ルール

`git status` に出たファイルを、以下に分類する。

```text
A. 今回の Cursor 会話・作業で明確に扱ったファイル
B. 今回の作業に関係がある可能性はあるが、会話内で明示されていないファイル
C. 今回の会話外のファイル
D. 不要ファイル・生成物・機密の可能性があるファイル
```

ステージしてよいのは A のみ。

B / C / D はステージしない。

判断できない場合は、勝手に含めず停止する。

## `git add -A` の扱い

`git add -A` は原則禁止。

理由:

- 会話外の変更を巻き込む危険がある
- 未追跡ファイルをまとめて追加してしまう
- 一時ファイルや生成物を誤って含める可能性がある
- `/stage-select` の目的が「選択してステージ」だから

例外的に使えるのは、以下をすべて満たす場合のみ。

- `git status --short` に出ている全ファイルが今回の Cursor 作業対象
- 会話内で全ファイルが言及・確認されている
- 未追跡ファイルもすべて今回作成したものだと確認できる
- ユーザーが `全部stageして` と明示している
- 実行前に `git add -A` で含まれるファイル一覧を表示している

それ以外では、ファイルパス指定で `git add` する。

## ステージ候補の作り方

### 会話内ファイルだけの場合

```text
# ステージ候補:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# 実行予定コマンド:
> git add src/components/CcfoliaNav.tsx src/components/CcfoliaTabs.tsx
```

### 会話外ファイルが混ざっている場合

```text
# ステージ対象:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# ステージしないファイル:
- README.md
- tmp/debug.txt

# 理由:
README.md と tmp/debug.txt は今回の Cursor 会話で扱っていないため、ステージ対象から除外します。
```

## 同一ファイル内の混在変更

同じファイル内に、今回の会話に関係する変更と関係しない変更が混ざっている場合は、ファイル全体を `git add` しない。

この場合は停止し、部分ステージを案内する。

```bash
git add -p path/to/file
```

ただし、このコマンド自体で `git add -p` を勝手に実行しない。

出力例:

```text
# 要確認:
src/components/CcfoliaNav.tsx に、今回の会話内容と関係しない可能性がある変更が混ざっています。

# 対応:
ファイル全体のステージは行いません。
必要な hunk だけを手動でステージしてください。

# 候補:
> git add -p src/components/CcfoliaNav.tsx
```

## ステージしてはいけないファイル

以下は、会話内で明示されていない限りステージ禁止。

```text
.env
.env.*
*.pem
*.key
*.p12
*.pfx
node_modules/
.node_modules_trash/
dist/
.DS_Store
tmp/
*.log
```

以下のような文字列が差分に含まれる場合も停止する。

```text
TOKEN
SECRET
PASSWORD
API_KEY
PRIVATE_KEY
Authorization
Bearer
x-deploy-token
```

## 出力形式

### 出力の見た目ルール

- 出力見出しは Markdown 見出し形式にする。
- 主要見出しは `# 見出し:` の形式にする。
- 補助見出しが必要な場合は `## 見出し:` の形式にする。
- 実行予定コマンドは引用形式 `> ` で出す。
- 箇条書きは通常の `-` を使う。

## 出力例: ステージ可能な場合

```text
# 変更確認:
- ブランチ: feature/example
- ステージ済み変更: なし
- 未ステージ変更: 2件
- 未追跡ファイル: なし

# 今回のCursor会話で扱ったファイル:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# ステージ対象:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# 実行予定コマンド:
> git add src/components/CcfoliaNav.tsx src/components/CcfoliaTabs.tsx

# ステージ実行の確認:
この内容をステージする場合は「OK。stage」と指示してください。
```

## 出力例: 会話外ファイルがある場合

```text
# 変更確認:
- ブランチ: feature/example
- 未ステージ変更: 3件
- 未追跡ファイル: 1件

# 今回のCursor会話で扱ったファイル:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# ステージ対象:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# ステージしないファイル:
- README.md
- tmp/debug.txt

# 理由:
README.md と tmp/debug.txt は今回の Cursor 会話で扱っていないため、ステージ対象から除外します。

# 実行予定コマンド:
> git add src/components/CcfoliaNav.tsx src/components/CcfoliaTabs.tsx

# ステージ実行の確認:
この内容をステージする場合は「OK。stage」と指示してください。
```

## 出力例: 判断不能な場合

```text
# 要確認:
git status に表示された変更の一部が、今回の Cursor 会話で扱われたものか判断できません。

# 判断できないファイル:
- src/data/cssLists.ts

# 対応:
会話外のファイルを誤ってステージしないため、処理を停止します。
このファイルもステージ対象に含める場合は、明示してください。
```

## ユーザー承認ルール

ユーザーが明示的に承認した場合のみ、提示した `git add` を実行する。

承認例:

```text
OK。stage
OK。その2ファイルをstage
OK。提示内容でstage
```

承認後の動作:

1. `git status --short` を再確認する。
2. 提示済みの `git add` コマンドだけを実行する。
3. 承認後に以下を確認する。

```bash
git status --short
git diff --cached --stat
git diff --cached --name-status
```

## 実行後の出力例

```text
# ステージ完了:
以下の変更をステージしました。

# ステージ済み:
- src/components/CcfoliaNav.tsx
- src/components/CcfoliaTabs.tsx

# 次の対応:
コミットメッセージを作成する場合は `/commit-message` を実行してください。
```

## エラー対応

`git add` が失敗した場合は、以下を報告する。

- 実行したコマンド
- エラーメッセージ
- 現在の `git status --short`
- 次に取るべき対応案

代表例:

- 指定したファイルが存在しない
- パスが誤っている
- コンフリクト中である
- 権限エラー

## NG

- ユーザー承認前に `git add` しない。
- ユーザー承認前に `git add -A` しない。
- `git commit` を実行しない。
- `git push` を実行しない。
- Cursor との会話外のファイルをステージしない。
- 判断できないファイルを勝手にステージしない。
- 同一ファイル内に会話外の変更が混ざっている場合、ファイル全体を `git add` しない。
- 勝手に `git add -p` を実行しない。
- 機密ファイルや不要ファイルを、会話内で明示されていない限りステージしない。
- 差分に機密らしき文字列が含まれる場合、確認せずにステージしない。
