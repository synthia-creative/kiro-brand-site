# KIRO — Design Notes

## ブランドコンセプト

架空の焼き菓子ブランド。厚い円形バターサブレと、ほろ苦い焦がしキャラメルの食感を「ぱきっ、とろっ、もうひとつ。」で伝える。明るいクラフト菓子として、食品の質感をサイトの中心に置く。

## 色とTypography

色の正本は `src/config/brand.ts`。Caramel Orange #EF762C / Ivory #FFF5DE / Dark Brown #382015 / Burnt Caramel #512B1D / Butter Yellow #F5D783。

英字はOFLライセンスのOutfit Variableをローカル配信。太いKIROの文字は詰めた字間と巨大なサイズで存在感を作る。日本語はNoto Sans JP Variableをローカル配信し、見出しの太さをOSに依存させない。BIZ UDPGothic、ヒラギノ、游ゴシックをフォールバックにする。見出し・ナビ・本文は実テキスト、箱上の文字のみ生成写真に含む。

## レイアウト思想と設計レビュー

商品写真と文字が重なる誌面的構成。左右の比率、余白、商品サイズをセクションごとに変える。「浮遊 → 静かな本文 → 横移動 → 静かな見開き → パキッ → 味わい」を一本のスクロールでつなぐ。

一般的な三列カード、バッジの羅列、グラデーション、汎用的な一律コンテナを使わない。ブリーフが指定するオレンジ・クリームと大文字の商品名を優先し、Skillの一般的な配色・英字表記の注意事項より本案件の仕様を優先した。

```text
Desktop Hero                 Mobile Hero
logo                  nav    logo             nav
copy       tall package      copy / short description
copy       package           large package
       small sable           KIRO behind package
K I R O       foreground     foreground sable
scroll cue                   scroll cue
```

## Hero設計

背景の巨大文字、紙箱、前後のサブレを別レイヤーにする。箱9秒、奥のサブレ11秒、手前12秒と周期をずらし、動きは約10pxに抑える。スクロール時には文字・箱・サブレへ違う移動量を割り当てる。スマホはコピーを上、箱を中央、サブレを下へ配置し直す。

## Product Parade設計

縦スクロール区間内で100svhの画面をsticky固定。MotionのuseScroll / useTransformで商品列のX移動を制御する。ResizeObserverで実際の列幅を測り、終端を計算。自動カルーセルや強制スクロールは行わない。スマホは区間を短くし、視認できる商品サイズを維持する。

## Paki Interaction設計

巨大サブレ区間の52%で通常→破断状態へ切り替え。逆スクロールで戻る。タップ・クリック・Enter・Spaceでも操作可能。手動状態は次にスクロールの閾値を跨ぐまで維持する。画像は同じ正方形、共通のposition・サイズ・transform-originで重ね、opacityのみ切り替える。微細なshake、7つの小さな破片、短い「パキッ」を同期する。読み上げ用の状態テキストとaria-pressedを更新する。

## Motion思想と軽減設定

操作への反応と商品の存在感のためのMotion。MotionConfigとprefers-reduced-motionを併用する。軽減設定では浮遊・パララックス・shake・破片を停止し、Paradeを静的グリッドに変更。巨大サブレは通常の一画面へ短縮し、ボタンによる状態切り替えを残す。情報・CTAは隠さない。

## Mobile対応

600px以下は独立構成。日本語コピーの改行、紙箱の位置、サブレのトリミング、見開きの縦順序、味わいの写真位置を切り替える。巨大サブレは125vw。601〜1100pxはタブレット用の写真と本文の配分。svhを用いてブラウザのアドレスバー変化に対応する。

## 今後変更しやすい場所

- `src/config/brand.ts`: ブランド名、商品名、英語名、コピー、色、価格、数量、画像、実ストアURL、本文、味わい。
- `src/components/brand-site.tsx`: 各セクションと動作。商品追加時のParade配列やスクロール閾値。
- `src/app/globals.css`: 色以外のTypography、構図、ブレイクポイント、浮遊・破断演出。
- `public/images/kiro/`: 商品画像。通常と破断画像は同じキャンバス・商品の位置・大きさで準備する。

名前や色の変更だけでは写真の箱ロゴは変わらない。別ブランドへの変更では画像も差し替える。実ストアURLの設定時にはデモ注記、robots、価格の架空表記も確認する。

## 参考と品質基準

参考ページとそこから案内された商品デモをブラウザで観察し、商品を主役にするサイズ・重なり・スクロール連動を参考にした。文章・画像・商品デザイン・HTML/CSS/JSは転用していない。観察画像は `docs/reference/` のみで管理し、サイトのpublicへ入れない。

Web制作部のAGENTS、standards、品質チェックリスト、見積前提、プロンプトテンプレート集のEC・物販向け章を参照。Design Knowledge SystemのPolicyとHP Rulesを確認。菓子の検索は0件だったため、無関係なCaseを流用しなかった。既存DKSの変更・新規登録はしていない。

技術の参照: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)、[Motion useScroll](https://motion.dev/docs/react-use-scroll)。
