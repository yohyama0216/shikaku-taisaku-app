# 資格試験対策クイズアプリ

資格試験の学習用クイズアプリケーションです。

## 対応試験

- **宅建試験**: 宅地建物取引士試験
- **土地家屋調査士**: 土地家屋調査士試験
- **不動産鑑定士**: 不動産鑑定士試験
- **賃貸不動産経営管理士**: 賃貸不動産経営管理士試験
- **マンション管理士**: マンション管理士試験
- **Webデザイン技能検定3級**: Webデザイン技能検定3級試験

## 機能

- **試験選択**: 複数の資格試験から選択可能
- **カテゴリ別学習**: 試験範囲をカテゴリごとに学習可能
- **4択問題**: 各問題は4つの選択肢から選択
- **タイムアタック**: 各問題20秒の制限時間
- **学習進捗管理**: LocalStorageで正解/不正解を記録
- **マスター機能**: 4回正解した問題は自動的にスキップ
- **統計表示**: 学習状況をグラフィカルに表示
- **即時フィードバック**: 回答後すぐに正解・解説を表示

## 技術スタック

- **Next.js 16**: React フレームワーク
- **TypeScript**: 型安全な開発
- **Bootstrap 5**: シンプルで洗練されたデザイン
- **Vercel**: ホスティングプラットフォーム

## 開発

### 必要要件

- Node.js 18.x 以上
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# データベースの初期化（ローカル開発用 SQLite）
npm run db:init

# 開発サーバーの起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

**注意**: ローカル開発では SQLite、本番環境では Neon PostgreSQL を使用します。詳細は [DATABASE.md](./DATABASE.md) を参照してください。

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルド結果の確認
npm run start
```

## デプロイ

### Vercel へのデプロイ

このアプリケーションは Vercel にデプロイすることを推奨します。

#### データベースのセットアップ（本番環境）

1. [Neon](https://neon.tech/) でアカウントを作成
2. 新しいプロジェクトを作成
3. PostgreSQL 接続文字列を取得

#### 初回デプロイ

1. [Vercel](https://vercel.com) にサインアップまたはログイン
2. GitHub リポジトリと連携
3. プロジェクトをインポート
4. 環境変数を設定:
   - `DATABASE_URL`: Neon の PostgreSQL 接続文字列
5. デプロイボタンをクリック

#### 自動デプロイ

- main ブランチへのプッシュで自動的にデプロイされます
- プルリクエストごとにプレビューデプロイが作成されます

詳細なデータベース設定については、[DATABASE.md](./DATABASE.md) を参照してください。

## データ構造

問題データは `src/data/` ディレクトリに格納されています。

```json
{
  "id": 1,
  "examType": "takken",
  "category": "権利関係",
  "question": "問題文",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "解説文",
  "difficulty": "exam"
}
```

### examType の値
- `takken`: 宅建試験
- `land-surveyor`: 土地家屋調査士試験
- `real-estate-appraiser`: 不動産鑑定士試験
- `rental-property-manager`: 賃貸不動産経営管理士試験
- `condominium-manager`: マンション管理士試験
- `web-design-3`: Webデザイン技能検定3級試験

### difficulty の値
- `exam`: 試験レベル
- `basic`: 基礎レベル
- `comparison`: 比較問題
- `terminology`: 用語定義

## ライセンス

ISC
