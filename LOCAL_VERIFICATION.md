# ローカル環境での確認手順

このドキュメントでは、アプリケーションをローカル環境で実行して動作を確認する手順を説明します。

## 必要要件

以下のソフトウェアがインストールされている必要があります：

- **Node.js**: バージョン 18.x 以上
- **npm**: Node.js に含まれています

### Node.js のバージョン確認

```bash
node --version
npm --version
```

Node.js 18.x 以上がインストールされていることを確認してください。

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yohyama0216/shikaku-taisaku-app.git
cd shikaku-taisaku-app
```

### 2. 依存関係のインストール

```bash
npm install
```

このコマンドで、`package.json` に記載されているすべての依存関係がインストールされます。

### 3. データベースの初期化

ローカル開発では SQLite データベースを使用します。以下のコマンドで初期化します：

```bash
npm run db:init
```

このコマンドで `local.db` というファイルが作成され、必要なテーブルが作成されます。

**注意**: `.env.local` ファイルは自動的に作成されています。カスタマイズする場合は `.env.example` を参照してください。

## 開発サーバーでの実行

### 開発サーバーの起動

```bash
npm run dev
```

このコマンドを実行すると、開発サーバーが起動します。以下のようなメッセージが表示されます：

```
   ▲ Next.js 16.0.1
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

 ✓ Ready in Xs
```

### アプリケーションへのアクセス

ブラウザで以下の URL を開いてください：

```
http://localhost:3000
```

### 確認すべきポイント

1. **トップページ**: 5つの試験（宅建試験、土地家屋調査士、不動産鑑定士、賃貸不動産経営管理士、マンション管理士）のカードが表示されること

2. **各試験ページ**: カードをクリックして各試験のページに遷移できること
   - http://localhost:3000/takken
   - http://localhost:3000/land-surveyor
   - http://localhost:3000/real-estate-appraiser
   - http://localhost:3000/rental-property-manager
   - http://localhost:3000/condominium-manager

3. **クイズページ**: 各試験の「クイズを始める」ボタンから問題に挑戦できること

4. **統計ページ**: 学習進捗が表示されること

### 開発サーバーの停止

開発サーバーを停止するには、ターミナルで `Ctrl + C` を押してください。

## 本番ビルドの確認

Vercel にデプロイされる状態と同じビルド結果を確認できます。

### 1. ビルドの実行

```bash
npm run build
```

このコマンドで本番用のビルドが作成されます。以下のような出力が表示されます：

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ● /[examType]
│ ├ /takken
│ ├ /land-surveyor
│ ├ /real-estate-appraiser
│ └ [+2 more paths]
...
```

`[+2 more paths]` には `rental-property-manager` と `condominium-manager` が含まれます。

### 2. 本番サーバーの起動

```bash
npm run start
```

本番モードでサーバーが起動します。ブラウザで `http://localhost:3000` にアクセスして動作を確認してください。

### 確認すべきポイント

- すべてのページが正常に表示されること
- 画像やスタイルが正しく読み込まれること
- ページ遷移がスムーズに動作すること
- LocalStorage を使用した進捗保存が正常に機能すること

## リント（コード品質チェック）

コードの品質を確認するには、以下のコマンドを実行します：

```bash
npm run lint
```

エラーや警告が表示されないことを確認してください。

## トラブルシューティング

### ポート 3000 が既に使用されている場合

別のアプリケーションがポート 3000 を使用している場合は、以下のコマンドで別のポートを指定できます：

```bash
npm run dev -- -p 3001
```

ブラウザで `http://localhost:3001` にアクセスしてください。

### `node_modules` の再インストール

依存関係のインストールに問題がある場合は、以下のコマンドで再インストールしてください：

```bash
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラーが発生する場合

キャッシュをクリアしてから再度ビルドを試してください：

```bash
rm -rf .next
npm run build
```

## 対応試験の確認

現在のアプリケーションは以下の5つの試験に対応しています：

1. **宅建試験** (`takken`)
   - 宅地建物取引士試験

2. **土地家屋調査士** (`land-surveyor`)
   - 土地家屋調査士試験

3. **不動産鑑定士** (`real-estate-appraiser`)
   - 不動産鑑定士試験

4. **賃貸不動産経営管理士** (`rental-property-manager`)
   - 賃貸不動産経営管理士試験

5. **マンション管理士** (`condominium-manager`)
   - マンション管理士試験

各試験のサンプル問題は `src/data/` ディレクトリに格納されています。

## データファイルの確認

問題データは以下のファイルに格納されています：

```
src/data/
├── takken.json                      # 宅建試験（約500問）
├── land-surveyor.json               # 土地家屋調査士（5問）
├── real-estate-appraiser.json       # 不動産鑑定士（5問）
├── rental-property-manager.json     # 賃貸不動産経営管理士（5問）
└── condominium-manager.json         # マンション管理士（5問）
```

各ファイルは JSON 形式で、以下の構造になっています：

```json
[
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
]
```

## さらに詳しい情報

プロジェクトの詳細については、[README.md](./README.md) を参照してください。
