# KIRO — QA結果

## Cloudflare Pages公開環境（2026-10-06追記）

本番URL: https://kiro-brand-site.pages.dev/ 。GitHub連携で `main` を自動公開。公開URLに対して1440 / 1024 / 390 / 375 / 430px、Motion軽減1440 / 390pxの計7ケースがPASS。従来の静的出力チェックに加え、Heroの浮遊のtransform変化、スクロール時の3レイヤーの移動方向、Outfit / Noto Sans JPのloaded状態、通信失敗、OGPがlocalhostでないことを明示的に検証した。

Console error / warning、pageerror、HTTP 400以上、通信失敗、画像欠落、axe指摘は0。PC・タブレット・スマホのHeroと破断状態を目視確認。JSONは `docs/CLOUDFLARE_QA_RESULTS.json`、38点のスクリーンショットはローカル `docs/deployment/cloud-qa/`。スマホはEdgeのviewport / タッチエミュレーションであり、実機Safari / Androidの結果ではない。

以下は制作時のローカル検証記録。公開前時点の検証境界は、その当時の記録として保持する。

実施日: 2026-10-06 / 検証環境: Windows・Microsoft Edge・Playwright。

## 結果

本番ビルド・TypeScriptチェック・静的出力のブラウザ確認に合格。検証URLは `http://127.0.0.1:3002`。Browser pluginは利用可能一覧になかったため、Playwrightと既存Edgeを使用した。全て実際のブラウザエンジンで実行。

| 幅 | 縦サイズ | 全体表示 | 横移動・逆方向 | 破断・復元 | キーボード | ダイアログ・フォーカス | axe指摘 | Console error / warn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1440px | 960px | PASS | PASS | PASS | PASS | PASS | 0 | 0 / 0 |
| 1024px | 960px | PASS | PASS | PASS | PASS | PASS | 0 | 0 / 0 |
| 390px | 844px | PASS | PASS | PASS・タップ | PASS | PASS | 0 | 0 / 0 |
| 375px | 844px | PASS | PASS | PASS・タップ | PASS | PASS | 0 | 0 / 0 |
| 430px | 844px | PASS | PASS | PASS・タップ | PASS | PASS | 0 | 0 / 0 |

1440px・390pxのMotion軽減もPASS。浮遊停止、横移動の静的グリッド化、shake停止、サブレボタンが操作できることを確認した。

## 確認した操作

- ページURL・title・主題となるh1、実コンテンツ、エラーオーバーレイがないこと。
- HeroからFooterまで9か所、5幅合計45か所でdocumentの横幅を実測。横スクロールバーなし。
- セクションごとのスクリーンショットを撮影し、PC・スマホの文字、商品、重なりを目視した。
- Paradeの進捗0%→80%でX座標が動き、逆方向で初期位置へ戻ること。
- サブレを通常状態で表示→クリック/タップ→破断→Spaceで復元→Enterで破断。
- 破断前後の画像要素のx / y / width / heightを比較し、変化1px未満（実測値は同一）。
- スクロールの52%閾値を超えて自動破断し、戻って復元すること。sticky終了後も次のセクションへ進めること。
- SHOP KIRO→デモ説明ダイアログ→Escapeで閉じる→元のボタンへフォーカスが戻ること。閉じるボタンによる操作も確認。
- 内部アンカーの対象、画像の欠落、HTTP 400以上、Console error・warn、pageerrorを確認。
- axeのWCAG 2 A / AA、2.1 AA、2.2 AAタグによる自動検査を5幅で実行。

遅延読み込みの画面外画像は、未読み込みと欠落を区別した。サイトで実際に使う画像はローカルで管理している。

## 修正と再確認

1. PCの箱が画面高の約9割を使っていたため、約7割へ変更。サブレが箱のKIROロゴを隠さない位置へ移動。
2. 日本語見出しの太さがOSフォントに左右されていたため、ローカルのNoto Sans JP Variableへ変更。
3. スマホ用768px画像を用意し、pictureで配信する。3点の合計は約346KB。
4. 味わいの本文がサブレに重なっていたため、PCの説明文を左へ移動し、スマホの写真を見出し下へ配置。
5. 写真内のキャプションがサブレに重なっていたため、写真上部へ移動。
6. 背景文字の低コントラストとsticky内の背景判定を修正し、axeで再確認。
7. 開発用Next.jsポータルの存在をエラー画面と誤判定していたQAコードを修正。実際のエラーオーバーレイとConsoleを検査する。

修正後に再撮影・再検証し、最後に `out/` の静的ファイルで同じ操作を確認した。

## 証拠

`qa/results.json`: 検証URL、幅、Parade座標、画像の座標比較、Console、合否。

`qa/*-axe.json`: 各幅のアクセシビリティ検査結果。全て空配列。

`qa/*-hero.png`: 各幅のHero。

`qa/*-parade-moving.png`: 横移動中。

`qa/*-sable-whole.png` / `qa/*-sable-broken.png`: 破断前後。

`qa/*-reduced-motion.png`: Motion軽減。

1440pxと390pxは各セクションのスクリーンショットも保持。

## 実行方法

```sh
npm run typecheck
npm run build
npm start -- 3002
```

別のターミナルで、PowerShell:

```powershell
$env:KIRO_QA_URL='http://127.0.0.1:3002'
npm run qa
```

この環境ではNext.jsのWindowsパス参照・ブラウザ起動・外側のEdgeとsandbox内サーバーの接続に制限があった。許可された実行経路へ切り替え、成功を確認している。最初の制限エラーを検証成功として扱っていない。

## 確認の境界

スマホはEdgeのタッチ・viewportエミュレーション。実機iOS Safari / Android Chrome、他ブラウザ、実際のスクリーンリーダー、低性能端末での長時間利用は未検証。axeの0件は完全なWCAG適合認証ではない。Core Web Vitalsの実ユーザー測定、外部デプロイ、公開URL、実際の商品販売は今回の対象外。購入はデモ説明のみで決済処理をしない。
