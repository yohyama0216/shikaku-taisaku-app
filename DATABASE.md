# データベース設定ガイド

このアプリケーションは、学習進捗データをデータベースに保存します。

## 環境別のデータベース

- **ローカル開発**: SQLite（ファイルベース、セットアップ不要）
- **本番環境（Vercel）**: Neon PostgreSQL（サーバーレスPostgreSQL）

## ローカル開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成（すでに存在する場合はスキップ）:

```bash
cp .env.example .env.local
```

`.env.local` の内容:

```env
DATABASE_PATH=local.db
NODE_ENV=development
```

### 3. データベースの初期化

```bash
npm run db:init
```

このコマンドで、ローカルに `local.db` という SQLite データベースファイルが作成され、必要なテーブルが作成されます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動し、SQLite データベースを使用します。

## 本番環境（Vercel + Neon）のセットアップ

### 1. Neon アカウントの作成

1. [Neon](https://neon.tech/) にアクセス
2. アカウントを作成（無料プランで開始可能）
3. 新しいプロジェクトを作成

### 2. データベース接続文字列の取得

Neon のダッシュボードから、PostgreSQL 接続文字列をコピーします：

```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 3. Vercel 環境変数の設定

Vercel プロジェクトの設定画面で、以下の環境変数を追加：

- **KEY**: `DATABASE_URL`
- **VALUE**: Neon の接続文字列（上記でコピーしたもの）
- **Environment**: Production, Preview, Development すべて選択

### 4. デプロイ

Vercel にデプロイすると、自動的に Neon PostgreSQL が使用されます。

```bash
# Vercel CLI を使用する場合
vercel --prod
```

または GitHub と連携している場合は、main ブランチにプッシュするだけで自動デプロイされます。

## データベーススキーマ

### question_progress テーブル

学習者の各問題に対する回答履歴を保存します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| question_id | INTEGER/PRIMARY KEY | 問題ID |
| correct_count | INTEGER | 正解した回数 |
| incorrect_count | INTEGER | 不正解だった回数 |
| last_attempt_correct | INTEGER/BOOLEAN | 最後の回答が正解だったか |
| updated_at | TIMESTAMP | 最終更新日時 |

### daily_stats テーブル

日次の学習統計を保存します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| date | TEXT/PRIMARY KEY | 日付（YYYY-MM-DD） |
| answered_count | INTEGER | 回答した問題数（累計） |
| mastered_count | INTEGER | マスターした問題数（累計） |
| updated_at | TIMESTAMP | 最終更新日時 |

### daily_activity テーブル

日次の学習活動を試験種別ごとに保存します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER/PRIMARY KEY | ID（自動採番） |
| date | TEXT | 日付（YYYY-MM-DD） |
| exam_type | TEXT | 試験種別 |
| questions_answered | INTEGER | その日に回答した問題数 |
| correct_answers | INTEGER | その日の正解数 |
| incorrect_answers | INTEGER | その日の不正解数 |
| updated_at | TIMESTAMP | 最終更新日時 |

### badge_progress テーブル

獲得したバッジの記録を保存します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | INTEGER/PRIMARY KEY | ID（自動採番） |
| badge_id | TEXT/UNIQUE | バッジID |
| achieved_date | TEXT | 獲得日（ISO形式） |
| updated_at | TIMESTAMP | 最終更新日時 |

### user_preferences テーブル

ユーザー設定を保存します。

| カラム名 | 型 | 説明 |
|---------|-----|------|
| key | TEXT/PRIMARY KEY | 設定キー |
| value | TEXT | 設定値 |
| updated_at | TIMESTAMP | 最終更新日時 |

## データベース管理コマンド

### ローカルデータベースの初期化

```bash
npm run db:init
```

SQLite データベースを初期化し、テーブルを作成します。

### Drizzle Studio の起動

```bash
npm run db:studio
```

ブラウザベースのデータベース管理ツールが起動します。データの閲覧・編集が可能です。

### スキーマの Push（Neon 使用時）

```bash
npm run db:push
```

スキーマの変更をデータベースに反映します（主に本番環境用）。

## データのバックアップ

### SQLite（ローカル）

データベースファイル `local.db` をコピーするだけです：

```bash
cp local.db local.db.backup
```

### Neon PostgreSQL（本番）

Neon のダッシュボードから、以下の方法でバックアップできます：

1. **自動バックアップ**: Neon は自動的にバックアップを作成します（プランによる）
2. **手動エクスポート**: pgdump を使用してエクスポート可能

```bash
pg_dump $DATABASE_URL > backup.sql
```

## トラブルシューティング

### ローカルでデータベースエラーが発生する場合

1. データベースファイルを削除して再初期化：

```bash
rm local.db
npm run db:init
```

2. 依存関係を再インストール：

```bash
rm -rf node_modules package-lock.json
npm install
```

### Vercel でデータベース接続エラーが発生する場合

1. Vercel の環境変数で `DATABASE_URL` が正しく設定されているか確認
2. Neon の接続文字列が正しいか確認
3. Neon のプロジェクトがアクティブ状態か確認

### パフォーマンスの最適化

- **Neon**: サーバーレスのため、コールドスタートが発生する場合があります。プランをアップグレードすることで改善できます。
- **SQLite**: ローカル開発では十分高速ですが、本番環境では使用しません。

## APIエンドポイント

データベース操作は以下の API エンドポイントを通じて行われます：

### `/api/progress`

- **GET**: 問題の進捗を取得
  - クエリパラメータ: `questionId`（オプション）
- **POST**: 問題の進捗を保存
  - ボディ: `{ questionId, isCorrect, examType }`
- **DELETE**: すべての進捗をクリア

### `/api/stats`

- **GET**: 統計情報を取得
  - クエリパラメータ: `type`（`history`, `activity`, `today`）
  - クエリパラメータ: `examType`（`type=today` の場合必須）

## セキュリティ

- データベース接続文字列は環境変数で管理し、コードにハードコードしない
- `.env.local` ファイルは `.gitignore` に含まれており、Git にコミットされません
- 本番環境では SSL/TLS 接続が使用されます（Neon）

## さらに詳しい情報

- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
- [Neon ドキュメント](https://neon.tech/docs)
- [Better SQLite3 ドキュメント](https://github.com/WiseLibs/better-sqlite3)
