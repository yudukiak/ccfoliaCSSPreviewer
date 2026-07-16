# Cursor Commands

ccfoliaCSSPreviewer 用の Cursor slash コマンド定義。

ファイル名が `/` コマンド名になる（例: `commit-message.md` → `/commit-message`）。

## 標準フロー

新タスク化 → `/issue-create`

作業完了 → `/stage-select` → `/commit-message` → `/push-confirm` → `/issue-worklog`

## 現行コマンド

| コマンド | 役割 | 名前の理由 |
|---------|------|-----------|
| `stage-select` | 会話内容からステージ対象を選び、承認後に git add | コミット前のステージング専用 |
| `commit-message` | ステージ済み差分からコミットメッセージ案を作成し commit | メッセージ作成が主処理であることを明示 |
| `push-confirm` | 直近 commit と push 先を確認し、承認後に push | `check` ではなく「確認してから実行」の意味 |
| `issue-create` | 会話から Issue 案を作成し、承認後に起票 | 作業前の Issue 作成専用 |
| `issue-worklog` | 作業内容を GitHub Issue コメントに残す | Issue 系は `issue-*` 名前空間で拡張 |

## 命名規約

```text
stage-select     … 標準ステージングフロー（会話内容から対象選択 + 承認後 git add）
stage-*          … ステージングの特殊操作
commit-message   … 標準 commit フロー（メッセージ案 + 承認後 commit）
commit-*         … commit の特殊操作（標準とルールが1つでも違う場合）
push-confirm     … 標準 push フロー（確認 + 承認後 push）
push-*           … push の特殊操作（将来用）
issue-*          … GitHub Issue 操作
```

1. 標準フローは覚えやすい固定名（`commit-message`, `push-confirm`）
2. 標準とルールが異なる操作は `commit-*` / `issue-*` を新設し、本体を肥大化させない
3. サフィックスは動詞または名詞1語（例: `commit-split`, `issue-create`）

## 予約名（未実装）

| 名前 | 用途 |
|------|------|
| `commit-split` | 混在したステージ済み変更の分割 commit |
| `commit-amend` | 直前 commit の修正 |
| `commit-msg-only` | メッセージ案のみ（commit しない） |

## 新規コマンド追加チェックリスト

- 標準 `commit-message` / `push-confirm` では足りない理由がある
- 名前は上記命名規約に従う
- ファイル先頭 H1 をコマンド名と一致させる
- 承認前に破壊的操作（add / commit / push / force）をしない
- `## 目的` の1行目はスラッシュコマンド概要として表示される（30字前後推奨、長くても40字以内）
- 詳細は2行目以降または箇条書きに書く
