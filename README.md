# KIRO

## Overview

架空の焼き菓子ブランド「KIRO」の商品体験サイト。巨大なタイポグラフィ、透過商品写真、縦スクロールに連動する横移動、サブレを割るインタラクションを組み合わせています。画面幅によって独立した構図を使う1ページサイトです。決済・商品の販売は行いません。

## Tech Stack

Next.js App Router / TypeScript / React / Motion for React / CSS。Outfit Variable・Noto Sans JP Variableをローカル配信。写真はWebP・透過あり。Tailwind・GSAP・UIコンポーネント集は追加せず、編集しやすいCSSとMotionに絞りました。バージョンの正本は `package-lock.json`。

検証用: Playwright + 既存Microsoft Edge + axe。Browser pluginはこの環境にないため、通常のPlaywrightを使用しました。

## Setup

Node.js 20.9以上、npm、Microsoft Edge（QA実行時）が必要です。

```sh
npm ci
```

## Development

```sh
npm run dev
```

`http://127.0.0.1:3000`。開発時も画像とフォントはローカル配信。商品情報・色・画像・コピーは `src/config/brand.ts` に集約しています。

## Build

```sh
npm run typecheck
npm run build
npm start
```

`out/` へ静的出力します。`npm start` はこの静的出力のローカル確認用サーバーです。開発サーバーと同時に確認する場合は `npm start -- 3001`。Next.jsのサーバー機能・APIキー・決済サーバーは不要です。公開設定と進行状況は下のDeploymentを参照してください。

## Project Structure

```text
src/
  app/             ページ・レイアウト・CSS・favicon
  components/      セクション・Motion・ダイアログ
  config/brand.ts  ブランド設定の正本
public/images/kiro/  透過WebP・スマホ用WebP・OGP
scripts/           ビルド後プレビュー・ブラウザQA・素材書き出し
docs/              原本指示書・案件記録・QA・参照観察
README.md
DESIGN_NOTES.md
```

## Motion

- Hero: 周期をずらした静かな浮遊と、レイヤーごとのパララックス。
- Product Parade: sticky + スクロール進捗による横移動。自動カルーセルなし。
- Giant Sable: sticky区間52%で破断へ切り替え、逆スクロールで通常へ戻る。
- Paki: 同座標の写真切り替え、微細なshake、少数の破片、短い文字。
- Click / tap / Enter / Space: 破断・復元。手動状態は次にスクロール閾値を跨ぐまで維持。
- Motion軽減: 浮遊・パララックス・shake・破片を停止。商品列は静的グリッド、サブレは短い通常セクションへ変更。状態切り替えボタンは残す。

## Assets

商品写真3点はこの案件のためにimagegenで生成。既存商品の写真・参考ブランド素材を使っていません。全セクションで同じ紙箱・円形サブレを使っています。通常・破断写真は共通の1254×1254キャンバスで管理し、スマホ用は768×768。生成画像の用途・確認内容は `docs/ASSETS.md`。

画像には生成特有の細かな質感があり、実際の商品写真・商品仕様を証明するものではありません。フォントのOFLライセンスを `public/licenses/` と `docs/licenses/` に同梱しています。

## Responsive Design

- Desktop: 左にコピー、右に箱、下に巨大KIRO。商品は異なるレイヤーで重なる。
- Tablet: 商品比率と見開きの文字サイズ・本文配分を調整。
- Mobile: コピー→箱→巨大文字→サブレの縦構図。ストーリーは縦の順序へ再構成。巨大サブレは125vw。

1440 / 1024 / 390 / 375 / 430pxで検証。詳細・再現手順は `docs/QA.md`。

```sh
npm run qa
```

別ポートの静的出力を確認する場合、PowerShellでは `$env:KIRO_QA_URL='http://127.0.0.1:3001'; npm run qa`。スクリーンショットと結果JSONを `docs/qa/` に保存します。

## Notes

- 架空の価格6個入り ¥1,480。購入CTAは販売しないことを伝えるダイアログを開きます。
- noindex / nofollow と robots Disallow /。未確定の店舗、連絡先、SNS、レビュー、実売情報は載せていません。
- OGPの基準URLは `NEXT_PUBLIC_SITE_URL`、Cloudflareの `CF_PAGES_URL`、`http://127.0.0.1:3000` の順で使用します。デモのためsitemapは作成していません。
- ブランド差し替え時は `brand.ts` と商品画像を変更します。箱のロゴは写真の一部なので、名前変更と画像差し替えをセットで行ってください。CMSは使用していません。
- Windowsのこの実行環境では、サンドボックス内のNext.jsパス参照とEdge起動に制限があったため、許可された実行経路でビルド・QAを行いました。
- 案件管理と再利用候補は `docs/PROJECT_RECORD.md`。既存Design Knowledge System・Skillは変更せず、DKSへの登録は行っていません。

## Deployment

GitHub → Cloudflare PagesのGit連携を使用します。設定は `main` / `Next.js (Static HTML Export)` / `npm run build` / `out` / root空欄。Node.jsは `.node-version` で検証済みの24.19.0に固定しています。

公開済み: **[kiro-brand-site.pages.dev](https://kiro-brand-site.pages.dev/)**。ソース: [synthia-creative/kiro-brand-site](https://github.com/synthia-creative/kiro-brand-site)（Public）。`main` へのpushでCloudflare Pagesが自動ビルド・公開します。

公開URLで1440 / 1024 / 390 / 375 / 430pxとMotion軽減2幅の計7ケース合格。Heroの浮遊・parallax、横移動・逆方向、破断・復元、タップ・キーボード、フォント、画像、ダイアログを確認。Console error / warning・HTTPエラー・axe指摘0。スマホはEdgeのエミュレーションで、実機検証は未実施です。

手順、環境変数、更新、トラブル対応は [DEPLOY_CLOUDFLARE.md](DEPLOY_CLOUDFLARE.md)。公開QAの実測は [docs/CLOUDFLARE_QA_RESULTS.json](docs/CLOUDFLARE_QA_RESULTS.json)。内部案件記録とスクリーンショットはローカル保存のため、Publicリポジトリには含めません。
