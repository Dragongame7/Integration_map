# システム基盤結合試験 連携可視化ツール

このフォルダは、Excel / CSV で管理する結合試験情報をもとに、COTS 製品間の連携と試験網羅性を視覚化するための最小構成です。

## 目的

対象はアプリケーション開発ではなく、Outlook、SharePoint、Splunk、VMware、Cisco 製品、Active Directory、FortiGate などを組み合わせるシステム基盤開発です。

基盤結合試験では、単純な試験ケース数よりも次の把握が重要です。

- どの製品とどの製品が連携しているか
- その連携に対して、認証、認可、通信、監視、障害などの観点が定義されているか
- 重要度が高い連携の未完了観点がどこに残っているか
- 担当チームや証跡が追える状態になっているか

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `data/components.csv` | 構成要素の台帳 |
| `data/integration_points.csv` | 製品間連携の台帳。連携種別、業務シナリオ、方式、ポート、期待証跡、失敗時影響を管理 |
| `data/coverage_matrix.csv` | 結合点ごとの試験観点ステータス。必要理由、証跡要否、証跡状態を管理 |
| `visualizer/index.html` | CSV を読み込んで連携図を表示するビューア |
| `docs/product_addition_policy.md` | 製品追加と連携追加の判断基準 |
| `docs/llm_import_contract.md` | ローカルLLMへ渡す入出力契約 |
| `docs/llm_prompt_template.md` | ローカルLLMへ渡すプロンプト雛形 |
| `docs/examples/*.json` | `提案JSON読込` で試せる提案サンプル |

## 使い方

1. Excel で `data/*.csv` を編集する
2. `start-local.ps1` または `start-local.bat` を実行する
3. ブラウザで `http://127.0.0.1:5177/` を開く
4. 連携図、要確認リスク、観点マトリクスを確認する

`visualizer/index.html` にはフォールバック用のサンプルデータが埋め込まれているため、CSV を読み込めない場合でも初期表示できます。ローカルサーバーで起動した場合は `data/*.csv` を自動で読み込みます。

## 起動コマンド

PowerShell:

```powershell
.\start-local.ps1
```

または npm:

```powershell
npm start
```

既定のURL:

```text
http://127.0.0.1:5177/
```

ポートを変える場合:

```powershell
$env:PORT=5180
npm start
```

## 管理の考え方

連携図は `integration_points.csv` を正として描画します。  
網羅性は `coverage_matrix.csv` を正として集計します。

連携種別は `integration_type` で分類します。例は `認証`、`認可`、`通信制御`、`ログ連携`、`監視`、`ファイル連携`、`通知` です。

重要度が高く、かつ `PASS` になっていない観点が多い結合点ほど、レビューで優先確認すべき対象です。加えて、観点が未定義の結合点、`PASS` なのに `evidence_id` または `evidence_status` が不足している観点もリスクとして扱います。

## ローカルLLM連携

ローカルLLMに製品追加案を出させる前に、次の文書を必ず参照してください。

- `docs/product_addition_policy.md`
- `docs/llm_import_contract.md`
- `docs/llm_prompt_template.md`

推奨フロー:

1. 追加したい製品名と既知前提を整理する
2. 上記ドキュメントをローカルLLMへ渡してJSON提案を作らせる
3. 提案を人手レビューする
4. 承認した内容だけCSVへ反映する

サンプル:

- `docs/examples/pingfederate-proposal.json`

## ステータス

| ステータス | 意味 |
| --- | --- |
| NOT_NEEDED | 当該観点は不要 |
| PLANNED | 観点は必要だがケース未作成または詳細化前 |
| READY | ケース作成済み、未実施 |
| RUN | 実施中 |
| PASS | 合格 |
| FAIL | 不合格 |
| HOLD | 前提未整備で保留 |
