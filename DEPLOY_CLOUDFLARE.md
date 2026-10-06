# KIRO — GitHub → Cloudflare Pages

更新日: 2026-10-06

## 現在の状態

- 本番ビルド・TypeScriptチェック: 成功。
- ローカル本番QA: 1440 / 1024 / 390 / 375 / 430pxとMotion軽減2幅の全7ケース成功。Console error / warning / HTTPエラー / axe指摘は0。画像・フォント・スクロール・破断・タップ・復元を確認。証跡はローカル `docs/deployment/local-qa/`。
- UI維持: `src/` と `public/` のSHA-256を変更前と比較し、差分はOGPの基準URLを扱う `src/app/layout.tsx` のみ。CSS・商品画像・コピー・Motion実装は一致。
- Git: ローカル `main` に初回commit `3494df1` を作成済み。GitHubの作成・pushはブラウザログイン待ち。
- GitHub予定名: `synthia-creative/kiro-brand-site`（Public）。作成前のためURL未確定。
- Cloudflare: ブラウザログイン待ち。Pagesプロジェクト・公開URLは未作成。
- ローカル本番QAと公開環境QAは別々に記録する。公開環境の成功をローカル結果で代用しない。

## Pagesに入力する設定

| 項目 | 値 |
| --- | --- |
| サービス | Cloudflare Pages / GitHub連携 |
| リポジトリ | `synthia-creative/kiro-brand-site`（作成・push後に選択） |
| Project name | `kiro-brand-site`（空き状況は作成画面で確認） |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | 空欄（リポジトリ直下） |
| Node.js | `.node-version` の `24.19.0` |
| 追加APIキー / Token | 不要 |
| `NEXT_PUBLIC_SITE_URL` | 初回は不要。固定した本番URLをOGPに使う場合、その公開URLを設定して再ビルド |

Presetの既定値 `npx next build` は、上表の `npm run build` に置き換える。このプロジェクトで検証済みの `next build --webpack` を実行するため。Next.jsのサーバー・Workers・next-on-pagesアダプターは必要ない。

OGPは `NEXT_PUBLIC_SITE_URL` → Cloudflareが自動注入する `CF_PAGES_URL` → ローカルURLの順で決まる。画像、フォント、CSS、JSはすべてローカルアセットとして静的出力される。デモのnoindex / nofollow / robots設定は維持する。

## 初回公開

1. GitHubにログインし、Publicの空リポジトリ `kiro-brand-site` を作成。既存同名リポジトリがある場合は、内容と履歴を確認して再利用する。READMEなどの自動初期化はオフ。
2. このローカル `main` をGitHubへpush。認証は本人が行う。Tokenはファイル・Git・説明書へ保存しない。
3. Cloudflareにログイン → **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**。
4. GitHub接続が必要なら本人が承認し、対象をこのリポジトリに絞る。上表の設定を入力し **Save and Deploy**。
5. Build successと実際に発行された `pages.dev` URLを確認。URLは推測せず、この文書とREADMEに追記。
6. 公開URLで以下のQAを実行し、画像・文字・横移動・破断のスクリーンショットを目視する。

## 更新方法

```sh
npm ci
npm run typecheck
npm run build
git add <変更したファイル>
git commit -m "Update KIRO brand site"
git push origin main
```

`main`へのpushでPagesが自動ビルド・公開する。CloudflareのDeploymentsで対象commit・成功を確認する。`out/`、`.next/`、`node_modules/`、`.env*`はGitへ含めない。参考サイトの撮影画像と内部案件記録もローカルに保存し、公開リポジトリには含めない。

## 検証

ローカル: `npm start -- 3002` で静的出力を配信。別ターミナルでPowerShellを使用する。

```powershell
$env:KIRO_QA_URL='http://127.0.0.1:3002'
$env:KIRO_QA_OUTPUT='docs/deployment/local-qa'
npm run qa
```

公開時は `KIRO_QA_URL` に実際の公開URL、`KIRO_QA_OUTPUT` に `docs/deployment/cloud-qa` を設定する。1440 / 1024 / 390 / 375 / 430pxと1440 / 390pxのMotion軽減を確認。Console error、HTTP 400以上、画像欠落、レイアウト、横移動・逆方向、クリック・タップ・キーボードによる破断と復元、ダイアログ・フォーカス、axeを検証する。スマホはEdgeのタッチエミュレーションであり、実機検証とは区別する。

## トラブル対応

- **Build failed**: Deploymentsのログを確認。preset、`npm run build`、`out`、root空欄、Nodeバージョン、lockfileを確認し、ローカルで同じcommitをビルドする。
- **Module not found**: ファイル名の大小文字を確認。CloudflareのLinux環境では区別される。依存の正本は `package-lock.json`。
- **404 / アセット欠落**: 出力先が `.next` でなく `out` か確認。`public/images/kiro` とローカルフォントがpushされ、ビルド出力に含まれるか確認。
- **OGPがlocalhost**: ビルド環境で `CF_PAGES_URL` が入っているか確認。必要なら `NEXT_PUBLIC_SITE_URL` を公開URLに設定し再デプロイ。
- **GitHub repoが選択できない**: CloudflareのGitHubアプリに対象リポジトリのアクセスがあるか、本人が設定を確認。
- **スクロールの動きが少ない**: OS / ブラウザのMotion軽減設定を確認。軽減時は意図的に静的表示になる。

## 公式資料

- [Cloudflare: Next.js static export](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Cloudflare: Build configuration / CF_PAGES_URL](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare: Build image / Node version](https://developers.cloudflare.com/pages/configuration/build-image/)
