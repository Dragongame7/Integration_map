# ローカルLLM取込契約

## 目的

この文書は、ローカルLLMに構成情報を読ませて製品追加案を生成させるときの入出力契約を定義する。

目的は次の2点。

- LLM出力をそのままレビューしやすくする
- 自由記述を減らしてCSV反映しやすくする

## 入力に含める情報

LLMには次を渡す。

- `components.csv`
- `integration_points.csv`
- `coverage_matrix.csv`
- `product_addition_policy.md`
- 追加したい製品名または製品一覧
- 既知の前提
  - 例: 「Virtruはメールのみ」
  - 例: 「NextLabsはファイル共有のみ」
  - 例: 「すべてのログはSplunkへ送るが、補助連携として扱う」

## LLMに期待する役割

- 既存製品との重複候補を洗い出す
- `components.csv` の追加行案を作る
- `integration_points.csv` の追加行案を作る
- `coverage_matrix.csv` の初期行案を作る
- 不明項目を `TBD` として明示する

## LLMに期待しない役割

- 既存行の自動削除
- 既存名称の自動変更
- 実機確認なしの断定
- ポート番号の捏造
- 試験対象範囲の最終決定

## 出力形式

出力は必ずJSONで返す。

```json
{
  "summary": {
    "requested_products": [],
    "duplicate_candidates": [],
    "assumptions": []
  },
  "components_to_add": [],
  "integrations_to_add": [],
  "coverage_to_add": [],
  "review_points": []
}
```

## フィールド定義

### `summary`

- `requested_products`
  - 入力された製品名
- `duplicate_candidates`
  - 既存製品との重複候補
- `assumptions`
  - LLMが置いた前提

### `components_to_add`

各要素は次を含む。

```json
{
  "component_name": "",
  "domain": "",
  "owner": "TBD",
  "description": "",
  "reason": ""
}
```

### `integrations_to_add`

各要素は次を含む。

```json
{
  "from_component": "",
  "to_component": "",
  "flow_direction": "output",
  "integration_type": "",
  "business_scenario": "",
  "purpose": "",
  "protocol_or_method": "TBD",
  "protocol": "TBD",
  "port": "TBD",
  "environment": "IT",
  "criticality": "Medium",
  "owner": "TBD",
  "consumer_team": "TBD",
  "provider_team": "TBD",
  "observability_point": "TBD",
  "failure_impact": "TBD",
  "diagram_default": "core",
  "notes": "",
  "reason": ""
}
```

### `coverage_to_add`

各要素は次を含む。

```json
{
  "integration_ref": "",
  "viewpoint_code": "",
  "viewpoint_name": "",
  "required": "Yes",
  "required_reason": "",
  "status": "PLANNED",
  "test_depth": "Normal",
  "evidence_required": "Yes",
  "owner": "TBD",
  "observability_point": "TBD",
  "remarks": ""
}
```

`integration_ref` は `integrations_to_add` 内で参照する一時キーでもよい。

## 出力制約

- 製品名は既存表記を優先する
- `flow_direction` は `input` `output` `bidirectional` のいずれか
- `diagram_default` は `core` `secondary` のいずれか
- `criticality` は `High` `Medium` `Low` のいずれか
- 不明項目は空欄ではなく `TBD` を優先する
- `reason` には、なぜその追加が必要かを1文で書く

## レビュー前提

このJSONは自動反映しない。必ず人手レビューを通す。

最低確認項目:

- 重複していないか
- 試験対象として追加すべきか
- 方向が妥当か
- 主連携/補助連携が妥当か
- 初期観点が足りているか

## 推奨プロンプト運用

- 1回で大量製品を入れず、数製品単位で提案させる
- 既知前提を毎回明示する
- 生成結果は差分レビューし、CSVへ反映する
