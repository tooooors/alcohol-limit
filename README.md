# お酒飲み過ぎ防止アプリ 🍺

飲酒量を記録して、設定した制限を超えないようにサポートするWebアプリケーションです。

<img width="268" height="330" alt="スクリーンショット 2026-02-09 212041" src="https://github.com/user-attachments/assets/12a7fa5e-36f7-4279-8f44-3b5de3c34879" />

🚀 **[デモサイトを見る](https://tooooors.github.io/alcohol-limit/)**

## 機能

- **ビールカウント**: ボタンをクリックして飲んだビールの本数をカウント
- **制限設定**: 1日の飲酒上限本数を設定可能
- **警告機能**: 制限を超えた場合に警告ダイアログと爆発エフェクトで警告
- **データ永続化**: localStorage を使用して飲酒記録を保存
- **リセット機能**: カウントをリセットして新しい日から始められる

## 技術スタック

- **Vue 3**: Composition API と `<script setup>` を使用
- **TypeScript**: 型安全な開発
- **Vite**: 高速な開発サーバーとビルドツール
- **Playwright**: E2Eテストによる品質保証

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# E2Eテストの実行
npm run test:e2e
```

## プロジェクト構成

```
src/
├── App.vue              # メインアプリケーション
├── components/
│   ├── LimitInput.vue   # 制限設定コンポーネント
│   ├── DrinkCounter.vue # ビールカウンター表示
│   ├── DrinkButton.vue  # ビール追加ボタン
│   ├── WarningDialog.vue # 警告ダイアログ
│   └── ExplosionEffect.vue # 爆発エフェクト
tests/
└── drink-tracker.spec.ts # E2Eテスト
```
