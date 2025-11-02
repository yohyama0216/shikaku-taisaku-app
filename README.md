# 危険物乙４試験対策クイズアプリ

危険物取扱者乙種第4類試験の学習用クイズアプリケーションです。

## 機能

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
- **Pico.css**: 軽量でモダンなCSSフレームワーク（~10KB）
- **SSG (Static Site Generation)**: GitHub Pages でのホスティング

## 開発

### 必要要件

- Node.js 18.x 以上
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

### ビルド

```bash
# 本番用ビルド
npm run build
```

ビルド成果物は `out/` ディレクトリに生成されます。

## デプロイ

### GitHub Pages の設定

初回デプロイの前に、以下の手順で GitHub Pages を有効化してください：

1. リポジトリの Settings → Pages にアクセス
   - URL: https://github.com/yohyama0216/shikaku-taisaku-app/settings/pages
2. "Build and deployment" セクションで、Source を **GitHub Actions** に設定
3. 保存して設定を完了

**注意**: このリポジトリはプライベートです。GitHub Pages をプライベートリポジトリで使用するには、GitHub Pro、Team、Enterprise Cloud、または Enterprise Server のプランが必要です。

### 自動デプロイ

GitHub Pages を有効化した後、以下の方法でデプロイできます：

- **手動デプロイ**: Actions タブから "Deploy to GitHub Pages" ワークフローを手動実行
- **自動デプロイ**: workflow_dispatch トリガーを使用して手動でデプロイを実行

デプロイが成功すると、アプリは以下の URL でアクセスできます：
- https://yohyama0216.github.io/shikaku-taisaku-app/

詳細なデプロイ手順とトラブルシューティングについては、[DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

## データ構造

問題データは `src/data/questions.json` に格納されています。

```json
{
  "id": 1,
  "category": "危険物の性質",
  "question": "問題文",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "解説文"
}
```

## ライセンス

ISC
