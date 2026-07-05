# 製品追加ポリシー

## 目的

この文書は、ローカルLLMまたは人手で `components.csv` `integration_points.csv` `coverage_matrix.csv` に製品や連携を追加するときの判断基準を固定するための運用ポリシーです。

目的は次の3点です。

- 製品追加の粒度を揃える
- 結合試験の確認対象だけを連携図に載せる
- LLMの推測による過剰追加や表記ゆれを防ぐ

## 基本原則

1. このツールの主目的は、製品構成図の作成ではなく、結合試験の網羅性確認である。
2. 製品は「試験上、個別に識別したい単位」で登録する。
3. 連携は「結合試験で成否確認が必要な関係」だけを登録する。
4. 一律の収集や常識的な基盤依存は、必要性が低い限り主連携として増やしすぎない。
5. 不明な内容は捏造せず `TBD` または空欄にする。

## 1製品として登録する単位

### 登録する

- 別製品として契約・導入・管理されるもの
- 試験観点が独立するもの
- 連携相手として個別識別したいもの
- 管理製品と被管理製品で役割が明確に分かれるもの

例:

- `Splunk`
- `Splunk SOAR`
- `Splunk UEBA`
- `Trellix ePO`
- `Trellix HX`
- `FortiGate`
- `FortiManager`

### 原則として登録しない

- 単なる内部機能名
- 製品内の画面名、メニュー名
- 試験上の識別価値がない下位モジュール
- 実体のない概念語

例:

- `ログ機能`
- `認証画面`
- `管理API機能`

## 製品名の命名規則

- `components.csv` の `component_name` は、現場で通じる製品名を優先する
- ベンダー正式名と略称が両立しない場合は、現場での呼称を優先する
- 表記ゆれを避けるため、既存名称を流用する
- カッコ書きは役割補足が必要な場合だけ使う

例:

- `FortiGate`
- `IDEA CA`
- `Veeam Backup`
- `OpenFreeRadius`

避ける例:

- `fortigate`
- `Forti Gate`
- `Veeam バックアップ`

## ドメイン分類ルール

`components.csv` の `domain` は次から選ぶ。

- `User Access`
- `Identity`
- `Network Security`
- `Platform`
- `Security Ops`
- `Operations`

### 分類の目安

- `User Access`: 利用者接点、メール、ポータル、VDI
- `Identity`: AD、MFA、CA、PAM、RADIUS
- `Network Security`: FW、SW、NW管理
- `Platform`: 仮想基盤、バックアップ、サーバ基盤
- `Security Ops`: SIEM、SOAR、UEBA、EDR、脆弱性、改ざん検知
- `Operations`: バッチ、資産管理、運用支援

## 連携として登録する対象

### 主連携として登録する

- 認証
- 認可
- 通信制御
- 設定反映
- ファイル連携
- API連携
- メール連携
- 管理制御
- 運用フローに影響する連携

### 補助連携として登録する

- ログ転送
- 監視イベント送信
- アラート通知
- 相関分析向けイベント受け渡し

原則として `diagram_default=secondary` を付ける。

### 原則として個別登録しない

- OS標準ログのような一律送信
- 図が読めなくなるだけの横断収集
- 試験計画上、個別に判定しない常識的依存

## 連携方向の定義

`integration_points.csv` の `flow_direction` は必須とする。

- `output`
  - `from_component -> to_component`
  - 左の製品から右の製品へ、データ・制御・通知を出す
- `input`
  - `to_component -> from_component`
  - 左の製品が右の製品を参照・利用・受信する関係を表す
- `bidirectional`
  - 双方向連携
  - 認証要求と応答、相互同期、双方向APIなど

### 選び方の目安

- ログ送信は通常 `output`
- ポリシー配布は通常 `output`
- ディレクトリ参照や認証バックエンド参照は通常 `input`
- 相互同期や双方向制御は `bidirectional`

## `integration_type` の推奨語彙

新規追加時は次を優先する。

- `認証`
- `認可`
- `通知`
- `通信制御`
- `設定反映`
- `ファイル連携`
- `ログ連携`
- `監視`
- `運用`
- `管理制御`
- `脆弱性診断`

既存にない語を増やす場合は、既存語で表現できない理由をレビューする。

## `components.csv` 追加ルール

必須項目:

- `component_id`
- `component_name`
- `domain`
- `owner`
- `description`

### `owner` の決め方

- その製品の主担当チームを1つ入れる
- 不明な場合は `TBD`

### `description` の書き方

- 1行で役割が分かる説明にする
- 機能一覧ではなく、試験上の役割を書く

## `integration_points.csv` 追加ルール

必須項目:

- `integration_id`
- `from_component`
- `to_component`
- `flow_direction`
- `integration_type`
- `purpose`
- `criticality`
- `owner`
- `diagram_default`

推奨項目:

- `business_scenario`
- `protocol_or_method`
- `protocol`
- `port`
- `consumer_team`
- `provider_team`
- `observability_point`
- `failure_impact`
- `notes`

### `diagram_default`

- 主連携は `core`
- 補助連携は `secondary`

### `criticality`

- `High`: 試験不成立時に全体影響が大きい
- `Medium`: 主要運用に影響
- `Low`: 補助的、または影響限定

## `coverage_matrix.csv` 初期追加ルール

連携を追加したら、最低限の観点を初期登録する。

標準初期観点:

- `NET`
- `DATA`
- `OPS`

連携種別に応じて追加候補:

- `認証`: `AUTH`
- `認可`: `AUTHZ`
- `設定反映`: `CFG`
- `監視` `ログ連携`: `MON`
- `障害復旧が重要`: `FAIL`
- `高負荷影響あり`: `PERF`
- `セキュリティ条件あり`: `SEC`

## LLM利用時の禁止事項

- 既存製品名を無断で改名しない
- 既存連携を削除しない
- 不明なポートや方式を断定しない
- 製品内機能を勝手に別製品化しない
- ログ収集先が存在するだけで無制限に補助連携を増やさない

## レビュー観点

LLM提案を取り込む前に次を確認する。

- 製品名が既存と重複していないか
- 粒度が既存と揃っているか
- 連携が試験対象として妥当か
- `flow_direction` が読み手にとって自然か
- `core` / `secondary` の区分が妥当か
- 初期観点が不足または過剰でないか

## 運用フロー

1. 新規製品候補を入力する
2. LLMが製品候補、連携候補、観点候補を提案する
3. 人が差分レビューする
4. 承認した内容だけCSVへ反映する
5. GUIで位置調整と補足編集を行う
