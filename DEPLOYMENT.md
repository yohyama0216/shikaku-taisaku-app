# GitHub Pages デプロイメントガイド

このドキュメントでは、GitHub Pages へのデプロイ方法と、発生する可能性のあるエラーの解決方法を説明します。

## 初回セットアップ

### 前提条件

- **GitHub プラン**: このリポジトリはプライベートです。GitHub Pages をプライベートリポジトリで使用するには、以下のいずれかのプランが必要です：
  - GitHub Pro
  - GitHub Team
  - GitHub Enterprise Cloud
  - GitHub Enterprise Server

フリープランの場合、リポジトリをパブリックにするか、有料プランにアップグレードする必要があります。

### GitHub Pages の有効化

1. リポジトリの設定ページにアクセス:
   ```
   https://github.com/yohyama0216/shikaku-taisaku-app/settings/pages
   ```

2. **"Build and deployment"** セクションで：
   - **Source**: "GitHub Actions" を選択
   - 保存ボタンをクリック

3. 設定が完了したら、"Save" をクリックして変更を保存

## デプロイ方法

### 手動デプロイ

1. GitHub リポジトリの **Actions** タブにアクセス
2. 左側のワークフロー一覧から **"Deploy to GitHub Pages"** を選択
3. **"Run workflow"** ボタンをクリック
4. ブランチを選択（通常は `main`）
5. **"Run workflow"** を実行

デプロイが成功すると、数分後に以下の URL でアクセスできます：
```
https://yohyama0216.github.io/shikaku-taisaku-app/
```

## トラブルシューティング

### エラー: 404 Not Found (Creating Pages deployment failed)

**原因**: GitHub Pages がリポジトリで有効化されていない、または正しく設定されていません。

**解決方法**:
1. [GitHub Pages の有効化](#github-pages-の有効化) セクションの手順に従って設定を確認
2. Source が "GitHub Actions" に設定されているか確認
3. プライベートリポジトリの場合、GitHub のプランが Pages をサポートしているか確認

### エラー: HttpError: Not Found

**原因**: 
- GitHub Pages が有効化されていない
- OIDC トークンの権限が不足している
- リポジトリの権限設定が不適切

**解決方法**:
1. リポジトリ設定で GitHub Pages を有効化
2. ワークフローファイルの `permissions` セクションを確認:
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```
3. Actions の権限を確認: Settings → Actions → General → Workflow permissions

### ビルドは成功するがデプロイに失敗する

**原因**: artifact のアップロードは成功しているが、Pages のデプロイ権限がない

**解決方法**:
1. Settings → Actions → General に移動
2. "Workflow permissions" で "Read and write permissions" を選択
3. "Allow GitHub Actions to create and approve pull requests" をチェック（必要に応じて）
4. 保存してワークフローを再実行

## ワークフローの構成

現在のワークフローは以下の2つのジョブで構成されています：

### 1. Build ジョブ
- Node.js 20 のセットアップ
- 依存関係のインストール (`npm ci`)
- Next.js ビルドの実行 (`npm run build`)
- 静的ファイル (`out/` ディレクトリ) のアーティファクトとしてアップロード

### 2. Deploy ジョブ
- Build ジョブの完了を待機
- アーティファクトを GitHub Pages にデプロイ
- デプロイ URL を出力

## サポート

問題が解決しない場合：
1. [GitHub Pages のトラブルシューティングドキュメント](https://docs.github.com/ja/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites) を参照
2. Actions タブでワークフローのログを確認
3. GitHub Community で質問を投稿

## 参考リンク

- [GitHub Pages について](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages)
- [GitHub Actions でのデプロイ](https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
