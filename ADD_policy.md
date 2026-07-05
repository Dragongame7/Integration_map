# 製品追加ポリシー

## 目的

このポリシーは、ローカルLLMまたは人手で新しい製品を追加するときに、粒度、命名、連携、試験観点のぶれを防ぐための運用基準です。

このツールの主目的は、製品カタログ管理ではなく、結合試験の網羅性確認です。

## 基本方針

1. 製品は「試験上、個別に識別したい単位」で追加する。
2. 連携は「結合試験で確認が必要な関係」だけを追加する。
3. ローカルLLMには直接CSVを書かせず、提案JSONを作らせる。
4. 提案JSONは必ず人がレビューし、承認した内容だけ反映する。
5. 不明な内容は推測で埋めず、`TBD` を使う。

## 1製品として登録する基準

### 登録するもの

- 別製品として導入・運用されるもの
- 試験観点が独立するもの
- 他製品との関係を個別に追いたいもの
- 管理製品と被管理製品で役割が異なるもの

例:

- `Splunk`
- `Splunk SOAR`
- `Splunk UEBA`
- `Trellix ePO`
- `Trellix HX`
- `FortiGate`
- `FortiManager`

### 原則として登録しないもの

- 製品内の単機能
- 画面名、モジュール名
- 試験上の識別価値が低い内部部品
- 実体のない概念名

## 製品名の命名ルール

- `component_name` は既存の表記に合わせる
- 現場で通じる名称を優先する
- 表記ゆれを作らない
- 必要がない限りカッコ付き補足は増やさない

例:

- `IDEA CA`
- `Veeam Backup`
- `OpenFreeRadius`

避ける例:

- `fortigate`
- `Forti Gate`
- `Veeam バックアップ`

## ドメイン分類ルール

`domain` は次から選ぶ。

- `User Access`
- `Identity`
- `Network Security`
- `Platform`
- `Security Ops`
- `Operations`

分類目安:

- `User Access`: Outlook、SharePoint、VDI など利用者接点
- `Identity`: AD、MFA、CA、PAM、RADIUS、SSO
- `Network Security`: FW、SW、NW管理
- `Platform`: 仮想基盤、バックアップ、サーバ基盤
- `Security Ops`: SIEM、SOAR、UEBA、EDR、脆弱性、改ざん検知
- `Operations`: 資産管理、バッチ、運用支援

## 連携を追加する基準

### 主連携として追加するもの

- 認証
- 認可
- 設定反映
- 通信制御
- ファイル連携
- API連携
- メール連携
- 管理制御
- 運用成否に直結する連携

この場合は原則 `diagram_default=core` とする。

### 補助連携として追加するもの

- ログ転送
- 監視イベント送信
- アラート連携
- 相関分析向けイベント受け渡し

この場合は原則 `diagram_default=secondary` とする。

### 原則として個別追加しないもの

- OS標準ログのような横断的な一律送信
- 図を読みにくくするだけの常識的依存関係
- 試験で個別判定しない運用補助経路

## 連携方向の定義

`flow_direction` は必須。

- `output`
  - `from_component -> to_component`
  - 左の製品から右の製品へ出す
- `input`
  - `to_component -> from_component`
  - 左の製品が右の製品を参照・利用する
- `bidirectional`
  - 双方向連携

目安:

- ログ送信は通常 `output`
- ポリシー配布は通常 `output`
- AD参照や認証バックエンド参照は通常 `input`
- 相互同期は `bidirectional`

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

## `components.csv` 追加ルール

必須項目:

- `component_name`
- `domain`
- `owner`
- `description`

ルール:

- `owner` は主担当チーム。不明なら `TBD`
- `description` は試験上の役割を短く書く

## `integration_points.csv` 追加ルール

必須項目:

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

不明値は `TBD` を使う。

## `coverage_matrix.csv` 初期追加ルール

連携追加時は、最低限の観点を初期提案する。

標準初期観点:

- `NET`
- `DATA`
- `OPS`

連携種別に応じた追加候補:

- `認証`: `AUTH`
- `認可`: `AUTHZ`
- `設定反映`: `CFG`
- `ログ連携` `監視`: `MON`
- `障害復旧重要`: `FAIL`
- `性能影響あり`: `PERF`
- `セキュリティ条件あり`: `SEC`

## ローカルLLM利用ルール

### LLMに渡すもの

- `data/components.csv`
- `data/integration_points.csv`
- `data/coverage_matrix.csv`
- この `ADD_policy.md`
- 追加したい製品名
- 既知前提

### LLMに期待する出力

- 重複候補
- 製品追加案
- 連携追加案
- 観点追加案
- レビュー観点

### LLMの禁止事項

- 既存製品の改名
- 既存連携の削除
- 不明なポートや方式の断定
- 製品内機能の勝手な別製品化
- ログ連携の無制限な追加

## 推奨ワークフロー

1. 追加対象製品と前提条件を整理する
2. ローカルLLMに提案JSONを作らせる
3. GUIの `提案JSON読込` で読み込む
4. 重複候補、方向、主連携/補助連携、観点をレビューする
5. 承認した内容だけ反映する
6. 必要に応じてGUIで位置や補足情報を調整する

## レビュー観点

- 製品粒度は既存と揃っているか
- 既存製品と重複していないか
- その連携は本当に試験対象か
- `flow_direction` は自然か
- `diagram_default` は適切か
- 初期観点は不足・過剰がないか
