# push-confirm

## 目的

直近 commit と push 先を確認し、承認後に push する。

このコマンドは、コミット後の push 専用である。

- 直近コミットを確認する。
- 現在ブランチと upstream を確認する。
- push 先を明示する。
- ユーザー承認があるまで `git push` は実行しない。
- `--force` / `--force-with-lease` は、ユーザーが明示しない限り絶対に使わない。
- `git commit` は実行しない。

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

## 最初に確認すること

まず、必ず以下を確認する。

```bash
git status --short
git branch --show-current
git log -1 --pretty=format:'%h %an %ae %s'
git log -1 --pretty=format:'%B'
git remote -v
git rev-parse --abbrev-ref --symbolic-full-name @{u}
git status --branch --short
```

`git rev-parse --abbrev-ref --symbolic-full-name @{u}` が失敗した場合は、upstream 未設定として扱う。

## 基本方針

1. 作業ツリーが clean であることを確認する。
2. 未ステージ差分、ステージ済み差分、未追跡ファイルがある場合は、push してよいか判断できないため処理を停止する。
3. 直近コミットのハッシュ、作者、件名、本文を確認する。
4. 現在ブランチと upstream を確認する。
5. push 先を明示する。
6. ユーザー承認後にのみ `git push` を実行する。
7. push 後に `git status --branch --short` で状態を確認する。

## push してはいけない状態

以下の場合は、push せず処理を停止する。

- 作業ツリーに未コミット変更がある
- 未追跡ファイルがある
- upstream が未設定
- 現在ブランチ名が取得できない
- detached HEAD 状態である
- remote が存在しない
- push 先が不明
- 直近コミットが想定と違う可能性がある
- ユーザーが push を明示的に承認していない

## upstream がある場合

upstream が設定されている場合は、通常の push コマンドを使う。

```bash
git push
```

ただし、実行前に必ず送信先を明示する。

```text
# Push対象:
- ブランチ: feature/example
- upstream: origin/feature/example
- 実行予定コマンド: git push
```

## upstream がない場合

upstream が未設定の場合は、勝手に `git push -u` を実行しない。

現在ブランチが取得できる場合のみ、次のコマンドを提案する。

```bash
git push -u origin 現在ブランチ名
```

```text
# 要確認:
upstream が設定されていません。

# Push候補:
git push -u origin feature/example

# 次の対応:
この upstream を設定して push する場合は「OK。upstreamを設定してpush」と指示してください。
```

## 出力形式

### 出力の見た目ルール

- 出力見出しは Markdown 見出し形式にする。
- 主要見出しは `# 見出し:` の形式にする。
- 補助見出しが必要な場合は `## 見出し:` の形式にする。
- 引用形式 `> ` は、実行予定コマンドや直近コミットメッセージのような、コピー・確認対象の値に使う。
- 箇条書きは通常の `-` を使う。

## 作業ツリーが clean な場合の出力

```text
# 直近コミット:
> abc1234 紅坂柚月 akasaka@example.com [fix] #9 Webview のミュート処理を修正

# コミット本文:
> [fix] #9 Webview のミュート処理を修正
>
> プレビュー再生時に音声が鳴らないよう、Webview をミュートする処理を整理します。

# Push対象:
- ブランチ: feature/example
- upstream: origin/feature/example

# 実行予定コマンド:
> git push

# 状態:
- 作業ツリー: clean
- 未追跡ファイル: なし
- detached HEAD: いいえ

# Push実行の確認:
push する場合は「OK。push」と指示してください。
```

## 未コミット変更がある場合の出力

作業ツリーに未コミット変更がある場合は、push せず処理を終了する。

```text
# 要対応:
未コミット変更があります。
コミット後の状態だけを push 対象にするため、この状態では push しません。

# 確認した内容:
- ブランチ: feature/example
- 作業ツリー: 未コミット変更あり
- upstream: origin/feature/example

# 次の対応:
変更内容をコミットするか、退避・破棄してから再度このコマンドを実行してください。
```

## upstream 未設定の場合の出力

```text
# 要確認:
upstream が設定されていません。

# 確認した内容:
- ブランチ: feature/example
- upstream: なし
- remote: origin

# Push候補:
> git push -u origin feature/example

# Push実行の確認:
この upstream を設定して push する場合は「OK。upstreamを設定してpush」と指示してください。
```

## detached HEAD の場合の出力

```text
# 要対応:
detached HEAD 状態のため、push 先を安全に判断できません。

# 確認した内容:
- ブランチ: detached HEAD
- upstream: なし

# 次の対応:
ブランチへ checkout してから再度このコマンドを実行してください。
```

## 承認ルール

ユーザーが明示的に承認するまで、`git push` を実行してはならない。

承認例:

- `OK。push`
- `OK。これでpush`
- `pushして`
- `OK。upstreamを設定してpush`

承認後の動作:

1. `git status --short` を再確認する。
2. `git branch --show-current` を再確認する。
3. `git rev-parse --abbrev-ref --symbolic-full-name @{u}` を再確認する。
4. 作業ツリーに未コミット変更がある場合は、push せず停止する。
5. upstream がある場合は `git push` を実行する。
6. upstream がなく、ユーザーが `upstreamを設定してpush` と明示した場合だけ `git push -u origin 現在ブランチ名` を実行する。
7. push 後に `git status --branch --short` を確認して報告する。

## force push の扱い

原則として force push は行わない。

`--force` または `--force-with-lease` が必要に見える場合でも、勝手に実行しない。

force push が必要な可能性がある場合は、以下のように止める。

```text
# 要確認:
通常の push が拒否されました。
履歴がリモートと分岐している可能性があります。

# 次の対応:
fetch / pull / rebase の状況確認が必要です。
force push はユーザーが明示的に指示しない限り実行しません。
```

ユーザーが force push を明示した場合でも、次を確認する。

```bash
git fetch
git status --branch --short
git log --oneline --decorate --graph --max-count=20 --all
```

確認後、実行する場合は原則として `--force-with-lease` を優先する。

```bash
git push --force-with-lease
```

`--force` は、ユーザーが明示的に `--force` を指定した場合だけ使う。

## push 後の報告例

```text
# Push完了:
> git push

# 送信先:
- branch: feature/example
- upstream: origin/feature/example

# 直近コミット:
> abc1234 [fix] #9 Webview のミュート処理を修正

# 状態:
- 作業ツリー: clean
- リモートとの差分: なし
```

## エラー対応

`git push` が失敗した場合は、以下を報告する。

- 実行したコマンド
- エラーメッセージ
- 現在の `git status --branch --short`
- 現在のブランチ
- upstream
- 次に取るべき対応案

代表例:

- upstream が未設定
- remote が存在しない
- 認証エラー
- 権限不足
- non-fast-forward
- protected branch による拒否
- ネットワークエラー
- detached HEAD

## NG

- ユーザー承認前に `git push` しない。
- `git commit` を実行しない。
- 未コミット変更がある状態で push しない。
- 未追跡ファイルがある状態で push しない。
- upstream 未設定時に、ユーザー承認なしで `git push -u` しない。
- ユーザー明示なしに `--force` / `--force-with-lease` を使わない。
- push 先を明示せずに push しない。
- detached HEAD 状態で push しない。
