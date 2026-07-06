const VIEWPOINTS = ["NET", "AUTH", "AUTHZ", "CFG", "DATA", "MON", "PERF", "FAIL", "OPS", "SEC"];
const STATUS_PRIORITY = ["FAIL", "HOLD", "PLANNED", "READY", "RUN", "PASS", "NOT_NEEDED"];
const DOMAIN_ORDER = ["User Access", "Identity", "Network Security", "Platform", "Security Ops", "Operations"];
const VALID_CRITICALITIES = ["High", "Medium", "Low"];
const VALID_DIAGRAM_DEFAULTS = ["core", "secondary"];
const VALID_FLOW_DIRECTIONS = ["input", "output", "bidirectional"];
const REMOVED_COMPONENT_NAMES = new Set(["COTS Batch Tool"]);
const STORAGE_KEY = "infra-integration-map-v2-state";

const sample = {
  components: `component_id,component_name,domain,owner,description
CMP-001,Outlook,User Access,M365Team,メール通知と利用者接点
CMP-002,SharePoint,User Access,M365Team,文書管理と権限制御
CMP-003,Active Directory,Identity,IdentityTeam,認証とグループ管理
CMP-004,FortiGate,Network Security,NetworkTeam,境界防御と通信制御
CMP-005,Cisco Switch,Network Security,NetworkTeam,L2/L3ネットワークとSyslog送信
CMP-006,VMware vSphere,Platform,ServerTeam,仮想基盤と仮想サーバ管理
CMP-007,Splunk,Security Ops,OpsTeam,ログ収集と監視アラート
CMP-009,Trellix HX,Security Ops,SecOps,EDRとインシデント調査
CMP-010,SKYSEA,Operations,OpsTeam,資産管理と端末運用管理
CMP-011,OpenFreeRadius,Identity,IdentityTeam,RADIUS認証基盤
CMP-012,Trellix ePO,Operations,SecOps,セキュリティポリシー配布と統合管理
CMP-013,Tenable,Security Ops,SecOps,脆弱性診断と継続監視
CMP-014,Virtru,User Access,M365Team,メール保護と外部共有制御
CMP-015,NextLabs,User Access,M365Team,ファイル共有時の保護とポリシー制御
CMP-016,IDEA CA,Identity,IdentityTeam,認証局と証明書発行管理
CMP-017,Tripwire,Security Ops,SecOps,改ざん検知と構成変更監視
CMP-018,Horizon VDI,User Access,ServerTeam,仮想デスクトップ提供基盤
CMP-019,Veeam Backup,Platform,ServerTeam,バックアップとリストア管理
CMP-020,FortiManager,Network Security,NetworkTeam,FortiGateポリシー統合管理
CMP-021,iDoperation,Identity,IdentityTeam,特権ID管理と操作統制
CMP-022,Themis,Identity,IdentityTeam,多要素認証基盤
CMP-023,Splunk SOAR,Security Ops,SecOps,セキュリティ運用の自動化とオーケストレーション
CMP-024,Splunk UEBA,Security Ops,SecOps,ユーザー行動分析と異常検知`,
  integrations: `integration_id,from_component,to_component,flow_direction,integration_type,business_scenario,purpose,protocol_or_method,protocol,port,environment,criticality,owner,lifecycle_stage,prerequisite_integration_id,consumer_team,provider_team,review_status,expected_evidence,observability_point,last_tested_at,failure_impact,diagram_default,notes
INT-001,Outlook,SharePoint,output,通知,メール通知からの文書参照,通知メールから文書へアクセス,HTTPS,TCP,443,IT,High,M365Team,ケース作成済,,UserSupportTeam,M365Team,Open,アクセス画面キャプチャと認証ログ,SharePointアクセスログと利用者画面,2026-06-28,利用者が文書へ到達できない,core,URL到達と認証状態を確認
INT-002,SharePoint,Active Directory,input,認可,グループ権限による文書閲覧,グループ権限による閲覧制御,LDAP/Graph,TCP,389/443,IT,High,IdentityTeam,実施中,INT-001,M365Team,IdentityTeam,Open,権限差分画面とADグループ変更履歴,SharePoint権限画面とAD監査ログ,2026-06-26,権限過不足により情報漏えいまたは閲覧不可,core,ADグループ反映と権限差分を確認
INT-003,FortiGate,SharePoint,output,通信制御,SharePoint通信の許可と遮断,SharePoint通信の許可と拒否,HTTPS policy,TCP,443,IT,High,NetworkTeam,ケース作成済,INT-001,M365Team,NetworkTeam,Open,FWポリシー設定と遮断ログ,FortiGateトラフィックログ,2026-06-20,許可漏れまたは不要通信の通過,core,FWポリシーと遮断ログを確認
INT-004,VMware vSphere,Active Directory,input,認証,仮想サーバのドメイン参加,仮想サーバのドメイン参加,Kerberos/LDAP,TCP/UDP,88/389/445,IT,High,ServerTeam,実施中,,ServerTeam,IdentityTeam,Open,ドメイン参加結果とGPO適用ログ,イベントログとGPO結果レポート,2026-06-27,サーバ運用と認証連携が成立しない,core,GPO反映と再起動後状態を確認
INT-005,Cisco Switch,Splunk,output,ログ連携,ネットワーク機器ログ集約,ネットワーク機器ログの集約,Syslog,UDP,514,IT,Medium,OpsTeam,完了,,OpsTeam,NetworkTeam,Open,Splunk検索結果と送信元ホスト確認,Splunkインデックス検索,2026-06-30,障害解析に必要なログが欠損,secondary,送信元ホストと時刻を確認
INT-006,FortiGate,Splunk,output,監視,セキュリティイベント監視,セキュリティログ監視,Syslog,UDP,514,IT,High,SecOps,要再試験,INT-005,SecOps,NetworkTeam,Open,Splunkアラート履歴とイベント検索結果,Splunk相関検索とアラート履歴,2026-07-01,重大イベントの検知遅延または未検知,secondary,重大イベントの検知とアラートを確認
INT-007,Outlook,Active Directory,input,認証,利用者認証とアドレス帳参照,利用者認証とアドレス帳参照,Kerberos/LDAP,TCP,88/389,IT,Medium,IdentityTeam,ケース作成済,INT-001,UserSupportTeam,IdentityTeam,Open,認証成功ログと属性参照結果,認証ログと属性参照結果画面,2026-06-24,利用者認証または宛先解決に失敗,core,資格情報と属性参照を確認
INT-010,Virtru,Outlook,output,通知,保護付きメール送受信,メールでの保護連携,Mail add-in/API,TCP,443,IT,High,M365Team,ケース作成済,INT-001,UserSupportTeam,M365Team,Open,暗号化メール画面と送受信ログ,Outlook送信履歴とVirtru監査ログ,2026-07-02,保護付きメールが送受信できない,core,メールでの連携のみ仮登録
INT-011,NextLabs,SharePoint,output,ファイル連携,共有ファイルの保護制御,ファイル共有時の保護連携,Policy enforcement/API,TCP,443,IT,High,M365Team,ケース作成済,,M365Team,M365Team,Open,保護ポリシー適用結果と共有ログ,SharePoint共有履歴とポリシー監査ログ,2026-07-02,共有ファイルに保護ポリシーが適用されない,core,ファイル共有での連携のみ仮登録
INT-012,OpenFreeRadius,Active Directory,input,認証,ネットワーク認証の利用者照合,RADIUS認証基盤の利用者照合,RADIUS/LDAP,UDP/TCP,1812/389,IT,High,IdentityTeam,ケース作成済,,NetworkTeam,IdentityTeam,Open,認証成功ログとAD参照結果,Radius認証ログとAD監査ログ,2026-07-02,利用者認証が成立せずネットワーク接続できない,core,RADIUS認証バックエンドの仮連携
INT-013,SKYSEA,Active Directory,input,認証,端末資産と利用者情報の関連付け,端末管理用の利用者情報参照,LDAP,TCP,389,IT,Medium,OpsTeam,ケース作成済,,OpsTeam,IdentityTeam,Open,端末台帳と利用者情報の参照結果,SKYSEA操作ログとAD参照ログ,2026-07-02,端末利用者情報が突合できない,core,資産管理向けの仮連携
INT-014,SKYSEA,Splunk,output,ログ連携,端末操作ログの集約,端末管理ログの監視連携,Syslog/API,TCP,443/514,IT,Medium,OpsTeam,ケース作成済,INT-013,OpsTeam,SecOps,Open,Splunk検索結果と操作ログ,SKYSEA監査ログとSplunk検索,2026-07-02,端末操作ログが集約されない,secondary,監視用途の仮連携
INT-015,Trellix HX,Splunk,output,監視,EDRイベントの監視集約,EDRイベントの監視連携,Syslog/API,TCP,443/514,IT,High,SecOps,実施中,,SecOps,SecOps,Open,アラート履歴とEDRイベント検索,Splunk相関検索とHXイベントログ,2026-07-03,EDRイベントが監視に上がらない,secondary,EDR監視用途の仮連携
INT-016,Trellix ePO,Trellix HX,output,設定反映,エージェントとポリシー統合管理,EDRポリシー配布と統合管理,Management API,TCP,443,IT,High,SecOps,ケース作成済,INT-015,SecOps,SecOps,Open,ポリシー配布結果と管理コンソール画面,ePO配布ログとHXエージェント状態,2026-07-03,HXへポリシーが反映されない,core,管理基盤の仮連携
INT-017,Tenable,VMware vSphere,output,監視,仮想サーバの脆弱性診断,仮想サーバの脆弱性スキャン連携,Scanner/API,TCP,443,IT,Medium,SecOps,ケース作成済,INT-004,SecOps,ServerTeam,Open,スキャン結果と対象資産一覧,Tenableスキャン結果とvSphere資産情報,2026-07-03,脆弱性診断対象が取得できない,core,脆弱性診断用途の仮連携
INT-018,IDEA CA,Active Directory,input,認証,証明書発行対象の利用者連携,認証局向けの利用者情報連携,LDAP/API,TCP,389/443,IT,High,IdentityTeam,ケース作成済,,IdentityTeam,IdentityTeam,Open,証明書発行結果と利用者情報参照ログ,CA発行ログとAD監査ログ,2026-07-04,証明書発行対象を正しく識別できない,core,認証局用途の仮連携
INT-019,Tripwire,Splunk,output,監視,改ざん検知イベントの集約,改ざん検知イベントの監視連携,Syslog/API,TCP,443/514,IT,High,SecOps,ケース作成済,,SecOps,SecOps,Open,改ざん検知イベントと検索結果,Splunk相関検索とTripwireイベントログ,2026-07-04,改ざん検知イベントが監視へ連携されない,secondary,改ざん検知用途の仮連携
INT-020,Horizon VDI,Active Directory,input,認証,VDI利用者のドメイン認証,仮想デスクトップ利用者認証,Kerberos/LDAP,TCP,88/389,IT,High,ServerTeam,実施中,,UserSupportTeam,IdentityTeam,Open,ログイン成功画面と認証ログ,VDI接続ログとAD認証ログ,2026-07-04,VDI利用者がログインできない,core,VDI認証用途の仮連携
INT-021,Horizon VDI,VMware vSphere,input,運用,仮想デスクトップ基盤のホスト連携,VDIホスト管理連携,Management API,TCP,443,IT,High,ServerTeam,ケース作成済,INT-020,ServerTeam,ServerTeam,Open,仮想デスクトップ一覧とホスト状態,VDI管理画面とvSphere状態画面,2026-07-04,仮想デスクトップを配備できない,core,VDIホスト用途の仮連携
INT-022,Veeam Backup,VMware vSphere,input,運用,仮想基盤バックアップ,バックアップ対象の取得と保護,Backup API,TCP,443,IT,High,ServerTeam,実施中,INT-004,OpsTeam,ServerTeam,Open,バックアップジョブ結果と復元ログ,Veeamジョブ履歴とvSphere資産一覧,2026-07-04,バックアップまたは復元が成立しない,core,バックアップ用途の仮連携
INT-023,FortiManager,FortiGate,output,設定反映,FWポリシーの統合管理,FortiGateポリシー配布管理,Management API,TCP,443,IT,High,NetworkTeam,ケース作成済,INT-003,NetworkTeam,NetworkTeam,Open,ポリシー配布結果と管理画面,FortiManager配布ログとFortiGate設定差分,2026-07-04,FWポリシーを一括反映できない,core,Forti管理用途の仮連携
INT-024,iDoperation,Active Directory,input,認可,特権IDの利用者管理,特権ID管理向けの利用者情報連携,LDAP/API,TCP,389/443,IT,High,IdentityTeam,ケース作成済,,OpsTeam,IdentityTeam,Open,特権ID付与結果と操作ログ,特権申請ログとAD監査ログ,2026-07-04,特権ID付与や棚卸が正しく行えない,core,特権管理用途の仮連携
INT-025,Themis,Horizon VDI,output,認証,VDI利用時の多要素認証,仮想デスクトップ向け多要素認証,Auth API,TCP,443,IT,High,IdentityTeam,ケース作成済,INT-020,UserSupportTeam,IdentityTeam,Open,MFA成功画面と認証履歴,Themis認証履歴とVDI接続ログ,2026-07-04,VDI利用時に多要素認証が成立しない,core,MFA用途の仮連携
INT-026,Splunk,Splunk SOAR,output,運用,検知イベントの自動化連携,セキュリティイベントの自動化連携,REST API,TCP,443,IT,High,SecOps,ケース作成済,INT-006,SecOps,SecOps,Open,プレイブック実行結果と連携ログ,SOARプレイブック履歴とSplunk検索,2026-07-05,検知イベントを自動処理できない,core,SOAR用途の仮連携
INT-027,Splunk,Splunk UEBA,output,監視,ユーザー行動分析向けイベント連携,ユーザー行動分析イベント連携,REST API,TCP,443,IT,High,SecOps,ケース作成済,INT-006,SecOps,SecOps,Open,分析結果とイベント取り込みログ,UEBA分析画面とSplunk検索,2026-07-05,行動分析用イベントを取り込めない,core,UEBA用途の仮連携`,
  coverage: `integration_id,viewpoint_code,viewpoint_name,required,required_reason,status,test_case_id,test_depth,evidence_required,evidence_id,evidence_status,observability_point,last_tested_at,defect_id,owner,remarks
INT-001,NET,通信,Yes,メールからSharePoint URLへ到達できる必要がある,READY,TC-001-001,Normal,Yes,,未取得,SharePointアクセスログ,2026-06-28,,M365Team,メール内URLからSharePointへ到達
INT-001,AUTH,認証,Yes,SSOまたは再認証の期待動作を確認する必要がある,PLANNED,TC-001-002,Normal,Yes,,未取得,認証ログ,2026-06-28,,M365Team,SSOまたは再認証の期待動作
INT-001,AUTHZ,認可,Yes,文書閲覧権限の有無を確認する必要がある,PLANNED,TC-001-003,Abnormal,Yes,,未取得,SharePoint権限画面,2026-06-28,,M365Team,文書閲覧権限の有無
INT-002,AUTHZ,認可,Yes,ADグループ所属によりSharePoint権限が変わるため,READY,TC-002-001,Normal,Yes,,未取得,AD監査ログと権限差分画面,2026-06-26,,IdentityTeam,ADグループ所属による閲覧可否
INT-002,CFG,設定反映,Yes,グループ変更の反映時間が運用影響になるため,HOLD,TC-002-002,Recovery,Yes,,未取得,設定反映確認ログ,2026-06-26,CHG-214,IdentityTeam,グループ変更の反映時間
INT-002,FAIL,障害,Yes,グループ削除後の残存権限を確認するため,PLANNED,TC-002-003,Abnormal,Yes,,未取得,AD削除監査ログ,2026-06-26,,IdentityTeam,グループ削除後の残存権限確認
INT-003,NET,通信,Yes,許可通信が成立する必要がある,READY,TC-003-001,Normal,Yes,,未取得,FortiGateトラフィックログ,2026-06-20,,NetworkTeam,許可通信の成立
INT-003,SEC,セキュリティ,Yes,拒否条件と遮断ログを確認する必要がある,PLANNED,TC-003-002,Abnormal,Yes,,未取得,FortiGate遮断ログ,2026-06-20,,NetworkTeam,拒否条件と遮断ログ
INT-003,FAIL,障害,Yes,ポリシー切戻し後の復旧を確認するため,PLANNED,TC-003-003,Recovery,Yes,,未取得,切戻し後通信ログ,2026-06-20,,NetworkTeam,ポリシー切戻し後の復旧
INT-004,AUTH,認証,Yes,ドメイン参加で認証連携が成立する必要がある,READY,TC-004-001,Normal,Yes,,未取得,イベントログ,2026-06-27,,ServerTeam,ドメイン参加
INT-004,CFG,設定反映,Yes,GPO反映がサーバ設定の前提になるため,PLANNED,TC-004-002,Normal,Yes,,未取得,GPO結果レポート,2026-06-27,,ServerTeam,GPO反映
INT-004,OPS,運用,Yes,クローン復元後の運用手順を確認するため,PLANNED,TC-004-003,Recovery,Yes,,未取得,再参加作業ログ,2026-06-27,,ServerTeam,クローン復元後の再参加
INT-005,DATA,データ連携,Yes,SyslogフィールドがSplunkで抽出できる必要がある,PASS,TC-005-001,Normal,Yes,,未取得,Splunkインデックス検索,2026-06-30,,OpsTeam,Syslogフィールド抽出
INT-005,MON,監視,Yes,ログ欠損を検知できる必要がある,PLANNED,TC-005-002,Abnormal,Yes,,未取得,欠損検知アラート,2026-06-30,,OpsTeam,ログ欠損検知
INT-006,DATA,データ連携,Yes,FortiGateイベントをSplunkで解析できる必要がある,READY,TC-006-001,Normal,Yes,,未取得,Splunkイベント検索,2026-07-01,,SecOps,FortiGateイベント解析
INT-006,MON,監視,Yes,重大イベントをアラートで検知する必要がある,FAIL,TC-006-002,Abnormal,Yes,EVD-006-002,レビュー済,Splunkアラート履歴,2026-07-01,INC-448,SecOps,重大イベントアラートが未発報
INT-006,PERF,性能,Yes,ピーク時転送遅延が監視遅延に影響するため,PLANNED,TC-006-003,Stress,Yes,,未取得,転送遅延メトリクス,2026-07-01,,SecOps,ピーク時転送遅延
INT-007,AUTH,認証,Yes,Outlook認証がAD連携に依存するため,READY,TC-007-001,Normal,Yes,,未取得,認証成功ログ,2026-06-24,,IdentityTeam,Outlook認証
INT-007,DATA,データ連携,Yes,アドレス帳属性参照が利用者操作に影響するため,PLANNED,TC-007-002,Normal,Yes,,未取得,属性参照結果画面,2026-06-24,,IdentityTeam,アドレス帳属性参照
INT-010,DATA,データ連携,Yes,保護付きメールが送受信できる必要がある,PLANNED,TC-010-001,Normal,Yes,,未取得,Virtru送信監査ログ,2026-07-02,,M365Team,保護付きメール送受信
INT-010,AUTHZ,認可,Yes,外部送信時の保護ポリシー適用を確認する必要がある,PLANNED,TC-010-002,Abnormal,Yes,,未取得,ポリシー適用結果画面,2026-07-02,,M365Team,外部送信時の保護制御
INT-011,DATA,データ連携,Yes,共有ファイルに保護ポリシーが付与される必要がある,PLANNED,TC-011-001,Normal,Yes,,未取得,共有ファイル属性と監査ログ,2026-07-02,,M365Team,共有ファイル保護
INT-011,AUTHZ,認可,Yes,共有先に応じた保護制御を確認する必要がある,PLANNED,TC-011-002,Abnormal,Yes,,未取得,共有権限画面とポリシー監査ログ,2026-07-02,,M365Team,共有先別の保護制御
INT-012,AUTH,認証,Yes,RADIUS認証要求がAD照合で成功する必要がある,PLANNED,TC-012-001,Normal,Yes,,未取得,Radius認証ログ,2026-07-02,,IdentityTeam,RADIUS認証成功
INT-012,FAIL,障害,Yes,認証失敗時の拒否動作を確認する必要がある,PLANNED,TC-012-002,Abnormal,Yes,,未取得,失敗時のRadiusログ,2026-07-02,,IdentityTeam,認証失敗時の拒否動作
INT-013,DATA,データ連携,Yes,端末台帳に利用者情報を関連付けられる必要がある,PLANNED,TC-013-001,Normal,Yes,,未取得,SKYSEA台帳画面,2026-07-02,,OpsTeam,端末台帳と利用者情報の突合
INT-013,CFG,設定反映,Yes,AD参照設定が反映される必要がある,PLANNED,TC-013-002,Normal,Yes,,未取得,設定反映ログ,2026-07-02,,OpsTeam,参照設定の反映
INT-014,DATA,データ連携,Yes,SKYSEA操作ログがSplunkへ集約される必要がある,PLANNED,TC-014-001,Normal,Yes,,未取得,Splunk検索結果,2026-07-02,,OpsTeam,SKYSEA操作ログ集約
INT-014,MON,監視,Yes,端末操作イベントを監視できる必要がある,PLANNED,TC-014-002,Abnormal,Yes,,未取得,操作イベントアラート,2026-07-02,,OpsTeam,端末操作イベント監視
INT-015,DATA,データ連携,Yes,HXイベントがSplunkへ連携される必要がある,PLANNED,TC-015-001,Normal,Yes,,未取得,Splunkイベント検索,2026-07-03,,SecOps,HXイベント集約
INT-015,MON,監視,Yes,EDRアラートを相関監視できる必要がある,PLANNED,TC-015-002,Abnormal,Yes,,未取得,相関アラート履歴,2026-07-03,,SecOps,EDRアラート監視
INT-016,CFG,設定反映,Yes,ePOからHXへポリシー配布できる必要がある,PLANNED,TC-016-001,Normal,Yes,,未取得,ePO配布ログ,2026-07-03,,SecOps,ポリシー配布
INT-016,OPS,運用,Yes,エージェント状態を統合管理できる必要がある,PLANNED,TC-016-002,Recovery,Yes,,未取得,HXエージェント状態画面,2026-07-03,,SecOps,エージェント統合管理
INT-017,DATA,データ連携,Yes,TenableがvSphere上の対象資産を取得できる必要がある,PLANNED,TC-017-001,Normal,Yes,,未取得,Tenable資産一覧,2026-07-03,,SecOps,対象資産取得
INT-017,PERF,性能,Yes,スキャン時の負荷影響を確認する必要がある,PLANNED,TC-017-002,Stress,Yes,,未取得,スキャン性能メトリクス,2026-07-03,,SecOps,スキャン時の負荷確認
INT-018,AUTH,認証,Yes,利用者情報をもとに証明書発行対象を識別する必要がある,PLANNED,TC-018-001,Normal,Yes,,未取得,CA発行ログ,2026-07-04,,IdentityTeam,証明書発行対象の識別
INT-018,CFG,設定反映,Yes,証明書テンプレート設定を反映できる必要がある,PLANNED,TC-018-002,Normal,Yes,,未取得,テンプレート設定画面,2026-07-04,,IdentityTeam,証明書テンプレート設定
INT-019,DATA,データ連携,Yes,改ざん検知イベントがSplunkへ集約される必要がある,PLANNED,TC-019-001,Normal,Yes,,未取得,Splunkイベント検索,2026-07-04,,SecOps,改ざん検知イベント集約
INT-019,MON,監視,Yes,改ざん検知アラートを監視できる必要がある,PLANNED,TC-019-002,Abnormal,Yes,,未取得,相関アラート履歴,2026-07-04,,SecOps,改ざん検知アラート監視
INT-020,AUTH,認証,Yes,VDI利用者がドメイン認証できる必要がある,PLANNED,TC-020-001,Normal,Yes,,未取得,VDI接続ログ,2026-07-04,,ServerTeam,VDI利用者認証
INT-020,OPS,運用,Yes,セッション再接続時の認証動作を確認する必要がある,PLANNED,TC-020-002,Recovery,Yes,,未取得,再接続時のセッションログ,2026-07-04,,ServerTeam,セッション再接続時の認証
INT-021,OPS,運用,Yes,VDIホストの配備と状態取得ができる必要がある,PLANNED,TC-021-001,Normal,Yes,,未取得,VDIホスト状態画面,2026-07-04,,ServerTeam,VDIホスト配備
INT-021,PERF,性能,Yes,デスクトップ配備時の性能影響を確認する必要がある,PLANNED,TC-021-002,Stress,Yes,,未取得,配備性能メトリクス,2026-07-04,,ServerTeam,デスクトップ配備時の性能
INT-022,DATA,データ連携,Yes,バックアップ対象VMを取得できる必要がある,PLANNED,TC-022-001,Normal,Yes,,未取得,Veeamジョブ履歴,2026-07-04,,ServerTeam,バックアップ対象VM取得
INT-022,FAIL,障害,Yes,復元時の動作を確認する必要がある,PLANNED,TC-022-002,Recovery,Yes,,未取得,復元ジョブログ,2026-07-04,,ServerTeam,復元時の動作確認
INT-023,CFG,設定反映,Yes,FortiGateへポリシー配布できる必要がある,PLANNED,TC-023-001,Normal,Yes,,未取得,FortiManager配布ログ,2026-07-04,,NetworkTeam,FortiGateポリシー配布
INT-023,FAIL,障害,Yes,配布失敗時の切戻しを確認する必要がある,PLANNED,TC-023-002,Recovery,Yes,,未取得,切戻しログ,2026-07-04,,NetworkTeam,配布失敗時の切戻し
INT-024,AUTHZ,認可,Yes,特権IDの付与制御を確認する必要がある,PLANNED,TC-024-001,Normal,Yes,,未取得,特権申請ログ,2026-07-04,,IdentityTeam,特権ID付与制御
INT-024,OPS,運用,Yes,棚卸や申請承認フローを確認する必要がある,PLANNED,TC-024-002,Recovery,Yes,,未取得,棚卸結果と承認履歴,2026-07-04,,IdentityTeam,特権ID棚卸と承認
INT-025,AUTH,認証,Yes,VDI利用時に多要素認証が成立する必要がある,PLANNED,TC-025-001,Normal,Yes,,未取得,Themis認証履歴,2026-07-04,,IdentityTeam,MFA認証成功
INT-025,FAIL,障害,Yes,MFA失敗時の拒否動作を確認する必要がある,PLANNED,TC-025-002,Abnormal,Yes,,未取得,MFA失敗履歴,2026-07-04,,IdentityTeam,MFA失敗時の拒否動作
INT-026,DATA,データ連携,Yes,検知イベントがSOARへ渡る必要がある,PLANNED,TC-026-001,Normal,Yes,,未取得,SOARイベント受信ログ,2026-07-05,,SecOps,検知イベントの連携
INT-026,OPS,運用,Yes,プレイブック自動実行を確認する必要がある,PLANNED,TC-026-002,Recovery,Yes,,未取得,プレイブック実行履歴,2026-07-05,,SecOps,プレイブック自動実行
INT-027,DATA,データ連携,Yes,UEBA向けイベントが継続的に取り込まれる必要がある,PLANNED,TC-027-001,Normal,Yes,,未取得,UEBAイベント取り込みログ,2026-07-05,,SecOps,UEBA向けイベント取り込み
INT-027,MON,監視,Yes,ユーザー行動の異常検知結果を確認する必要がある,PLANNED,TC-027-002,Abnormal,Yes,,未取得,UEBA異常検知画面,2026-07-05,,SecOps,異常検知結果の確認`,
  servers: `server_id,server_name,product_name,server_role,domain,environment,owner,description,pos_x,pos_y
SRV-001,Outlook Service,Outlook,SaaS Service,User Access,IT,M365Team,Outlookメールサービス,,
SRV-002,SharePoint Service,SharePoint,SaaS Service,User Access,IT,M365Team,SharePoint文書管理サービス,,
SRV-003,Active Directory DC,Active Directory,Domain Controller,Identity,IT,IdentityTeam,認証とディレクトリサービス,,
SRV-004,FortiGate Appliance,FortiGate,Firewall,Network Security,IT,NetworkTeam,境界FWアプライアンス,,
SRV-005,Cisco Switch,Cisco Switch,Network Device,Network Security,IT,NetworkTeam,L2/L3スイッチ,,
SRV-006,VMware vCenter,VMware vSphere,Management Server,Platform,IT,ServerTeam,vSphere管理サーバ,,
SRV-007,Splunk SearchHead,Splunk,SearchHead,Security Ops,IT,SecOps,検索UIとサーチ実行,,
SRV-008,Splunk IndexServer,Splunk,IndexServer,Security Ops,IT,SecOps,イベント保管と検索処理,,
SRV-009,Splunk DeploymentServer,Splunk,DeploymentServer,Security Ops,IT,SecOps,Splunkサーバ設定配布,,
SRV-010,Trellix HX Server,Trellix HX,Management Server,Security Ops,IT,SecOps,EDR管理サーバ,,
SRV-011,SKYSEA Management Server,SKYSEA,Management Server,Operations,IT,OpsTeam,端末管理サーバ,,
SRV-012,OpenFreeRadius Server,OpenFreeRadius,RADIUS Server,Identity,IT,IdentityTeam,RADIUS認証サーバ,,
SRV-013,Trellix ePO Server,Trellix ePO,Management Server,Operations,IT,SecOps,セキュリティ統合管理サーバ,,
SRV-014,Tenable Scanner,Tenable,Scanner,Security Ops,IT,SecOps,脆弱性診断スキャナ,,
SRV-015,Virtru Service,Virtru,SaaS Service,User Access,IT,M365Team,メール保護サービス,,
SRV-016,NextLabs Policy Server,NextLabs,Policy Server,User Access,IT,M365Team,ファイル共有ポリシー制御サーバ,,
SRV-017,IDEA CA Server,IDEA CA,CA Server,Identity,IT,IdentityTeam,認証局サーバ,,
SRV-018,Tripwire Server,Tripwire,Monitoring Server,Security Ops,IT,SecOps,改ざん検知管理サーバ,,
SRV-019,Horizon Connection Server,Horizon VDI,Connection Server,User Access,IT,ServerTeam,VDI接続管理サーバ,,
SRV-020,Veeam Backup Server,Veeam Backup,Backup Server,Platform,IT,ServerTeam,バックアップ管理サーバ,,
SRV-021,FortiManager Server,FortiManager,Management Server,Network Security,IT,NetworkTeam,FortiGate管理サーバ,,
SRV-022,iDoperation Server,iDoperation,Privileged Access Server,Identity,IT,IdentityTeam,特権ID管理サーバ,,
SRV-023,Themis MFA Server,Themis,MFA Server,Identity,IT,IdentityTeam,多要素認証サーバ,,
SRV-024,Splunk SOAR Server,Splunk SOAR,SOAR Server,Security Ops,IT,SecOps,SOARプレイブック実行サーバ,,
SRV-025,Splunk UEBA Server,Splunk UEBA,UEBA Server,Security Ops,IT,SecOps,UEBA分析サーバ,,`,
  serverIntegrations: `server_integration_id,from_server,to_server,flow_direction,integration_type,purpose,protocol,port,criticality,diagram_default,notes
SINT-001,Outlook Service,SharePoint Service,output,通知,メール通知からSharePoint文書へ誘導する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-002,SharePoint Service,Active Directory DC,input,認可,SharePoint権限判定でADグループを参照する,LDAP/Graph,389/443,High,core,製品間連携を代表サーバで表現
SINT-003,FortiGate Appliance,SharePoint Service,output,通信制御,SharePoint通信を許可または遮断する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-004,VMware vCenter,Active Directory DC,input,認証,vSphere管理操作でAD認証を利用する,Kerberos/LDAP,88/389/445,High,core,製品間連携を代表サーバで表現
SINT-005,Cisco Switch,Splunk IndexServer,output,ログ連携,ネットワーク機器ログをSplunkへ集約する,Syslog,514,Medium,secondary,各サーバに入るエージェント系は対象外
SINT-006,FortiGate Appliance,Splunk IndexServer,output,監視,FWログをSplunkへ集約する,Syslog,514,High,secondary,各サーバに入るエージェント系は対象外
SINT-007,Outlook Service,Active Directory DC,input,認証,Outlook利用者認証でADを参照する,Kerberos/LDAP,88/389,Medium,core,製品間連携を代表サーバで表現
SINT-008,Virtru Service,Outlook Service,output,通知,保護付きメール送受信を連携する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-009,NextLabs Policy Server,SharePoint Service,output,ファイル連携,共有ファイルの保護制御を連携する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-010,OpenFreeRadius Server,Active Directory DC,input,認証,RADIUS認証でAD利用者を照合する,LDAP/RADIUS,1812/389,High,core,製品間連携を代表サーバで表現
SINT-011,SKYSEA Management Server,Active Directory DC,input,認証,端末台帳と利用者情報を突合する,LDAP,389,Medium,core,製品間連携を代表サーバで表現
SINT-012,SKYSEA Management Server,Splunk IndexServer,output,ログ連携,端末操作ログをSplunkへ集約する,Syslog/API,443/514,Medium,secondary,各サーバに入るエージェント系は対象外
SINT-013,Trellix HX Server,Splunk IndexServer,output,監視,EDRイベントをSplunkへ集約する,Syslog/API,443/514,High,secondary,各サーバに入るエージェント系は対象外
SINT-014,Trellix ePO Server,Trellix HX Server,output,設定反映,HXへセキュリティポリシーを配布する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-015,Tenable Scanner,VMware vCenter,output,監視,vSphere上の対象資産を診断する,HTTPS,443,Medium,core,製品間連携を代表サーバで表現
SINT-016,IDEA CA Server,Active Directory DC,input,認証,証明書発行対象の利用者情報を参照する,LDAP/HTTPS,389/443,High,core,製品間連携を代表サーバで表現
SINT-017,Tripwire Server,Splunk IndexServer,output,監視,改ざん検知イベントをSplunkへ集約する,Syslog/API,443/514,High,secondary,各サーバに入るエージェント系は対象外
SINT-018,Horizon Connection Server,Active Directory DC,input,認証,VDI利用者のドメイン認証を行う,Kerberos/LDAP,88/389,High,core,製品間連携を代表サーバで表現
SINT-019,Horizon Connection Server,VMware vCenter,input,運用,VDI基盤のホスト状態を管理する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-020,Veeam Backup Server,VMware vCenter,input,運用,vSphere上のVMをバックアップ対象として取得する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-021,FortiManager Server,FortiGate Appliance,output,設定反映,FortiGateへFWポリシーを配布する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-022,iDoperation Server,Active Directory DC,input,認可,特権IDの利用者情報を参照する,LDAP/HTTPS,389/443,High,core,製品間連携を代表サーバで表現
SINT-023,Themis MFA Server,Horizon Connection Server,output,認証,VDI利用時にMFA認証を要求する,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-024,Splunk SearchHead,Splunk IndexServer,output,検索,SearchHeadからIndexServerへ検索要求を行う,HTTPS,8089,High,core,Splunk内部連携
SINT-025,Splunk DeploymentServer,Splunk SearchHead,output,設定配布,DeploymentServerからSearchHeadへ設定を配布する,HTTPS,8089,Medium,core,Splunk内部連携
SINT-026,Splunk DeploymentServer,Splunk IndexServer,output,設定配布,DeploymentServerからIndexServerへ設定を配布する,HTTPS,8089,Medium,core,Splunk内部連携
SINT-027,Splunk IndexServer,Splunk SOAR Server,output,運用,検知イベントをSOARへ渡す,HTTPS,443,High,core,製品間連携を代表サーバで表現
SINT-028,Splunk IndexServer,Splunk UEBA Server,output,監視,UEBA向けイベントを連携する,HTTPS,443,High,core,製品間連携を代表サーバで表現`,
};

let state = {
  components: [],
  integrations: [],
  coverage: [],
  servers: [],
  serverIntegrations: [],
  viewMode: "product",
  proposalReview: null,
  proposalModalOpen: false,
  selectedIntegrationId: "",
  selectedComponentName: "",
  selectedServerName: "",
  selectedServerIntegrationId: "",
  editMode: false,
  pendingConnectionFrom: "",
  pendingConnectionDirection: "output",
  pendingConnectionDiagramDefault: "core",
  editorMode: "",
  draggingComponentName: "",
  dragMoved: false,
  suppressNodeClickName: "",
  detailModalOpen: false,
};

const elements = {
  componentsFile: document.getElementById("componentsFile"),
  integrationsFile: document.getElementById("integrationsFile"),
  coverageFile: document.getElementById("coverageFile"),
  sampleButton: document.getElementById("sampleButton"),
  editModeButton: document.getElementById("editModeButton"),
  addComponentButton: document.getElementById("addComponentButton"),
  addServerButton: document.getElementById("addServerButton"),
  startConnectionButton: document.getElementById("startConnectionButton"),
  autoLayoutButton: document.getElementById("autoLayoutButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  importJsonButton: document.getElementById("importJsonButton"),
  jsonFileInput: document.getElementById("jsonFileInput"),
  importProposalButton: document.getElementById("importProposalButton"),
  exportProposalTemplateButton: document.getElementById("exportProposalTemplateButton"),
  proposalFileInput: document.getElementById("proposalFileInput"),
  criticalityFilter: document.getElementById("criticalityFilter"),
  ownerFilter: document.getElementById("ownerFilter"),
  integrationTypeFilter: document.getElementById("integrationTypeFilter"),
  openOnlyFilter: document.getElementById("openOnlyFilter"),
  showSecondaryFilter: document.getElementById("showSecondaryFilter"),
  pendingConnectionControls: document.getElementById("pendingConnectionControls"),
  pendingConnectionDirectionSelect: document.getElementById("pendingConnectionDirectionSelect"),
  pendingConnectionDiagramSelect: document.getElementById("pendingConnectionDiagramSelect"),
  cancelPendingConnectionToolbarButton: document.getElementById("cancelPendingConnectionToolbarButton"),
  summaryStrip: document.getElementById("summaryStrip"),
  mapSvg: document.getElementById("mapSvg"),
  mapPanel: document.querySelector(".map-panel"),
  mapTitle: document.getElementById("mapTitle"),
  mapLegend: document.getElementById("mapLegend"),
  productMapTab: document.getElementById("productMapTab"),
  serverMapTab: document.getElementById("serverMapTab"),
  selectedDetail: document.getElementById("selectedDetail"),
  editorPanel: document.getElementById("editorPanel"),
  detailModal: document.getElementById("detailModal"),
  detailModalBackdrop: document.getElementById("detailModalBackdrop"),
  closeDetailModalButton: document.getElementById("closeDetailModalButton"),
  proposalModal: document.getElementById("proposalModal"),
  proposalModalBackdrop: document.getElementById("proposalModalBackdrop"),
  closeProposalModalButton: document.getElementById("closeProposalModalButton"),
  proposalSummary: document.getElementById("proposalSummary"),
  proposalReview: document.getElementById("proposalReview"),
  proposalSelectAllButton: document.getElementById("proposalSelectAllButton"),
  proposalClearAllButton: document.getElementById("proposalClearAllButton"),
  applyProposalButton: document.getElementById("applyProposalButton"),
  riskTableBody: document.querySelector("#riskTable tbody"),
  coverageTable: document.getElementById("coverageTable"),
  productMatrixTable: document.getElementById("productMatrixTable"),
};

elements.sampleButton.addEventListener("click", () => loadSample(false));
elements.editModeButton.addEventListener("click", toggleEditMode);
elements.addComponentButton.addEventListener("click", beginAddComponent);
elements.addServerButton.addEventListener("click", beginAddServer);
elements.startConnectionButton.addEventListener("click", toggleConnectionMode);
elements.autoLayoutButton.addEventListener("click", autoArrangeComponents);
elements.exportJsonButton.addEventListener("click", exportJson);
elements.exportCsvButton.addEventListener("click", exportCsvFiles);
elements.importJsonButton.addEventListener("click", () => elements.jsonFileInput.click());
elements.jsonFileInput.addEventListener("change", importJson);
elements.importProposalButton.addEventListener("click", () => elements.proposalFileInput.click());
elements.exportProposalTemplateButton.addEventListener("click", exportProposalTemplate);
elements.proposalFileInput.addEventListener("change", importProposalJson);
elements.componentsFile.addEventListener("change", loadUploadedFiles);
elements.integrationsFile.addEventListener("change", loadUploadedFiles);
elements.coverageFile.addEventListener("change", loadUploadedFiles);
elements.criticalityFilter.addEventListener("change", render);
elements.ownerFilter.addEventListener("change", render);
elements.integrationTypeFilter.addEventListener("change", render);
elements.openOnlyFilter.addEventListener("change", render);
elements.showSecondaryFilter.addEventListener("change", render);
elements.pendingConnectionDirectionSelect.addEventListener("change", updatePendingConnectionControls);
elements.pendingConnectionDiagramSelect.addEventListener("change", updatePendingConnectionControls);
elements.cancelPendingConnectionToolbarButton.addEventListener("click", cancelPendingConnection);
elements.productMapTab.addEventListener("click", () => setViewMode("product"));
elements.serverMapTab.addEventListener("click", () => setViewMode("server"));
elements.closeDetailModalButton.addEventListener("click", closeDetailModal);
elements.detailModalBackdrop.addEventListener("click", closeDetailModal);
elements.closeProposalModalButton.addEventListener("click", closeProposalModal);
elements.proposalModalBackdrop.addEventListener("click", closeProposalModal);
elements.proposalSelectAllButton.addEventListener("click", () => toggleAllProposalSelections(true));
elements.proposalClearAllButton.addEventListener("click", () => toggleAllProposalSelections(false));
elements.applyProposalButton.addEventListener("click", applyProposalSelections);
window.addEventListener("keydown", handleWindowKeydown);

initializeApp();

async function initializeApp() {
  if (loadSavedState()) {
    hydrateOwnerFilter();
    hydrateIntegrationTypeFilter();
    render();
    return;
  }
  await loadSample(false);
}

async function loadSample(preferSaved = false) {
  if (preferSaved && loadSavedState()) {
    hydrateOwnerFilter();
    hydrateIntegrationTypeFilter();
    render();
    return;
  }

  const loaded = await loadBundledCsv();
  if (loaded) {
    return;
  }

  state = {
    ...sanitizeLoadedData({
      components: parseCsv(sample.components),
      integrations: parseCsv(sample.integrations),
      coverage: parseCsv(sample.coverage),
      servers: parseCsv(sample.servers),
      serverIntegrations: parseCsv(sample.serverIntegrations),
    }),
    proposalReview: null,
    proposalModalOpen: false,
    selectedIntegrationId: "INT-006",
    selectedComponentName: "",
    editMode: false,
    viewMode: "product",
    pendingConnectionFrom: "",
    pendingConnectionDirection: "output",
    pendingConnectionDiagramDefault: "core",
    editorMode: "",
    detailModalOpen: false,
  };
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
  render();
}

async function loadBundledCsv() {
  try {
    const [componentsText, integrationsText, coverageText, serversText, serverIntegrationsText] = await Promise.all([
      fetch("../data/components.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
      fetch("../data/integration_points.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
      fetch("../data/coverage_matrix.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
      fetchOptionalCsv("../data/servers.csv"),
      fetchOptionalCsv("../data/server_integration_points.csv"),
    ]);

      state = {
        ...sanitizeLoadedData({
          components: parseCsv(componentsText),
          integrations: parseCsv(integrationsText),
          coverage: parseCsv(coverageText),
          servers: parseCsv(serversText || sample.servers),
          serverIntegrations: parseCsv(serverIntegrationsText || sample.serverIntegrations),
        }),
        proposalReview: null,
        proposalModalOpen: false,
        selectedIntegrationId: "INT-006",
      selectedComponentName: "",
      editMode: false,
      viewMode: "product",
      pendingConnectionFrom: "",
      pendingConnectionDirection: "output",
      pendingConnectionDiagramDefault: "core",
      editorMode: "",
      detailModalOpen: false,
    };
    hydrateOwnerFilter();
    hydrateIntegrationTypeFilter();
    persistState();
    render();
    return true;
  } catch (error) {
    return false;
  }
}

function ensureOk(response) {
  if (!response.ok) {
    throw new Error(`Failed to load ${response.url}`);
  }
  return response;
}

async function fetchOptionalCsv(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return "";
    return response.text();
  } catch (error) {
    return "";
  }
}

async function loadUploadedFiles() {
  const { componentsFile, integrationsFile, coverageFile } = elements;
  if (!componentsFile.files[0] || !integrationsFile.files[0] || !coverageFile.files[0]) {
    return;
  }

  const [componentsText, integrationsText, coverageText] = await Promise.all([
    componentsFile.files[0].text(),
    integrationsFile.files[0].text(),
    coverageFile.files[0].text(),
  ]);

  state = {
    ...sanitizeLoadedData({
      components: parseCsv(componentsText),
      integrations: parseCsv(integrationsText),
      coverage: parseCsv(coverageText),
      servers: state.servers,
      serverIntegrations: state.serverIntegrations,
    }),
    proposalReview: null,
    proposalModalOpen: false,
    selectedIntegrationId: "",
    selectedComponentName: "",
    editMode: false,
    viewMode: "product",
    pendingConnectionFrom: "",
    pendingConnectionDirection: "output",
    pendingConnectionDiagramDefault: "core",
    editorMode: "",
    detailModalOpen: false,
  };
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
  render();
}

function render() {
  const layoutBaseline = getFilteredIntegrations({ includeSecondary: true }).map(enrichIntegration);
  const enriched = getFilteredIntegrations().map(enrichIntegration);
  const displayIntegrations = getDisplayIntegrations(enriched);
  if (!enriched.some((row) => row.integration_id === state.selectedIntegrationId) && enriched[0]) {
    state.selectedIntegrationId = enriched[0].integration_id;
  }
  if (state.selectedComponentName && !layoutBaseline.some(isRelatedToSelectedComponent)) {
    state.selectedComponentName = "";
  }
  if (!displayIntegrations.some((row) => row.integration_id === state.selectedIntegrationId) && displayIntegrations[0]) {
    state.selectedIntegrationId = displayIntegrations[0].integration_id;
  }

  renderSummary(displayIntegrations, enriched);
  renderMapMode(enriched, layoutBaseline);
  renderDetail(displayIntegrations);
  renderEditorPanel(displayIntegrations);
  renderRiskTable(displayIntegrations);
  renderCoverageTable(displayIntegrations);
  renderProductMatrixTable(displayIntegrations);
  renderControlState();
  renderDetailModalState();
  renderProposalModalState();
}

function hydrateOwnerFilter() {
  const owners = Array.from(new Set(state.integrations.map((row) => row.owner).filter(Boolean))).sort();
  elements.ownerFilter.innerHTML = `<option value="ALL">すべて</option>${owners
    .map((owner) => `<option value="${escapeHtml(owner)}">${escapeHtml(owner)}</option>`)
    .join("")}`;
}

function hydrateIntegrationTypeFilter() {
  const types = Array.from(new Set(state.integrations.map((row) => row.integration_type).filter(Boolean))).sort();
  elements.integrationTypeFilter.innerHTML = `<option value="ALL">すべて</option>${types
    .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`)
    .join("")}`;
}

function getFilteredIntegrations(options = {}) {
  const criticality = elements.criticalityFilter.value;
  const owner = elements.ownerFilter.value;
  const integrationType = elements.integrationTypeFilter.value;
  const openOnly = elements.openOnlyFilter.checked;
  const showSecondary = elements.showSecondaryFilter.checked;
  const includeSecondary = options.includeSecondary === true;

  return state.integrations.filter((integration) => {
    const enriched = enrichIntegration(integration);
    if (criticality !== "ALL" && integration.criticality !== criticality) {
      return false;
    }
    if (owner !== "ALL" && integration.owner !== owner) {
      return false;
    }
    if (integrationType !== "ALL" && integration.integration_type !== integrationType) {
      return false;
    }
    if (openOnly && enriched.riskCount === 0) {
      return false;
    }
    if (!includeSecondary && !showSecondary && getDiagramDefault(integration) === "secondary") {
      return false;
    }
    return true;
  });
}

function enrichIntegration(integration) {
  const rows = state.coverage.filter((row) => row.integration_id === integration.integration_id);
  const requiredRows = rows.filter((row) => isYes(row.required));
  const openRows = requiredRows.filter((row) => normalizeStatus(row.status) !== "PASS");
  const evidenceMissingRows = requiredRows.filter((row) => normalizeStatus(row.status) === "PASS" && needsEvidence(row) && !hasReviewedEvidence(row));
  const missingCoverage = requiredRows.length === 0;
  const worstStatus = pickWorstStatus(requiredRows.map((row) => normalizeStatus(row.status)));

  return {
    ...integration,
    coverageRows: rows,
    requiredRows,
    openRows,
    evidenceMissingRows,
    missingCoverage,
    openCount: openRows.length,
    evidenceMissingCount: evidenceMissingRows.length,
    riskCount: openRows.length + evidenceMissingRows.length + (missingCoverage ? 1 : 0),
    passCount: requiredRows.filter((row) => normalizeStatus(row.status) === "PASS").length,
    worstStatus,
  };
}

function renderSummary(integrations, allIntegrations) {
  const componentNames = new Set(
    integrations.flatMap((row) => [row.from_component, row.to_component].filter(Boolean))
  );
  const requiredCount = integrations.reduce((sum, row) => sum + row.requiredRows.length, 0);
  const openCount = integrations.reduce((sum, row) => sum + row.openCount, 0);
  const highOpen = integrations.filter((row) => row.criticality === "High" && row.openCount > 0).length;
  const missingCoverageCount = integrations.filter((row) => row.missingCoverage).length;
  const evidenceMissingCount = integrations.reduce((sum, row) => sum + row.evidenceMissingCount, 0);
  const focusedLabel = state.selectedComponentName || "全体";
  const secondaryHiddenCount = allIntegrations.filter((row) => getDiagramDefault(row) === "secondary").length - integrations.filter((row) => getDiagramDefault(row) === "secondary").length;

  const cards = [
    ["表示対象", focusedLabel],
    ["構成要素", componentNames.size],
    ["結合点", integrations.length],
    ["補助連携非表示", Math.max(secondaryHiddenCount, 0)],
    ["要試験観点", requiredCount],
    ["未完了観点", openCount],
    ["証跡不足", evidenceMissingCount],
    ["観点未定義", missingCoverageCount],
    ["High未完了", highOpen],
  ];

  elements.summaryStrip.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="summary-card${typeof value === "string" ? " summary-card-text" : ""}" title="${escapeHtml(String(value))}">
          <div class="summary-label">${escapeHtml(label)}</div>
          <div class="summary-value${typeof value === "string" ? " summary-value-text" : ""}">${escapeHtml(String(value))}</div>
        </article>
      `
    )
    .join("");
}

function renderMap(integrations, baselineIntegrations = integrations) {
  const width = 1920;
  const height = 1120;
  const domains = DOMAIN_ORDER;
  const domainX = new Map(domains.map((domain, index) => [domain, 150 + index * 300]));
  const componentsByName = new Map(state.components.map((component) => [component.component_name, component]));
  const visibleNames = state.editMode
    ? state.components.map((component) => component.component_name)
    : Array.from(new Set(baselineIntegrations.flatMap((row) => [row.from_component, row.to_component].filter(Boolean))));
  const grouped = groupBy(visibleNames, (name) => componentsByName.get(name)?.domain || "Operations");
  const positions = new Map();
  const nodeMetrics = new Map(visibleNames.map((name) => [name, getNodeMetrics(name)]));

  domains.forEach((domain) => {
    const names = grouped.get(domain) || [];
    const startY = Math.max(120, 330 - names.length * 48);
    names.forEach((name, index) => {
      const component = componentsByName.get(name) || {};
      const customX = Number(component.pos_x);
      const customY = Number(component.pos_y);
      positions.set(name, {
        x: Number.isFinite(customX) && customX > 0 ? customX : domainX.get(domain) || 150,
        y: Number.isFinite(customY) && customY > 0 ? customY : startY + index * 112,
        domain,
      });
    });
  });

    const defs = `
      <defs>
        ${["output", "input", "bidirectional"].flatMap((direction) => [
          `
          <marker id="arrow-core-${direction}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="${flowDirectionColor(direction)}"></path>
          </marker>
        `,
          `
          <marker id="arrow-secondary-${direction}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="${secondaryFlowDirectionColor(direction)}"></path>
          </marker>
        `,
        ]).join("")}
      </defs>
    `;

  const domainLabels = domains
    .map((domain) => `<text x="${domainX.get(domain)}" y="42" text-anchor="middle" class="domain-label">${domain}</text>`)
    .join("");

  const routePlans = buildFixedSourceRoutePlans(
    integrations,
    positions,
    nodeMetrics,
    (row) => row.integration_id,
    (row) => row.from_component,
    (row) => row.to_component
  );

  const edges = integrations
    .map((row) => {
      const plan = routePlans.find((item) => item?.row.integration_id === row.integration_id);
      if (!plan) return "";
        const selected = state.selectedIntegrationId === row.integration_id;
        const relatedToComponent = !state.selectedComponentName || isRelatedToSelectedComponent(row);
        const diagramDefault = getDiagramDefault(row);
        const secondary = diagramDefault === "secondary";
        const flowDirection = normalizeFlowDirection(row.flow_direction);
        const color = secondary ? secondaryFlowDirectionColor(flowDirection) : flowDirectionColor(flowDirection);
        const widthValue = selected ? 5.4 : relatedToComponent ? (row.riskCount > 0 ? 3.4 : 2.6) : 1.4;
        const opacity = selected ? 1 : relatedToComponent ? 0.92 : 0.16;
        const dangerMark = selected && row.riskCount > 0
        ? `<circle cx="${plan.labelX}" cy="${plan.labelY - 18}" r="9" fill="#b42318"></circle>
           <text x="${plan.labelX}" y="${plan.labelY - 14}" text-anchor="middle" fill="#fff" font-size="10" font-weight="900">${row.riskCount}</text>`
        : "";
        const edgeLabel = selected ? [row.integration_id, row.integration_type].filter(Boolean).join(" ") : "";
          const edgeLabelMarkup = selected
            ? `<text x="${plan.labelX}" y="${plan.labelY - 28}" text-anchor="middle">${escapeHtml(edgeLabel)}</text>`
            : "";
          const markerRef = `url(#arrow-${secondary ? "secondary" : "core"}-${flowDirection})`;
        const markerStart = flowDirection === "input" || flowDirection === "bidirectional" ? ` marker-start="${markerRef}"` : "";
        const markerEnd = flowDirection === "output" || flowDirection === "bidirectional" ? ` marker-end="${markerRef}"` : "";

        return `
          <g class="edge ${selected ? "edge-selected" : ""} ${secondary ? "edge-secondary" : "edge-core"} ${relatedToComponent ? "edge-related" : "edge-muted"}" data-id="${escapeHtml(row.integration_id)}" tabindex="0">
            <path d="${plan.pathData}"
            stroke="${color}" stroke-width="${widthValue}" opacity="${opacity}" stroke-linejoin="round" stroke-linecap="round"${markerStart}${markerEnd}></path>
            ${edgeLabelMarkup}
            ${dangerMark}
          </g>
        `;
    })
    .join("");

  const nodes = visibleNames
    .map((name) => {
      const pos = positions.get(name);
      const component = componentsByName.get(name) || {};
      const metrics = nodeMetrics.get(name);
      if (!pos) return "";
      if (!metrics) return "";
      const selected = state.selectedComponentName === name;
      const related = !state.selectedComponentName || name === state.selectedComponentName || baselineIntegrations.some((row) =>
        isComponentRelated(name, row)
      );
      return `
        <g class="node ${selected ? "node-selected" : related ? "node-related" : "node-muted"} ${state.editMode ? "node-draggable" : ""}" data-name="${escapeHtml(name)}" tabindex="0" transform="translate(${pos.x - metrics.halfWidth}, ${pos.y - 28})">
          <rect width="${metrics.width}" height="56" rx="6"></rect>
          <text x="${metrics.halfWidth}" y="25" text-anchor="middle">${escapeHtml(name)}</text>
          <text class="domain" x="${metrics.halfWidth}" y="42" text-anchor="middle">${escapeHtml(component.owner || pos.domain)}</text>
        </g>
      `;
    })
    .join("");

    elements.mapSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    elements.mapSvg.innerHTML = `${defs}${domainLabels}${edges}${nodes}`;
    elements.mapSvg.querySelectorAll(".edge").forEach((edge) => {
      const select = (openDetail = false) => {
        state.selectedIntegrationId = edge.dataset.id;
        state.selectedComponentName = "";
        state.editorMode = "";
        state.detailModalOpen = openDetail;
        render();
      };
      edge.addEventListener("click", () => select(false));
      edge.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        select(true);
      });
      edge.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(false);
        }
      });
    });
    elements.mapSvg.querySelectorAll(".node").forEach((node) => {
      if (state.editMode) {
        node.addEventListener("pointerdown", (event) => startNodeDrag(event, node.dataset.name));
      }
      const focus = (openDetail = false) => {
        const name = node.dataset.name;
        if (state.suppressNodeClickName === name) {
          state.suppressNodeClickName = "";
          return;
        }
        if (state.editMode && state.pendingConnectionFrom) {
          if (state.pendingConnectionFrom === name) {
            state.pendingConnectionFrom = "";
            state.pendingConnectionDirection = "output";
            state.pendingConnectionDiagramDefault = "core";
          } else {
            createIntegrationBetween(
              state.pendingConnectionFrom,
              name,
              state.pendingConnectionDirection,
              state.pendingConnectionDiagramDefault
            );
            state.pendingConnectionFrom = "";
            state.pendingConnectionDirection = "output";
            state.pendingConnectionDiagramDefault = "core";
            state.selectedComponentName = "";
            state.selectedIntegrationId = "";
            state.detailModalOpen = false;
          }
        } else {
          state.selectedComponentName = state.selectedComponentName === name ? "" : name;
          state.selectedIntegrationId = "";
        }
        state.editorMode = "";
        state.detailModalOpen =
          !state.pendingConnectionFrom && openDetail && Boolean(state.selectedComponentName || state.selectedIntegrationId);
        render();
      };
      node.addEventListener("click", () => focus(false));
      node.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        focus(true);
      });
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          focus(false);
        }
      });
    });
  }

function renderServerMap(serverIntegrations = state.serverIntegrations, servers = state.servers, targetSvg = elements.mapSvg) {
  const width = 1920;
  const height = 1120;
  const domains = Array.from(new Set([...DOMAIN_ORDER, ...servers.map((server) => server.domain).filter(Boolean)]));
  const domainX = new Map(domains.map((domain, index) => [domain, 150 + index * 300]));
  const serversByName = new Map(servers.map((server) => [server.server_name, server]));
  const visibleServerNames = Array.from(new Set(servers.map((server) => server.server_name).filter(Boolean)));
  const grouped = groupBy(visibleServerNames, (name) => serversByName.get(name)?.domain || "Operations");
  const positions = new Map();
  const nodeMetrics = new Map(visibleServerNames.map((name) => [name, getNodeMetrics(name)]));

  domains.forEach((domain) => {
    const names = grouped.get(domain) || [];
    const startY = Math.max(140, 360 - names.length * 54);
    names.forEach((name, index) => {
      const server = serversByName.get(name) || {};
      const customX = Number(server.pos_x);
      const customY = Number(server.pos_y);
      positions.set(name, {
        x: Number.isFinite(customX) && customX > 0 ? customX : domainX.get(domain) || 150,
        y: Number.isFinite(customY) && customY > 0 ? customY : startY + index * 122,
        domain,
      });
    });
  });

  const defs = `
    <defs>
      ${["output", "input", "bidirectional"].map(
        (direction) => `
          <marker id="server-arrow-${direction}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="${flowDirectionColor(direction)}"></path>
          </marker>
        `
      ).join("")}
    </defs>
  `;
  const productLabels = domains
    .map((domain) => `<text x="${domainX.get(domain)}" y="42" text-anchor="middle" class="domain-label">${escapeHtml(domain)}</text>`)
    .join("");

  const routePlans = buildFixedSourceRoutePlans(
    serverIntegrations,
    positions,
    nodeMetrics,
    (row) => row.server_integration_id,
    (row) => row.from_server,
    (row) => row.to_server
  );

  const edges = serverIntegrations
    .map((row) => {
      const plan = routePlans.find((item) => item?.row.server_integration_id === row.server_integration_id);
      if (!plan?.pathData) return "";
      const direction = normalizeFlowDirection(row.flow_direction);
      const color = flowDirectionColor(direction);
      const markerRef = `url(#server-arrow-${direction})`;
      const markerStart = direction === "input" || direction === "bidirectional" ? ` marker-start="${markerRef}"` : "";
      const markerEnd = direction === "output" || direction === "bidirectional" ? ` marker-end="${markerRef}"` : "";
      const selected = state.selectedServerIntegrationId === row.server_integration_id;
      const diagramClass = normalizeDiagramDefault(row.diagram_default) === "secondary" ? "edge-secondary" : "edge-core";
      return `
        <g class="edge ${selected ? "edge-selected" : ""} ${diagramClass} edge-related" data-server-integration-id="${escapeHtml(row.server_integration_id || "")}" tabindex="0">
          <path d="${plan.pathData}" stroke="${color}" stroke-width="2.6" opacity="0.92" stroke-linejoin="round" stroke-linecap="round"${markerStart}${markerEnd}></path>
        </g>
      `;
    })
    .join("");

  const nodes = visibleServerNames
    .map((name) => {
      const pos = positions.get(name);
      const server = serversByName.get(name) || {};
      const metrics = nodeMetrics.get(name);
      if (!pos || !metrics) return "";
      const selected = state.selectedServerName === name;
      return `
        <g class="node ${selected ? "node-selected" : "node-related"} ${state.editMode ? "node-draggable" : ""}" data-server-name="${escapeHtml(name)}" tabindex="0" transform="translate(${pos.x - metrics.halfWidth}, ${pos.y - 28})">
          <rect width="${metrics.width}" height="56" rx="6"></rect>
          <text x="${metrics.halfWidth}" y="25" text-anchor="middle">${escapeHtml(name)}</text>
          <text class="domain" x="${metrics.halfWidth}" y="42" text-anchor="middle">${escapeHtml(server.server_role || server.product_name || pos.domain)}</text>
        </g>
      `;
    })
    .join("");

  targetSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  targetSvg.innerHTML = `${defs}${productLabels}${edges}${nodes}`;
  targetSvg.querySelectorAll("[data-server-integration-id]").forEach((edge) => {
    const select = () => {
      state.selectedServerIntegrationId = edge.dataset.serverIntegrationId || "";
      state.selectedServerName = "";
      state.detailModalOpen = state.editMode;
      render();
    };
    edge.addEventListener("click", select);
    edge.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });
  targetSvg.querySelectorAll("[data-server-name]").forEach((node) => {
    if (state.editMode) {
      node.addEventListener("pointerdown", (event) => startServerDrag(event, node.dataset.serverName));
    }
    const select = () => {
      const name = node.dataset.serverName;
      if (state.suppressNodeClickName === name) {
        state.suppressNodeClickName = "";
        return;
      }
      if (state.editMode && state.pendingConnectionFrom) {
        if (state.pendingConnectionFrom === name) {
          state.pendingConnectionFrom = "";
          state.pendingConnectionDirection = "output";
          state.pendingConnectionDiagramDefault = "core";
        } else {
          createServerIntegrationBetween(
            state.pendingConnectionFrom,
            name,
            state.pendingConnectionDirection,
            state.pendingConnectionDiagramDefault
          );
          state.pendingConnectionFrom = "";
          state.pendingConnectionDirection = "output";
          state.pendingConnectionDiagramDefault = "core";
          state.selectedServerName = "";
          state.selectedServerIntegrationId = "";
          state.detailModalOpen = false;
        }
      } else {
        state.selectedServerName = state.selectedServerName === name ? "" : name;
        state.selectedServerIntegrationId = "";
      }
      state.editorMode = "";
      state.detailModalOpen = !state.pendingConnectionFrom && state.editMode && Boolean(state.selectedServerName || state.selectedServerIntegrationId);
      render();
    };
    node.addEventListener("click", select);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });
}

function renderDetail(integrations) {
  if (state.viewMode === "server") {
    const selectedServer = state.servers.find((row) => row.server_name === state.selectedServerName);
    const selectedLink = state.serverIntegrations.find((row) => row.server_integration_id === state.selectedServerIntegrationId);
    if (selectedServer) {
      const relatedCount = state.serverIntegrations.filter(
        (row) => row.from_server === selectedServer.server_name || row.to_server === selectedServer.server_name
      ).length;
      elements.selectedDetail.innerHTML = `
        <div class="detail-block">
          <div class="detail-label">サーバ</div>
          <div class="detail-value">${escapeHtml(selectedServer.server_name)}</div>
          <div>${escapeHtml(selectedServer.description || "")}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">製品 / 役割</div>
          <div class="chip-row">
            <span class="chip chip-low">${escapeHtml(selectedServer.product_name || "")}</span>
            <span class="chip chip-hold">${escapeHtml(selectedServer.server_role || "")}</span>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">関連サーバ間連携</div>
          <div class="detail-value">${escapeHtml(String(relatedCount))} 件</div>
        </div>
      `;
      return;
    }
    if (selectedLink) {
      elements.selectedDetail.innerHTML = `
        <div class="detail-block">
          <div class="detail-label">サーバ間連携</div>
          <div class="detail-value">${escapeHtml(selectedLink.server_integration_id)} / ${escapeHtml(formatServerIntegrationLink(selectedLink))}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">方式</div>
          <div>${escapeHtml([selectedLink.integration_type, selectedLink.protocol, selectedLink.port].filter(Boolean).join(" / "))}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">目的</div>
          <div>${escapeHtml(selectedLink.purpose || "")}</div>
        </div>
      `;
      return;
    }
    elements.selectedDetail.innerHTML = `
      <div class="detail-block">
        <div class="detail-label">サーバ間連携図</div>
        <div class="detail-value">${escapeHtml(String(state.servers.length))} servers / ${escapeHtml(String(state.serverIntegrations.length))} links</div>
        <div class="empty-state">編集モードでサーバをドラッグできます。線を選択すると接続元・接続先を変更できます。</div>
      </div>
    `;
    return;
  }

  if (state.selectedComponentName) {
    renderComponentDetail(integrations);
    return;
  }
  const selected = integrations.find((row) => row.integration_id === state.selectedIntegrationId);
  if (!selected) {
    elements.selectedDetail.innerHTML = `<p class="empty-state">連携線を選択すると、目的、担当、未完了観点、証跡の状態を確認できます。</p>`;
    return;
  }

  const chips = selected.requiredRows.length
    ? selected.requiredRows
        .map((row) => `<span class="chip chip-${statusToken(row.status)}">${escapeHtml(row.viewpoint_code)} ${escapeHtml(normalizeStatus(row.status))}</span>`)
        .join("")
    : `<span class="chip chip-hold">観点未定義</span>`;
  const evidenceChips = selected.evidenceMissingRows.length
    ? selected.evidenceMissingRows
        .map((row) => `<span class="chip chip-planned">${escapeHtml(row.viewpoint_code)} 証跡不足</span>`)
        .join("")
    : `<span class="chip chip-pass">証跡不足なし</span>`;

    elements.selectedDetail.innerHTML = `
      <div class="detail-block">
        <div class="detail-label">結合点</div>
        <div class="detail-value">${escapeHtml(selected.integration_id)} / ${escapeHtml(formatIntegrationLink(selected))}</div>
      </div>
    <div class="detail-block">
      <div class="detail-label">シナリオ / 連携目的</div>
      <div class="detail-value">${escapeHtml(selected.business_scenario || "")}</div>
      <div>${escapeHtml(selected.purpose || "")}</div>
    </div>
      <div class="detail-block">
        <div class="detail-label">種別 / 向き / 方式 / 重要度 / 担当</div>
        <div class="chip-row">
          <span class="chip chip-low">${escapeHtml(selected.integration_type || "未分類")}</span>
          <span class="chip chip-low">${escapeHtml(getFlowDirectionLabel(selected))}</span>
          <span class="chip chip-${criticalityToken(selected.criticality)}">${escapeHtml(selected.criticality || "")}</span>
          <span class="chip chip-hold">${escapeHtml(formatProtocol(selected))}</span>
          <span class="chip chip-hold">${escapeHtml(selected.owner || "")}</span>
        </div>
      </div>
    <div class="detail-block">
      <div class="detail-label">進捗 / 前提 / テスト日</div>
      <div class="chip-row">
        <span class="chip chip-hold">${escapeHtml(selected.lifecycle_stage || "未設定")}</span>
        <span class="chip chip-hold">${escapeHtml(selected.prerequisite_integration_id || "前提なし")}</span>
        <span class="chip chip-hold">${escapeHtml(selected.last_tested_at || "未実施")}</span>
      </div>
    </div>
    <div class="detail-block">
      <div class="detail-label">利用側 / 提供側</div>
      <div class="chip-row">
        <span class="chip chip-low">${escapeHtml(selected.consumer_team || "")}</span>
        <span class="chip chip-low">${escapeHtml(selected.provider_team || "")}</span>
      </div>
    </div>
    <div class="detail-block">
      <div class="detail-label">試験観点</div>
      <div class="chip-row">${chips}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">証跡</div>
      <div>${escapeHtml(selected.expected_evidence || "")}</div>
      <div class="chip-row">${evidenceChips}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">確認ポイント</div>
      <div>${escapeHtml(selected.observability_point || "")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">失敗時影響</div>
      <div>${escapeHtml(selected.failure_impact || "")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">メモ</div>
      <div>${escapeHtml(selected.notes || "")}</div>
    </div>
  `;
}

function renderComponentDetail(integrations) {
  const component = state.components.find((row) => row.component_name === state.selectedComponentName) || {};
  const relatedIntegrations = integrations.filter(isRelatedToSelectedComponent);
  const openCount = relatedIntegrations.reduce((sum, row) => sum + row.openCount, 0);
  const riskCount = relatedIntegrations.reduce((sum, row) => sum + row.riskCount, 0);
    const owners = Array.from(new Set(relatedIntegrations.map((row) => row.owner).filter(Boolean))).join(" / ");
    const relatedLabels = relatedIntegrations
      .map((row) => `${row.integration_id}: ${formatIntegrationLink(row)} [${getFlowDirectionLabel(row)}]`)
      .join("<br>");

  elements.selectedDetail.innerHTML = `
    <div class="detail-block">
      <div class="detail-label">製品</div>
      <div class="detail-value">${escapeHtml(state.selectedComponentName)}</div>
      <div>${escapeHtml(component.description || "")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">ドメイン / 担当</div>
      <div class="chip-row">
        <span class="chip chip-low">${escapeHtml(component.domain || "")}</span>
        <span class="chip chip-hold">${escapeHtml(component.owner || owners || "")}</span>
      </div>
    </div>
    <div class="detail-block">
      <div class="detail-label">関連結合点</div>
      <div class="detail-value">${escapeHtml(String(relatedIntegrations.length))} 件</div>
      <div>未完了観点 ${escapeHtml(String(openCount))} / 要確認リスク ${escapeHtml(String(riskCount))}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">担当チーム</div>
      <div>${escapeHtml(owners || "")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">関連連携</div>
      <div>${relatedLabels || "関連結合点なし"}</div>
    </div>
  `;
}

function renderEditorPanel(integrations) {
  if (state.viewMode === "server") {
    const selectedServer = state.servers.find((row) => row.server_name === state.selectedServerName);
    const selectedLink = state.serverIntegrations.find((row) => row.server_integration_id === state.selectedServerIntegrationId);
    const body = !state.editMode
      ? `<div class="empty-state">編集モードを有効にすると、サーバまたはサーバ間連携を編集できます。</div>`
      : state.editorMode === "new-server"
        ? renderServerForm(null)
      : selectedLink
        ? renderServerIntegrationForm(selectedLink)
        : selectedServer
          ? renderServerForm(selectedServer)
          : `<div class="empty-state">サーバまたはサーバ間連携を選択してください。</div>`;
    elements.editorPanel.innerHTML = `
      <div class="detail-block">
        <div class="detail-label">Edit Mode</div>
        ${body}
      </div>
    `;
    bindServerEditorEvents();
    return;
  }

  if (!state.editMode) {
    elements.editorPanel.innerHTML = `
      <div class="detail-block">
        <div class="detail-label">編集ガイド</div>
        <div class="empty-state">編集モードを有効にすると、選択中の製品または連携線をここで直接編集できます。</div>
      </div>
    `;
    return;
  }

  const selectedComponent = state.components.find((row) => row.component_name === state.selectedComponentName);
  const selectedIntegration = state.integrations.find((row) => row.integration_id === state.selectedIntegrationId);
  const statusNote = state.pendingConnectionFrom
    ? `接続開始元: ${state.pendingConnectionFrom} / 向き: ${getFlowDirectionLabel({ flow_direction: state.pendingConnectionDirection })}。接続先の製品ノードをクリックすると線を追加します。`
    : "編集モードです。製品を追加するか、製品詳細・結合点詳細を変更できます。";

  let body = `<p class="empty-state">製品または結合点を選択してください。</p>`;
  if (state.pendingConnectionFrom) {
    body = renderPendingConnectionForm();
  } else if (state.editorMode === "new-component") {
    body = renderComponentForm();
  } else if (selectedComponent) {
    body = renderComponentForm(selectedComponent);
  } else if (selectedIntegration) {
    body = renderIntegrationForm(selectedIntegration);
  }

  elements.editorPanel.innerHTML = `
    <div class="status-note">${escapeHtml(statusNote)}</div>
    <div class="detail-block">
      <div class="detail-label">Edit Mode</div>
      ${body}
    </div>
  `;

  bindEditorPanelEvents();
}

function renderComponentForm(component) {
  const isNew = !component;
  const source = component || {
    component_name: "",
    domain: "Operations",
    owner: "",
    description: "",
  };

  return `
    <form id="${isNew ? "componentCreateForm" : "componentEditForm"}" class="editor-form">
      <div class="editor-grid">
        <label>
          製品名
          <input name="component_name" value="${escapeHtml(source.component_name)}" required />
        </label>
        <label>
          ドメイン
          <select name="domain">${renderSelectOptions(getDomainOptions(), source.domain)}</select>
        </label>
        <label>
          担当
          <input name="owner" value="${escapeHtml(source.owner || "")}" />
        </label>
      </div>
      <label>
        説明
        <textarea name="description">${escapeHtml(source.description || "")}</textarea>
      </label>
      <div class="editor-actions">
        <button type="submit">${isNew ? "製品を追加" : "製品を保存"}</button>
        ${isNew ? `<button type="button" id="cancelComponentCreateButton">閉じる</button>` : `<button type="button" id="componentConnectButton">この製品から線を引く</button><button type="button" id="resetComponentPositionButton">自動配置へ戻す</button><button type="button" id="deleteComponentButton">製品を削除</button>`}
      </div>
    </form>
  `;
}

function renderPendingConnectionForm() {
  return `
    <form id="pendingConnectionForm" class="editor-form">
      <div class="editor-grid">
        <label>
          接続開始元
          <input value="${escapeHtml(state.pendingConnectionFrom || "")}" disabled />
        </label>
        <label>
          向き
          <select name="pending_flow_direction">${renderFlowDirectionOptions(normalizeFlowDirection(state.pendingConnectionDirection))}</select>
        </label>
        <label>
          図の扱い
          <select name="pending_diagram_default">${renderSelectOptions(["core", "secondary"], normalizeDiagramDefault(state.pendingConnectionDiagramDefault))}</select>
        </label>
      </div>
      <div class="detail-block">
        <div class="detail-label">操作方法</div>
        <div>地図上で接続先の製品をクリックすると線を追加します。</div>
        <div class="empty-state">同じ製品をクリックするとキャンセルします。</div>
      </div>
      <div class="editor-actions">
        <button type="submit">向きを更新</button>
        <button type="button" id="cancelPendingConnectionButton">線追加を中止</button>
      </div>
    </form>
  `;
}

function renderIntegrationForm(integration) {
  const coverageRows = state.coverage
    .filter((row) => row.integration_id === integration.integration_id)
    .map((row, index) => ({ row, index }));

  return `
    <form id="integrationEditForm" class="editor-form">
        <div class="editor-grid">
          <label>
            接続元
            <select name="from_component">${renderSelectOptions(state.components.map((row) => row.component_name), integration.from_component)}</select>
        </label>
        <label>
          接続先
          <select name="to_component">${renderSelectOptions(state.components.map((row) => row.component_name), integration.to_component)}</select>
        </label>
          <label>
            連携種別
            <input name="integration_type" value="${escapeHtml(integration.integration_type || "")}" />
          </label>
          <label>
            向き
            <select name="flow_direction">${renderFlowDirectionOptions(normalizeFlowDirection(integration.flow_direction))}</select>
          </label>
          <label>
            重要度
            <select name="criticality">${renderSelectOptions(["High", "Medium", "Low"], integration.criticality)}</select>
          </label>
        <label>
          進捗
          <select name="lifecycle_stage">${renderSelectOptions(["設計中", "ケース作成済", "実施中", "完了", "要再試験"], integration.lifecycle_stage)}</select>
        </label>
        <label>
          担当
          <input name="owner" value="${escapeHtml(integration.owner || "")}" />
        </label>
        <label>
          利用側
          <input name="consumer_team" value="${escapeHtml(integration.consumer_team || "")}" />
        </label>
        <label>
          提供側
          <input name="provider_team" value="${escapeHtml(integration.provider_team || "")}" />
        </label>
        <label>
          プロトコル
          <input name="protocol" value="${escapeHtml(integration.protocol || "")}" />
        </label>
        <label>
          ポート
          <input name="port" value="${escapeHtml(integration.port || "")}" />
        </label>
        <label>
          最終実施日
          <input name="last_tested_at" type="date" value="${escapeHtml(integration.last_tested_at || "")}" />
        </label>
        <label>
          図の扱い
          <select name="diagram_default">${renderSelectOptions(["core", "secondary"], getDiagramDefault(integration))}</select>
        </label>
      </div>
      <label>
        シナリオ
        <input name="business_scenario" value="${escapeHtml(integration.business_scenario || "")}" />
      </label>
      <label>
        目的
        <textarea name="purpose">${escapeHtml(integration.purpose || "")}</textarea>
      </label>
      <label>
        確認ポイント
        <textarea name="observability_point">${escapeHtml(integration.observability_point || "")}</textarea>
      </label>
      <label>
        メモ
        <textarea name="notes">${escapeHtml(integration.notes || "")}</textarea>
      </label>
      <div class="editor-actions">
        <button type="submit">結合点を保存</button>
        <button type="button" id="addCoverageRowButton">観点を追加</button>
        <button type="button" id="deleteIntegrationButton">結合点を削除</button>
      </div>
    </form>
    <form id="coverageEditForm" class="editor-form">
      <div class="coverage-editor-list">
        ${coverageRows.map(({ row, index }) => renderCoverageEditorItem(row, index)).join("")}
      </div>
      <div class="editor-actions">
        <button type="submit">観点を保存</button>
      </div>
    </form>
  `;
}

function renderCoverageEditorItem(row, index) {
  return `
    <div class="coverage-editor-item">
      <div class="coverage-editor-head">
        <div class="coverage-editor-title">${escapeHtml(row.viewpoint_code || `観点 ${index + 1}`)}</div>
        <button type="button" data-coverage-delete="${index}">削除</button>
      </div>
      <div class="editor-grid">
        <label>
          コード
          <input name="viewpoint_code_${index}" value="${escapeHtml(row.viewpoint_code || "")}" />
        </label>
        <label>
          観点名
          <input name="viewpoint_name_${index}" value="${escapeHtml(row.viewpoint_name || "")}" />
        </label>
        <label>
          必要
          <select name="required_${index}">${renderSelectOptions(["Yes", "No"], row.required || "Yes")}</select>
        </label>
        <label>
          ステータス
          <select name="status_${index}">${renderSelectOptions(["PLANNED", "READY", "RUN", "PASS", "FAIL", "HOLD", "NOT_NEEDED"], normalizeStatus(row.status))}</select>
        </label>
        <label>
          深さ
          <select name="test_depth_${index}">${renderSelectOptions(["Normal", "Abnormal", "Recovery", "Stress", "Smoke"], row.test_depth || "Normal")}</select>
        </label>
        <label>
          担当
          <input name="owner_${index}" value="${escapeHtml(row.owner || "")}" />
        </label>
        <label>
          テストケース
          <input name="test_case_id_${index}" value="${escapeHtml(row.test_case_id || "")}" />
        </label>
        <label>
          証跡要否
          <select name="evidence_required_${index}">${renderSelectOptions(["Yes", "No"], row.evidence_required || "Yes")}</select>
        </label>
        <label>
          証跡ID
          <input name="evidence_id_${index}" value="${escapeHtml(row.evidence_id || "")}" />
        </label>
        <label>
          証跡状態
          <select name="evidence_status_${index}">${renderSelectOptions(["未取得", "取得済", "レビュー済"], row.evidence_status || "未取得")}</select>
        </label>
        <label>
          最終実施
          <input name="last_tested_at_${index}" type="date" value="${escapeHtml(row.last_tested_at || "")}" />
        </label>
        <label>
          障害票
          <input name="defect_id_${index}" value="${escapeHtml(row.defect_id || "")}" />
        </label>
      </div>
      <label>
        必要理由
        <textarea name="required_reason_${index}">${escapeHtml(row.required_reason || "")}</textarea>
      </label>
      <label>
        確認ポイント
        <textarea name="observability_point_${index}">${escapeHtml(row.observability_point || "")}</textarea>
      </label>
      <label>
        備考
        <textarea name="remarks_${index}">${escapeHtml(row.remarks || "")}</textarea>
      </label>
    </div>
  `;
}

function renderServerForm(server) {
  const isNew = !server;
  const source = server || {
    server_name: "",
    product_name: state.components[0]?.component_name || "",
    server_role: "",
    domain: "Operations",
    owner: "",
    description: "",
  };
  return `
    <form id="${isNew ? "serverCreateForm" : "serverEditForm"}" class="editor-form">
      <div class="editor-grid">
        <label>
          サーバ名
          <input name="server_name" value="${escapeHtml(source.server_name || "")}" required />
        </label>
        <label>
          製品
          <select name="product_name">${renderSelectOptions(state.components.map((row) => row.component_name), source.product_name)}</select>
        </label>
        <label>
          役割
          <input name="server_role" value="${escapeHtml(source.server_role || "")}" />
        </label>
        <label>
          ドメイン
          <select name="domain">${renderSelectOptions(DOMAIN_ORDER, source.domain || "Operations")}</select>
        </label>
        <label>
          担当
          <input name="owner" value="${escapeHtml(source.owner || "")}" />
        </label>
      </div>
      <label>
        説明
        <textarea name="description">${escapeHtml(source.description || "")}</textarea>
      </label>
      <div class="editor-actions">
        <button type="submit">${isNew ? "サーバを追加" : "サーバを保存"}</button>
        ${isNew ? `<button type="button" id="cancelServerCreateButton">閉じる</button>` : `<button type="button" id="deleteServerButton">サーバを削除</button>`}
      </div>
    </form>
  `;
}

function renderServerIntegrationForm(integration) {
  const serverNames = state.servers.map((row) => row.server_name);
  return `
    <form id="serverIntegrationEditForm" class="editor-form">
      <div class="editor-grid">
        <label>
          接続元サーバ
          <select name="from_server">${renderSelectOptions(serverNames, integration.from_server)}</select>
        </label>
        <label>
          接続先サーバ
          <select name="to_server">${renderSelectOptions(serverNames, integration.to_server)}</select>
        </label>
        <label>
          向き
          <select name="flow_direction">${renderFlowDirectionOptions(normalizeFlowDirection(integration.flow_direction))}</select>
        </label>
        <label>
          連携種別
          <input name="integration_type" value="${escapeHtml(integration.integration_type || "")}" />
        </label>
        <label>
          プロトコル
          <input name="protocol" value="${escapeHtml(integration.protocol || "")}" />
        </label>
        <label>
          ポート
          <input name="port" value="${escapeHtml(integration.port || "")}" />
        </label>
        <label>
          重要度
          <select name="criticality">${renderSelectOptions(["High", "Medium", "Low"], integration.criticality || "Medium")}</select>
        </label>
        <label>
          図の扱い
          <select name="diagram_default">${renderSelectOptions(["core", "secondary"], normalizeDiagramDefault(integration.diagram_default))}</select>
        </label>
      </div>
      <label>
        目的
        <textarea name="purpose">${escapeHtml(integration.purpose || "")}</textarea>
      </label>
      <label>
        メモ
        <textarea name="notes">${escapeHtml(integration.notes || "")}</textarea>
      </label>
      <div class="editor-actions">
        <button type="submit">サーバ間連携を保存</button>
        <button type="button" id="deleteServerIntegrationButton">サーバ間連携を削除</button>
      </div>
    </form>
  `;
}

function bindServerEditorEvents() {
  const serverCreateForm = document.getElementById("serverCreateForm");
  if (serverCreateForm) {
    serverCreateForm.addEventListener("submit", saveNewServer);
    document.getElementById("cancelServerCreateButton")?.addEventListener("click", cancelServerCreate);
  }
  const serverForm = document.getElementById("serverEditForm");
  if (serverForm) {
    serverForm.addEventListener("submit", saveServerEdits);
    document.getElementById("deleteServerButton")?.addEventListener("click", deleteSelectedServer);
  }
  const serverIntegrationForm = document.getElementById("serverIntegrationEditForm");
  if (serverIntegrationForm) {
    serverIntegrationForm.addEventListener("submit", saveServerIntegrationEdits);
    document.getElementById("deleteServerIntegrationButton")?.addEventListener("click", deleteSelectedServerIntegration);
  }
}

function bindEditorPanelEvents() {
  const createForm = document.getElementById("componentCreateForm");
  if (createForm) {
    createForm.addEventListener("submit", saveNewComponent);
    document.getElementById("cancelComponentCreateButton")?.addEventListener("click", () => {
      state.editorMode = "";
      render();
    });
  }

  const pendingConnectionForm = document.getElementById("pendingConnectionForm");
  if (pendingConnectionForm) {
    pendingConnectionForm.addEventListener("submit", savePendingConnectionSettings);
    document.getElementById("cancelPendingConnectionButton")?.addEventListener("click", cancelPendingConnection);
  }

  const componentForm = document.getElementById("componentEditForm");
  if (componentForm) {
    componentForm.addEventListener("submit", saveComponentEdits);
    document.getElementById("componentConnectButton")?.addEventListener("click", () => {
      if (!state.selectedComponentName) return;
      state.pendingConnectionFrom = state.selectedComponentName;
      state.pendingConnectionDirection = "output";
      state.pendingConnectionDiagramDefault = "core";
      state.detailModalOpen = false;
      render();
    });
    document.getElementById("resetComponentPositionButton")?.addEventListener("click", resetSelectedComponentPosition);
    document.getElementById("deleteComponentButton")?.addEventListener("click", deleteSelectedComponent);
  }

  const integrationForm = document.getElementById("integrationEditForm");
  if (integrationForm) {
    integrationForm.addEventListener("submit", saveIntegrationEdits);
    document.getElementById("addCoverageRowButton")?.addEventListener("click", addCoverageRowToSelectedIntegration);
    document.getElementById("deleteIntegrationButton")?.addEventListener("click", deleteSelectedIntegration);
  }

  const coverageForm = document.getElementById("coverageEditForm");
  if (coverageForm) {
    coverageForm.addEventListener("submit", saveCoverageEdits);
    document.querySelectorAll("[data-coverage-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteCoverageRowAt(Number(button.dataset.coverageDelete));
      });
    });
  }
}

function renderRiskTable(integrations) {
  const risks = integrations
    .filter((row) => row.riskCount > 0)
    .sort((a, b) => riskScore(b) - riskScore(a));

  elements.riskTableBody.innerHTML = risks
    .map((row) => {
      const riskLabels = getRiskLabels(row).join(" / ");
        return `
          <tr>
            <td>${escapeHtml(row.integration_id)}</td>
            <td class="wrap">${escapeHtml(formatIntegrationLink(row))}<br>${escapeHtml(getFlowDirectionLabel(row))} / ${escapeHtml(row.purpose || "")}</td>
            <td>${escapeHtml(row.integration_type || "")}</td>
            <td class="compact">${escapeHtml(row.lifecycle_stage || "")}</td>
          <td><span class="chip chip-${criticalityToken(row.criticality)}">${escapeHtml(row.criticality || "")}</span></td>
          <td class="wrap">${escapeHtml(riskLabels)}</td>
          <td>${escapeHtml(row.owner || "")}</td>
        </tr>
      `;
    })
    .join("");
}

function renderCoverageTable(integrations) {
  const thead = elements.coverageTable.querySelector("thead");
  const tbody = elements.coverageTable.querySelector("tbody");

  thead.innerHTML = `<tr><th>結合ID</th><th>深さ</th><th>確認ポイント</th><th>最終実施</th><th>障害票</th>${VIEWPOINTS.map((code) => `<th>${code}</th>`).join("")}</tr>`;
  tbody.innerHTML = integrations
    .map((integration) => {
      const byCode = new Map(integration.coverageRows.map((row) => [row.viewpoint_code, row]));
      const representative = integration.coverageRows[0] || {};
      const cells = VIEWPOINTS.map((code) => {
        const row = byCode.get(code);
        if (!row) return `<td class="status-cell"></td>`;
        return `<td class="status-cell"><span class="chip chip-${statusToken(row.status)}">${escapeHtml(normalizeStatus(row.status))}</span></td>`;
      }).join("");
      return `<tr><td>${escapeHtml(integration.integration_id)}</td><td class="compact">${escapeHtml(summarizeDepth(integration.coverageRows))}</td><td class="wrap">${escapeHtml(summarizeObservability(integration.coverageRows))}</td><td class="compact">${escapeHtml(summarizeLastTestedAt(integration.coverageRows))}</td><td class="compact">${escapeHtml(summarizeDefects(integration.coverageRows))}</td>${cells}</tr>`;
    })
      .join("");
}

function renderProductMatrixTable(integrations) {
  const thead = elements.productMatrixTable.querySelector("thead");
  const tbody = elements.productMatrixTable.querySelector("tbody");
  const componentNames = Array.from(
    new Set(integrations.flatMap((row) => [row.from_component, row.to_component]).filter(Boolean))
  ).sort((a, b) => compareComponentNames(a, b));

  if (!componentNames.length) {
    thead.innerHTML = "";
    tbody.innerHTML = `<tr><td class="empty-state">表示対象の連携がありません。</td></tr>`;
    return;
  }

  thead.innerHTML = `
    <tr>
      <th class="matrix-corner">製品</th>
      ${componentNames.map((name) => `<th class="matrix-col-head">${escapeHtml(name)}</th>`).join("")}
    </tr>
  `;

  tbody.innerHTML = componentNames
    .map((rowName) => {
      const cells = componentNames
        .map((colName) => renderProductMatrixCell(rowName, colName, integrations))
        .join("");
      return `<tr><th class="matrix-row-head">${escapeHtml(rowName)}</th>${cells}</tr>`;
    })
    .join("");

  elements.productMatrixTable.querySelectorAll("[data-matrix-integration-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const integrationId = button.dataset.matrixIntegrationId;
        if (!integrationId) return;
        state.selectedIntegrationId = integrationId;
        state.selectedComponentName = "";
        state.editorMode = "";
        state.detailModalOpen = false;
        render();
        jumpToMapPanel();
      });
    });
}

function renderProductMatrixCell(rowName, colName, integrations) {
  if (rowName === colName) {
    return `<td class="matrix-cell is-diagonal">-</td>`;
  }

  const matches = integrations.filter(
    (row) =>
      (row.from_component === rowName && row.to_component === colName) ||
      (row.from_component === colName && row.to_component === rowName)
  );
  if (!matches.length) {
    return `<td class="matrix-cell"></td>`;
  }

  const primary = matches[0];
  const label = matches.map((row) => `${row.integration_id}: ${formatIntegrationLink(row)}`).join("\n");
  const mark = matches.length > 1 ? `○${matches.length}` : "○";
  return `
    <td class="matrix-cell has-link">
      <button type="button" data-matrix-integration-id="${escapeHtml(primary.integration_id)}" title="${escapeHtml(label)}">${escapeHtml(mark)}</button>
    </td>
  `;
}

function getDisplayIntegrations(integrations) {
  if (!state.selectedComponentName) {
    return integrations;
  }
  return integrations.filter(isRelatedToSelectedComponent);
}

function compareComponentNames(leftName, rightName) {
  const leftComponent = state.components.find((row) => row.component_name === leftName) || { component_name: leftName, domain: "Operations" };
  const rightComponent = state.components.find((row) => row.component_name === rightName) || { component_name: rightName, domain: "Operations" };
  return compareComponentsForLayout(leftComponent, rightComponent);
}

function jumpToMapPanel() {
  elements.mapPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderControlState() {
  elements.editModeButton.textContent = state.editMode ? "編集モード終了" : "編集モード開始";
  const productMode = state.viewMode !== "server";
  const serverMode = state.viewMode === "server";
  elements.addComponentButton.disabled = !productMode || !state.editMode;
  elements.addServerButton.hidden = !serverMode;
  elements.addServerButton.disabled = !serverMode || !state.editMode;
  const canStartProductConnection = productMode && state.editMode && Boolean(state.selectedComponentName);
  const canStartServerConnection = serverMode && state.editMode && Boolean(state.selectedServerName);
  elements.startConnectionButton.disabled = !(canStartProductConnection || canStartServerConnection);
  elements.autoLayoutButton.disabled = !productMode || !state.editMode;
  elements.startConnectionButton.textContent = state.pendingConnectionFrom
    ? `接続先を選択中: ${state.pendingConnectionFrom} (${getFlowDirectionLabel({ flow_direction: state.pendingConnectionDirection })})`
    : "線を引く";
  elements.pendingConnectionControls.hidden = !state.pendingConnectionFrom;
  elements.pendingConnectionDirectionSelect.value = normalizeFlowDirection(state.pendingConnectionDirection);
  elements.pendingConnectionDiagramSelect.value = normalizeDiagramDefault(state.pendingConnectionDiagramDefault);
}

function updatePendingConnectionControls() {
  state.pendingConnectionDirection = normalizeFlowDirection(elements.pendingConnectionDirectionSelect.value);
  state.pendingConnectionDiagramDefault = normalizeDiagramDefault(elements.pendingConnectionDiagramSelect.value);
  renderControlState();
}

function renderMapMode(enriched, layoutBaseline) {
  const isServerMode = state.viewMode === "server";
  elements.mapTitle.textContent = isServerMode ? "サーバ間連携図" : "製品間連携図";
  elements.mapSvg.setAttribute("aria-label", isServerMode ? "サーバ間連携図" : "システム基盤の製品間連携図");
  elements.productMapTab.classList.toggle("is-active", !isServerMode);
  elements.serverMapTab.classList.toggle("is-active", isServerMode);
  elements.productMapTab.setAttribute("aria-selected", isServerMode ? "false" : "true");
  elements.serverMapTab.setAttribute("aria-selected", isServerMode ? "true" : "false");
  elements.mapLegend.classList.toggle("is-server-mode", isServerMode);

  if (isServerMode) {
    state.selectedComponentName = "";
    state.selectedIntegrationId = "";
    renderServerMap();
    return;
  }

  renderMap(enriched, layoutBaseline);
}

function setViewMode(viewMode) {
  state.viewMode = viewMode === "server" ? "server" : "product";
  if (state.viewMode === "server") {
    state.pendingConnectionFrom = "";
    state.pendingConnectionDirection = "output";
    state.pendingConnectionDiagramDefault = "core";
    state.selectedComponentName = "";
    state.selectedIntegrationId = "";
    state.editorMode = "";
    state.detailModalOpen = false;
  } else {
    state.selectedServerName = "";
    state.selectedServerIntegrationId = "";
    if (state.editorMode === "new-server") {
      state.editorMode = "";
    }
  }
  persistState();
  render();
}

function startNodeDrag(event, componentName) {
  if (!state.editMode || !componentName) return;
  if (state.pendingConnectionFrom) return;
  event.preventDefault();
  state.draggingComponentName = componentName;
  state.dragMoved = false;

  const onMove = (moveEvent) => {
    const point = clientPointToSvg(moveEvent);
    if (!point) return;
    state.dragMoved = true;
    state.components = state.components.map((row) =>
      row.component_name === componentName
        ? {
            ...row,
            pos_x: String(Math.round(point.x)),
            pos_y: String(Math.round(point.y)),
          }
        : row
    );
    render();
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    if (state.dragMoved) {
      state.suppressNodeClickName = componentName;
      persistState();
    }
    state.draggingComponentName = "";
    state.dragMoved = false;
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

function startServerDrag(event, serverName) {
  if (!state.editMode || state.viewMode !== "server" || !serverName) return;
  if (state.pendingConnectionFrom) return;
  event.preventDefault();
  state.draggingComponentName = serverName;
  state.dragMoved = false;

  const onMove = (moveEvent) => {
    const point = clientPointToSvg(moveEvent);
    if (!point) return;
    state.dragMoved = true;
    state.servers = state.servers.map((row) =>
      row.server_name === serverName
        ? {
            ...row,
            pos_x: String(Math.round(point.x)),
            pos_y: String(Math.round(point.y)),
          }
        : row
    );
    render();
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    if (state.dragMoved) {
      state.suppressNodeClickName = serverName;
      persistState();
    }
    state.draggingComponentName = "";
    state.dragMoved = false;
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

function toggleEditMode() {
  state.editMode = !state.editMode;
  state.pendingConnectionFrom = "";
  state.pendingConnectionDirection = "output";
  state.pendingConnectionDiagramDefault = "core";
  state.editorMode = "";
  state.detailModalOpen = state.editMode && Boolean(state.selectedComponentName || state.selectedIntegrationId);
  render();
}

function beginAddComponent() {
  if (!state.editMode) return;
  state.selectedComponentName = "";
  state.selectedIntegrationId = "";
  state.editorMode = "new-component";
  state.detailModalOpen = true;
  render();
}

function beginAddServer() {
  if (!state.editMode || state.viewMode !== "server") return;
  state.selectedServerName = "";
  state.selectedServerIntegrationId = "";
  state.editorMode = "new-server";
  state.detailModalOpen = true;
  render();
}

function toggleConnectionMode() {
  if (!state.editMode) return;
  if (state.viewMode === "server") {
    if (!state.selectedServerName) return;
    if (state.pendingConnectionFrom) {
      state.pendingConnectionFrom = "";
      state.pendingConnectionDirection = "output";
      state.pendingConnectionDiagramDefault = "core";
      state.detailModalOpen = true;
    } else {
      state.pendingConnectionFrom = state.selectedServerName;
      state.pendingConnectionDirection = "output";
      state.pendingConnectionDiagramDefault = "core";
      state.detailModalOpen = false;
    }
    state.editorMode = "";
    render();
    return;
  }
  if (!state.selectedComponentName) return;
  if (state.pendingConnectionFrom) {
    state.pendingConnectionFrom = "";
    state.pendingConnectionDirection = "output";
    state.pendingConnectionDiagramDefault = "core";
    state.detailModalOpen = true;
  } else {
    state.pendingConnectionFrom = state.selectedComponentName;
    state.pendingConnectionDirection = "output";
    state.pendingConnectionDiagramDefault = "core";
    state.detailModalOpen = false;
  }
  state.editorMode = "";
  render();
}

function autoArrangeComponents() {
  const domainX = new Map(DOMAIN_ORDER.map((domain, index) => [domain, 150 + index * 300]));
  const componentsByDomain = groupBy(
    [...state.components].sort((a, b) => compareComponentsForLayout(a, b)),
    (component) => component.domain || "Operations"
  );

  state.components = state.components.map((component) => {
    const domain = component.domain || "Operations";
    const group = componentsByDomain.get(domain) || [];
    const index = group.findIndex((row) => row.component_id === component.component_id);
    const startY = Math.max(120, 330 - group.length * 48);
    return {
      ...component,
      pos_x: String(domainX.get(domain) || 150),
      pos_y: String(Math.round(startY + index * 112)),
    };
  });
  persistState();
  render();
}

function saveNewComponent(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const component = {
    component_id: nextId("CMP", state.components.map((row) => row.component_id)),
    component_name: String(formData.get("component_name") || "").trim(),
    domain: String(formData.get("domain") || "Operations").trim(),
    owner: String(formData.get("owner") || "").trim(),
    description: String(formData.get("description") || "").trim(),
  };
  if (!component.component_name) return;
  state.components = [...state.components, component];
  state.selectedComponentName = component.component_name;
  state.editorMode = "";
  state.detailModalOpen = true;
  persistState();
  render();
}

function saveComponentEdits(event) {
  event.preventDefault();
  const previousName = state.selectedComponentName;
  const formData = new FormData(event.currentTarget);
  const nextName = String(formData.get("component_name") || "").trim();
  if (!previousName || !nextName) return;

  state.components = state.components.map((row) =>
    row.component_name === previousName
      ? {
          ...row,
          component_name: nextName,
          domain: String(formData.get("domain") || row.domain).trim(),
          owner: String(formData.get("owner") || "").trim(),
          description: String(formData.get("description") || "").trim(),
        }
      : row
  );

  state.integrations = state.integrations.map((row) => ({
    ...row,
    from_component: row.from_component === previousName ? nextName : row.from_component,
    to_component: row.to_component === previousName ? nextName : row.to_component,
  }));

  if (state.pendingConnectionFrom === previousName) {
    state.pendingConnectionFrom = nextName;
  }
  state.selectedComponentName = nextName;
  state.detailModalOpen = true;
  persistState();
  render();
}

function deleteSelectedComponent() {
  const componentName = state.selectedComponentName;
  if (!componentName) return;

  const integrationIds = state.integrations
    .filter((row) => row.from_component === componentName || row.to_component === componentName)
    .map((row) => row.integration_id);
  const serversToDelete = state.servers.filter((row) => row.product_name === componentName).map((row) => row.server_name);
  const serverIntegrationCount = state.serverIntegrations.filter(
    (row) => serversToDelete.includes(row.from_server) || serversToDelete.includes(row.to_server)
  ).length;
  const coverageCount = state.coverage.filter((row) => integrationIds.includes(row.integration_id)).length;
  const confirmed = window.confirm(
    [
      `製品「${componentName}」を削除します。`,
      `製品間連携 ${integrationIds.length} 件`,
      `観点 ${coverageCount} 件`,
      `サーバ ${serversToDelete.length} 件`,
      `サーバ間連携 ${serverIntegrationCount} 件`,
      "を合わせて削除します。続行しますか？",
    ].join("\n")
  );
  if (!confirmed) return;

  state.components = state.components.filter((row) => row.component_name !== componentName);
  state.integrations = state.integrations.filter((row) => !integrationIds.includes(row.integration_id));
  state.coverage = state.coverage.filter((row) => !integrationIds.includes(row.integration_id));
  state.servers = state.servers.filter((row) => row.product_name !== componentName);
  state.serverIntegrations = state.serverIntegrations.filter(
    (row) => !serversToDelete.includes(row.from_server) && !serversToDelete.includes(row.to_server)
  );
  state.selectedComponentName = "";
  state.selectedIntegrationId = "";
  state.editorMode = "";
  state.detailModalOpen = false;
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
  render();
}

function resetSelectedComponentPosition() {
  if (!state.selectedComponentName) return;
  state.components = state.components.map((row) =>
    row.component_name === state.selectedComponentName
      ? {
          ...row,
          pos_x: "",
          pos_y: "",
        }
      : row
  );
  persistState();
  render();
}

function saveIntegrationEdits(event) {
  event.preventDefault();
  const integrationId = state.selectedIntegrationId;
  if (!integrationId) return;
  const formData = new FormData(event.currentTarget);
  state.integrations = state.integrations.map((row) =>
    row.integration_id === integrationId
      ? {
          ...row,
            from_component: String(formData.get("from_component") || row.from_component).trim(),
            to_component: String(formData.get("to_component") || row.to_component).trim(),
            flow_direction: normalizeFlowDirection(formData.get("flow_direction") || row.flow_direction),
            integration_type: String(formData.get("integration_type") || row.integration_type).trim(),
            business_scenario: String(formData.get("business_scenario") || "").trim(),
          purpose: String(formData.get("purpose") || "").trim(),
          protocol: String(formData.get("protocol") || "").trim(),
          port: String(formData.get("port") || "").trim(),
          criticality: String(formData.get("criticality") || row.criticality).trim(),
          lifecycle_stage: String(formData.get("lifecycle_stage") || row.lifecycle_stage).trim(),
          owner: String(formData.get("owner") || "").trim(),
          consumer_team: String(formData.get("consumer_team") || "").trim(),
          provider_team: String(formData.get("provider_team") || "").trim(),
          observability_point: String(formData.get("observability_point") || "").trim(),
          last_tested_at: String(formData.get("last_tested_at") || "").trim(),
          diagram_default: String(formData.get("diagram_default") || getDiagramDefault(row)).trim(),
          notes: String(formData.get("notes") || "").trim(),
        }
      : row
  );
  state.detailModalOpen = true;
  persistState();
  render();
}

function deleteSelectedIntegration() {
  const integrationId = state.selectedIntegrationId;
  if (!integrationId) return;
  const coverageCount = state.coverage.filter((row) => row.integration_id === integrationId).length;
  const confirmed = window.confirm(
    [`結合点「${integrationId}」を削除します。`, `観点 ${coverageCount} 件も削除します。`, "続行しますか？"].join("\n")
  );
  if (!confirmed) return;

  state.integrations = state.integrations.filter((row) => row.integration_id !== integrationId);
  state.coverage = state.coverage.filter((row) => row.integration_id !== integrationId);
  state.selectedIntegrationId = "";
  state.detailModalOpen = false;
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
  render();
}

function saveServerEdits(event) {
  event.preventDefault();
  const previousName = state.selectedServerName;
  const formData = new FormData(event.currentTarget);
  const nextName = String(formData.get("server_name") || "").trim();
  if (!previousName || !nextName) return;
  if (nextName !== previousName && state.servers.some((row) => row.server_name === nextName)) {
    window.alert("同じサーバ名が既に存在します。");
    return;
  }

  state.servers = state.servers.map((row) =>
    row.server_name === previousName
      ? {
          ...row,
          server_name: nextName,
          product_name: String(formData.get("product_name") || row.product_name).trim(),
          server_role: String(formData.get("server_role") || "").trim(),
          domain: String(formData.get("domain") || row.domain || "Operations").trim(),
          owner: String(formData.get("owner") || "").trim(),
          description: String(formData.get("description") || "").trim(),
        }
      : row
  );
  state.serverIntegrations = state.serverIntegrations.map((row) => ({
    ...row,
    from_server: row.from_server === previousName ? nextName : row.from_server,
    to_server: row.to_server === previousName ? nextName : row.to_server,
  }));
  state.selectedServerName = nextName;
  persistState();
  render();
}

function deleteSelectedServer() {
  const serverName = state.selectedServerName;
  if (!serverName) return;
  const relatedServerIntegrationCount = state.serverIntegrations.filter(
    (row) => row.from_server === serverName || row.to_server === serverName
  ).length;
  const confirmed = window.confirm(
    [`サーバ「${serverName}」を削除します。`, `サーバ間連携 ${relatedServerIntegrationCount} 件も削除します。`, "続行しますか？"].join("\n")
  );
  if (!confirmed) return;

  state.servers = state.servers.filter((row) => row.server_name !== serverName);
  state.serverIntegrations = state.serverIntegrations.filter(
    (row) => row.from_server !== serverName && row.to_server !== serverName
  );
  state.selectedServerName = "";
  state.selectedServerIntegrationId = "";
  state.detailModalOpen = false;
  persistState();
  render();
}

function saveNewServer(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const serverName = String(formData.get("server_name") || "").trim();
  if (!serverName) return;
  if (state.servers.some((row) => row.server_name === serverName)) {
    window.alert("同じサーバ名が既に存在します。");
    return;
  }

  state.servers = [
    ...state.servers,
    {
      server_id: nextId("SRV", state.servers.map((row) => row.server_id)),
      server_name: serverName,
      product_name: String(formData.get("product_name") || "").trim(),
      server_role: String(formData.get("server_role") || "").trim(),
      domain: String(formData.get("domain") || "Operations").trim(),
      environment: "IT",
      owner: String(formData.get("owner") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      pos_x: "",
      pos_y: "",
    },
  ];
  state.selectedServerName = serverName;
  state.selectedServerIntegrationId = "";
  state.editorMode = "";
  state.detailModalOpen = true;
  persistState();
  render();
}

function cancelServerCreate() {
  state.editorMode = "";
  state.detailModalOpen = true;
  render();
}

function saveServerIntegrationEdits(event) {
  event.preventDefault();
  const integrationId = state.selectedServerIntegrationId;
  if (!integrationId) return;
  const formData = new FormData(event.currentTarget);
  state.serverIntegrations = state.serverIntegrations.map((row) =>
    row.server_integration_id === integrationId
      ? {
          ...row,
          from_server: String(formData.get("from_server") || row.from_server).trim(),
          to_server: String(formData.get("to_server") || row.to_server).trim(),
          flow_direction: normalizeFlowDirection(formData.get("flow_direction") || row.flow_direction),
          integration_type: String(formData.get("integration_type") || "").trim(),
          purpose: String(formData.get("purpose") || "").trim(),
          protocol: String(formData.get("protocol") || "").trim(),
          port: String(formData.get("port") || "").trim(),
          criticality: normalizeCriticality(formData.get("criticality") || row.criticality),
          diagram_default: normalizeDiagramDefault(formData.get("diagram_default") || row.diagram_default),
          notes: String(formData.get("notes") || "").trim(),
        }
      : row
  );
  persistState();
  render();
}

function deleteSelectedServerIntegration() {
  const integrationId = state.selectedServerIntegrationId;
  if (!integrationId) return;
  const confirmed = window.confirm(`サーバ間連携「${integrationId}」を削除します。続行しますか？`);
  if (!confirmed) return;

  state.serverIntegrations = state.serverIntegrations.filter((row) => row.server_integration_id !== integrationId);
  state.selectedServerIntegrationId = "";
  state.detailModalOpen = false;
  persistState();
  render();
}

function savePendingConnectionSettings(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  state.pendingConnectionDirection = normalizeFlowDirection(formData.get("pending_flow_direction") || state.pendingConnectionDirection);
  state.pendingConnectionDiagramDefault = normalizeDiagramDefault(formData.get("pending_diagram_default") || state.pendingConnectionDiagramDefault);
  state.detailModalOpen = true;
  render();
}

function cancelPendingConnection() {
  state.pendingConnectionFrom = "";
  state.pendingConnectionDirection = "output";
  state.pendingConnectionDiagramDefault = "core";
  state.detailModalOpen = true;
  render();
}

function exportJson() {
  const payload = JSON.stringify(
    {
      components: state.components,
      integrations: state.integrations,
      coverage: state.coverage,
      servers: state.servers,
      serverIntegrations: state.serverIntegrations,
      viewMode: state.viewMode,
    },
    null,
    2
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "infra-integration-map-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportCsvFiles() {
  downloadFile("components.csv", toCsv(state.components), "text/csv");
  window.setTimeout(() => downloadFile("integration_points.csv", toCsv(state.integrations), "text/csv"), 120);
  window.setTimeout(() => downloadFile("coverage_matrix.csv", toCsv(state.coverage), "text/csv"), 240);
  window.setTimeout(() => downloadFile("servers.csv", toCsv(state.servers), "text/csv"), 360);
  window.setTimeout(() => downloadFile("server_integration_points.csv", toCsv(state.serverIntegrations), "text/csv"), 480);
}

async function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const parsed = JSON.parse(text);
  const sanitized = sanitizeLoadedData({
    components: Array.isArray(parsed.components) ? parsed.components : [],
    integrations: Array.isArray(parsed.integrations) ? parsed.integrations : [],
    coverage: Array.isArray(parsed.coverage) ? parsed.coverage : [],
    servers: Array.isArray(parsed.servers) ? parsed.servers : parseCsv(sample.servers),
    serverIntegrations: Array.isArray(parsed.serverIntegrations) ? parsed.serverIntegrations : parseCsv(sample.serverIntegrations),
  });
  state.components = sanitized.components;
  state.integrations = sanitized.integrations;
  state.coverage = sanitized.coverage;
  state.servers = sanitized.servers;
  state.serverIntegrations = sanitized.serverIntegrations;
  state.selectedComponentName = "";
  state.selectedIntegrationId = state.integrations[0]?.integration_id || "";
  state.pendingConnectionFrom = "";
  state.pendingConnectionDirection = "output";
  state.pendingConnectionDiagramDefault = "core";
  state.editorMode = "";
  state.detailModalOpen = false;
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
  render();
  event.target.value = "";
}

async function importProposalJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state.proposalReview = buildProposalReview(parsed);
    state.proposalModalOpen = true;
    render();
  } catch (error) {
    window.alert("提案JSONを読み込めませんでした。JSON形式を確認してください。");
  } finally {
    event.target.value = "";
  }
}

function buildProposalReview(parsed) {
  const summary = parsed?.summary || {};
  const requestedProducts = Array.isArray(summary.requested_products) ? summary.requested_products : [];
  const duplicateCandidates = Array.isArray(summary.duplicate_candidates) ? summary.duplicate_candidates : [];
  const assumptions = Array.isArray(summary.assumptions) ? summary.assumptions : [];
  const reviewPoints = Array.isArray(parsed?.review_points) ? parsed.review_points : [];

  const existingComponentNames = new Set(state.components.map((row) => row.component_name));
  const existingIntegrationKeys = new Set(
    state.integrations.map((row) => getIntegrationDuplicateKey(row))
  );

  const components = (Array.isArray(parsed?.components_to_add) ? parsed.components_to_add : []).map((item, index) => {
    const componentName = String(item.component_name || "").trim();
    const domain = String(item.domain || "Operations").trim() || "Operations";
    const invalidDomain = !DOMAIN_ORDER.includes(domain);
    const duplicate = !componentName || existingComponentNames.has(componentName);
    const missingRequired = !componentName;
    const hasValidationIssue = invalidDomain;
    return {
      id: `component-${index + 1}`,
      type: "component",
      selected: !duplicate && !missingRequired && !hasValidationIssue,
      disabled: duplicate || missingRequired || hasValidationIssue,
      duplicate,
      missingRequired,
      invalidDomain,
      title: componentName || `製品 ${index + 1}`,
      description: item.description || "",
      reason: item.reason || "",
      payload: {
        component_name: componentName,
        domain,
        owner: String(item.owner || "TBD").trim() || "TBD",
        description: String(item.description || "").trim(),
      },
    };
  });

  const integrationKeyToProposalId = new Map();
  const integrations = (Array.isArray(parsed?.integrations_to_add) ? parsed.integrations_to_add : []).map((item, index) => {
    const rawFlowDirection = String(item.flow_direction || "").trim();
    const flowDirection = normalizeFlowDirection(item.flow_direction);
    const rawCriticality = String(item.criticality || "").trim();
    const rawDiagramDefault = String(item.diagram_default || "").trim();
    const payload = {
      proposal_key: String(item.integration_ref || item.proposal_key || `proposal-int-${index + 1}`).trim(),
      from_component: String(item.from_component || "").trim(),
      to_component: String(item.to_component || "").trim(),
      flow_direction: flowDirection,
      integration_type: String(item.integration_type || "未分類").trim() || "未分類",
      business_scenario: String(item.business_scenario || "").trim(),
      purpose: String(item.purpose || "").trim(),
      protocol_or_method: String(item.protocol_or_method || "TBD").trim() || "TBD",
      protocol: String(item.protocol || "TBD").trim() || "TBD",
      port: String(item.port || "TBD").trim() || "TBD",
      environment: String(item.environment || "IT").trim() || "IT",
      criticality: normalizeCriticality(item.criticality),
      owner: String(item.owner || "TBD").trim() || "TBD",
      lifecycle_stage: "設計中",
      prerequisite_integration_id: "",
      consumer_team: String(item.consumer_team || "TBD").trim() || "TBD",
      provider_team: String(item.provider_team || "TBD").trim() || "TBD",
      review_status: "Open",
      expected_evidence: "未設定",
      observability_point: String(item.observability_point || "TBD").trim() || "TBD",
      last_tested_at: "",
      failure_impact: String(item.failure_impact || "TBD").trim() || "TBD",
      diagram_default: normalizeDiagramDefault(item.diagram_default),
      notes: String(item.notes || "").trim(),
    };
    const missingRequired = !payload.from_component || !payload.to_component;
    const duplicate = missingRequired || existingIntegrationKeys.has(getIntegrationDuplicateKey(payload));
    const invalidFlowDirection = Boolean(rawFlowDirection) && !VALID_FLOW_DIRECTIONS.includes(rawFlowDirection.toLowerCase());
    const invalidCriticality = Boolean(rawCriticality) && !VALID_CRITICALITIES.includes(rawCriticality);
    const invalidDiagramDefault = Boolean(rawDiagramDefault) && !VALID_DIAGRAM_DEFAULTS.includes(rawDiagramDefault.toLowerCase());
    const hasValidationIssue = invalidFlowDirection || invalidCriticality || invalidDiagramDefault;
    const proposalId = `integration-${index + 1}`;
    integrationKeyToProposalId.set(payload.proposal_key, proposalId);
    return {
      id: proposalId,
      type: "integration",
      selected: !duplicate && !hasValidationIssue,
      disabled: duplicate || hasValidationIssue,
      duplicate,
      missingRequired,
      invalidFlowDirection,
      invalidCriticality,
      invalidDiagramDefault,
      missingComponents: false,
      title: formatIntegrationLink(payload),
      description: payload.purpose,
      reason: item.reason || "",
      payload,
    };
  });

  const enabledIntegrationIds = new Set(integrations.filter((item) => !item.disabled).map((item) => item.id));
  const coverage = (Array.isArray(parsed?.coverage_to_add) ? parsed.coverage_to_add : []).map((item, index) => {
    const integrationRef = String(item.integration_ref || "").trim();
    const parentProposalId = integrationKeyToProposalId.get(integrationRef);
    const missingParent = !parentProposalId || !enabledIntegrationIds.has(parentProposalId);
    const rawStatus = String(item.status || "").trim();
    const rawRequired = String(item.required || "Yes").trim() || "Yes";
    const invalidStatus = Boolean(rawStatus) && !STATUS_PRIORITY.includes(normalizeStatus(rawStatus));
    const invalidRequired = !["yes", "no"].includes(rawRequired.toLowerCase());
    const missingRequired = !integrationRef;
    const hasValidationIssue = invalidStatus || invalidRequired || missingRequired;
    return {
      id: `coverage-${index + 1}`,
      type: "coverage",
      selected: !missingParent && !hasValidationIssue,
      disabled: missingParent || hasValidationIssue,
      duplicate: false,
      missingParent,
      missingRequired,
      invalidStatus,
      invalidRequired,
      title: `${integrationRef || "未参照"} / ${String(item.viewpoint_code || "").trim() || `観点 ${index + 1}`}`,
      description: String(item.required_reason || "").trim(),
      reason: "",
      payload: {
        integration_ref: integrationRef,
        viewpoint_code: String(item.viewpoint_code || "").trim() || `VP${index + 1}`,
        viewpoint_name: String(item.viewpoint_name || "").trim() || "新規観点",
        required: String(item.required || "Yes").trim() || "Yes",
        required_reason: String(item.required_reason || "").trim(),
        status: normalizeStatus(item.status || "PLANNED"),
        test_case_id: "",
        test_depth: String(item.test_depth || "Normal").trim() || "Normal",
        evidence_required: String(item.evidence_required || "Yes").trim() || "Yes",
        evidence_id: "",
        evidence_status: "未取得",
        observability_point: String(item.observability_point || "TBD").trim() || "TBD",
        last_tested_at: "",
        defect_id: "",
        owner: String(item.owner || "TBD").trim() || "TBD",
        remarks: String(item.remarks || "").trim(),
      },
    };
  });

  return {
    requestedProducts,
    duplicateCandidates,
    assumptions,
    reviewPoints,
    items: {
      components,
      integrations,
      coverage,
    },
  };
}

function normalizeCriticality(value) {
  const text = String(value || "").trim();
  return VALID_CRITICALITIES.includes(text) ? text : "Medium";
}

function normalizeDiagramDefault(value) {
  const text = String(value || "").trim().toLowerCase();
  return text === "secondary" ? "secondary" : "core";
}

function exportProposalTemplate() {
  const content = JSON.stringify(buildProposalTemplate(), null, 2);
  downloadFile("proposal-template.json", `${content}\r\n`, "application/json");
}

function buildProposalTemplate() {
  const existingNames = state.components.map((row) => row.component_name).filter(Boolean).sort((a, b) => a.localeCompare(b, "ja"));
  const exampleFrom = existingNames[0] || "Active Directory";
  const exampleTo = existingNames[1] || "新規製品名";
  return {
    summary: {
      requested_products: [""],
      duplicate_candidates: [],
      assumptions: [
        "未確定の値は TBD または空欄で残し、レビューで補完する",
        "flow_direction は input / output / bidirectional のいずれかを指定する",
      ],
    },
    components_to_add: [
      {
        component_name: "",
        domain: "Identity",
        owner: "TBD",
        description: "",
        reason: "新製品追加の理由を記載",
      },
    ],
    integrations_to_add: [
      {
        proposal_key: "NEW-INT-001",
        from_component: exampleFrom,
        to_component: exampleTo,
        flow_direction: "output",
        integration_type: "",
        business_scenario: "",
        purpose: "",
        protocol_or_method: "TBD",
        protocol: "TBD",
        port: "TBD",
        environment: "IT",
        criticality: "Medium",
        owner: "TBD",
        consumer_team: "TBD",
        provider_team: "TBD",
        observability_point: "TBD",
        failure_impact: "TBD",
        diagram_default: "core",
        notes: "",
        reason: "連携追加の理由を記載",
      },
    ],
    coverage_to_add: [
      {
        integration_ref: "NEW-INT-001",
        viewpoint_code: "NET",
        viewpoint_name: "通信",
        required: "Yes",
        required_reason: "",
        status: "PLANNED",
        test_depth: "Normal",
        evidence_required: "Yes",
        owner: "TBD",
        observability_point: "TBD",
        remarks: "",
      },
    ],
    review_points: [
      "domain は既存カテゴリから選ぶ",
      "製品名は画面上の表記と完全一致させる",
      "criticality と diagram_default は図示よりレビュー優先で決める",
    ],
  };
}

function getIntegrationDuplicateKey(row) {
  return [
    String(row.from_component || "").trim(),
    String(row.to_component || "").trim(),
    normalizeFlowDirection(row.flow_direction),
    String(row.integration_type || "").trim(),
  ].join("|");
}

function renderProposalModalState() {
  const shouldOpen = state.proposalModalOpen && Boolean(state.proposalReview);
  elements.proposalModal.classList.toggle("is-open", shouldOpen);
  elements.proposalModal.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
  if (!shouldOpen) {
    return;
  }
  renderProposalReview();
}

function renderProposalReview() {
  const review = state.proposalReview;
  if (!review) {
    elements.proposalSummary.innerHTML = "";
    elements.proposalReview.innerHTML = "";
    return;
  }
  recalculateProposalDependencies();
  const itemGroups = review.items;
  const total = itemGroups.components.length + itemGroups.integrations.length + itemGroups.coverage.length;
  const selected = [...itemGroups.components, ...itemGroups.integrations, ...itemGroups.coverage].filter((item) => item.selected && !item.disabled).length;
  elements.proposalSummary.innerHTML = `
    <div class="detail-block">
      <div class="detail-label">対象製品</div>
      <div>${escapeHtml(review.requestedProducts.join(" / ") || "未指定")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">レビュー件数</div>
      <div>${escapeHtml(String(total))} 件中 ${escapeHtml(String(selected))} 件を反映予定</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">重複候補</div>
      <div>${escapeHtml(review.duplicateCandidates.join(" / ") || "なし")}</div>
    </div>
  `;
  elements.proposalReview.innerHTML = [
    renderProposalSection("製品追加", itemGroups.components),
    renderProposalSection("連携追加", itemGroups.integrations),
    renderProposalSection("観点追加", itemGroups.coverage),
    renderProposalNotes(review.assumptions, review.reviewPoints),
  ].join("");
  bindProposalReviewEvents();
}

function renderProposalSection(title, items) {
  if (!items.length) {
    return `
      <section class="proposal-section">
        <div class="panel-title"><h3>${escapeHtml(title)}</h3></div>
        <p class="empty-state">提案はありません。</p>
      </section>
    `;
  }
  return `
    <section class="proposal-section">
      <div class="panel-title"><h3>${escapeHtml(title)}</h3></div>
      <div class="proposal-list">
        ${items
          .map(
            (item) => `
              <label class="proposal-item ${item.disabled ? "is-disabled" : ""}">
                <input type="checkbox" data-proposal-item-id="${escapeHtml(item.id)}"${item.selected ? " checked" : ""}${item.disabled ? " disabled" : ""} />
                <div class="proposal-item-body">
                  <div class="proposal-item-title">${escapeHtml(item.title)}</div>
                  <div class="proposal-item-meta">
                    ${item.duplicate ? '<span class="chip chip-hold">重複候補</span>' : ""}
                    ${item.missingRequired ? '<span class="chip chip-hold">必須不足</span>' : ""}
                    ${item.invalidDomain ? '<span class="chip chip-hold">カテゴリ不正</span>' : ""}
                    ${item.invalidFlowDirection ? '<span class="chip chip-hold">方向不正</span>' : ""}
                    ${item.invalidCriticality ? '<span class="chip chip-hold">重要度不正</span>' : ""}
                    ${item.invalidDiagramDefault ? '<span class="chip chip-hold">主補不正</span>' : ""}
                    ${item.invalidStatus ? '<span class="chip chip-hold">進捗不正</span>' : ""}
                    ${item.invalidRequired ? '<span class="chip chip-hold">required不正</span>' : ""}
                    ${item.missingComponents ? '<span class="chip chip-hold">製品未選択</span>' : ""}
                    ${item.missingParent ? '<span class="chip chip-hold">参照連携なし</span>' : ""}
                  </div>
                  <div>${escapeHtml(item.description || "")}</div>
                  ${item.reason ? `<div class="empty-state">理由: ${escapeHtml(item.reason)}</div>` : ""}
                </div>
              </label>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderProposalNotes(assumptions, reviewPoints) {
  return `
    <section class="proposal-section">
      <div class="panel-title"><h3>前提と確認点</h3></div>
      <div class="detail-block">
        <div class="detail-label">LLM前提</div>
        <div>${assumptions.length ? assumptions.map((item) => escapeHtml(item)).join("<br>") : "なし"}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">レビュー観点</div>
        <div>${reviewPoints.length ? reviewPoints.map((item) => escapeHtml(item)).join("<br>") : "なし"}</div>
      </div>
    </section>
  `;
}

function bindProposalReviewEvents() {
  elements.proposalReview.querySelectorAll("[data-proposal-item-id]").forEach((input) => {
    input.addEventListener("change", () => {
      setProposalItemSelected(input.dataset.proposalItemId, input.checked);
    });
  });
}

function setProposalItemSelected(itemId, selected) {
  if (!state.proposalReview) return;
  for (const groupName of ["components", "integrations", "coverage"]) {
    const group = state.proposalReview.items[groupName];
    const target = group.find((item) => item.id === itemId);
    if (target && !target.disabled) {
      target.selected = selected;
      renderProposalReview();
      return;
    }
  }
}

function toggleAllProposalSelections(selected) {
  if (!state.proposalReview) return;
  ["components", "integrations", "coverage"].forEach((groupName) => {
    state.proposalReview.items[groupName].forEach((item) => {
      if (!item.disabled) {
        item.selected = selected;
      }
    });
  });
  renderProposalReview();
}

function recalculateProposalDependencies() {
  const review = state.proposalReview;
  if (!review) return;
  const selectedComponentNames = new Set([
    ...state.components.map((row) => row.component_name),
    ...review.items.components.filter((item) => item.selected && !item.duplicate).map((item) => item.payload.component_name),
  ]);
  review.items.integrations.forEach((item) => {
    item.missingComponents =
      !selectedComponentNames.has(item.payload.from_component) || !selectedComponentNames.has(item.payload.to_component);
    item.disabled =
      item.duplicate ||
      item.missingRequired ||
      item.missingComponents ||
      item.invalidFlowDirection ||
      item.invalidCriticality ||
      item.invalidDiagramDefault;
    if (item.disabled) {
      item.selected = false;
    }
  });
  const selectedIntegrationRefs = new Set(
    review.items.integrations.filter((item) => item.selected && !item.disabled).map((item) => item.payload.proposal_key)
  );
  review.items.coverage.forEach((item) => {
    item.missingParent = !selectedIntegrationRefs.has(item.payload.integration_ref);
    item.disabled = item.missingParent || item.missingRequired || item.invalidStatus || item.invalidRequired;
    if (item.disabled) {
      item.selected = false;
    }
  });
}

function applyProposalSelections() {
  const review = state.proposalReview;
  if (!review) return;

  const selectedComponents = review.items.components.filter((item) => item.selected && !item.disabled);
  const selectedIntegrations = review.items.integrations.filter((item) => item.selected && !item.disabled);
  const selectedCoverage = review.items.coverage.filter((item) => item.selected && !item.disabled);

  let nextComponentNumber = state.components.map((row) => row.component_id);
  const materializedComponents = selectedComponents.map((item) => {
    const component = {
      component_id: nextId("CMP", nextComponentNumber),
      ...item.payload,
    };
    nextComponentNumber = [...nextComponentNumber, component.component_id];
    return component;
  });
  state.components = [...state.components, ...materializedComponents];

  let integrationIds = state.integrations.map((row) => row.integration_id);
  const integrationRefMap = new Map();
  const materializedIntegrations = selectedIntegrations.map((item) => {
    const integrationId = nextId("INT", integrationIds);
    integrationIds = [...integrationIds, integrationId];
    integrationRefMap.set(item.payload.proposal_key, integrationId);
    const { proposal_key, ...integrationPayload } = item.payload;
    return {
      integration_id: integrationId,
      ...integrationPayload,
    };
  });
  state.integrations = [...state.integrations, ...materializedIntegrations];

  const materializedCoverage = selectedCoverage
    .map((item) => {
      const integrationId = integrationRefMap.get(item.payload.integration_ref);
      if (!integrationId) return null;
      return {
        integration_id: integrationId,
        viewpoint_code: item.payload.viewpoint_code,
        viewpoint_name: item.payload.viewpoint_name,
        required: item.payload.required,
        required_reason: item.payload.required_reason,
        status: item.payload.status,
        test_case_id: item.payload.test_case_id,
        test_depth: item.payload.test_depth,
        evidence_required: item.payload.evidence_required,
        evidence_id: item.payload.evidence_id,
        evidence_status: item.payload.evidence_status,
        observability_point: item.payload.observability_point,
        last_tested_at: item.payload.last_tested_at,
        defect_id: item.payload.defect_id,
        owner: item.payload.owner,
        remarks: item.payload.remarks,
      };
    })
    .filter(Boolean);
  state.coverage = [...state.coverage, ...materializedCoverage];

  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  state.proposalReview = null;
  state.proposalModalOpen = false;
  state.selectedComponentName = materializedComponents[0]?.component_name || state.selectedComponentName;
  state.selectedIntegrationId = materializedIntegrations[0]?.integration_id || state.selectedIntegrationId;
  persistState();
  render();
}

function closeProposalModal() {
  state.proposalModalOpen = false;
  render();
}

function createIntegrationBetween(fromComponent, toComponent, flowDirection = "output", diagramDefault = "core") {
  const integrationId = nextId("INT", state.integrations.map((row) => row.integration_id));
  const integration = {
      integration_id: integrationId,
      from_component: fromComponent,
      to_component: toComponent,
      flow_direction: normalizeFlowDirection(flowDirection),
      integration_type: "未分類",
    business_scenario: `${fromComponent} と ${toComponent} の仮連携`,
    purpose: "GUIで追加した仮連携",
    protocol_or_method: "TBD",
    protocol: "TCP",
    port: "443",
    environment: "IT",
    criticality: "Medium",
    owner: inferOwner(fromComponent, toComponent),
    lifecycle_stage: "設計中",
    prerequisite_integration_id: "",
    consumer_team: inferOwner(fromComponent, ""),
    provider_team: inferOwner("", toComponent),
    review_status: "Open",
    expected_evidence: "未設定",
    observability_point: "未設定",
    last_tested_at: "",
    failure_impact: "未設定",
    diagram_default: normalizeDiagramDefault(diagramDefault),
    notes: "GUIで追加した連携",
  };
  state.integrations = [...state.integrations, integration];
  state.coverage = [...state.coverage, ...createDefaultCoverageRows(integrationId, integration.owner)];
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  persistState();
}

function createServerIntegrationBetween(fromServer, toServer, flowDirection = "output", diagramDefault = "core") {
  const integrationId = nextId("SINT", state.serverIntegrations.map((row) => row.server_integration_id));
  const fromRow = state.servers.find((row) => row.server_name === fromServer);
  const toRow = state.servers.find((row) => row.server_name === toServer);
  const integration = {
    server_integration_id: integrationId,
    from_server: fromServer,
    to_server: toServer,
    flow_direction: normalizeFlowDirection(flowDirection),
    integration_type: "未分類",
    purpose: `${fromServer} と ${toServer} の仮連携`,
    protocol: "TCP",
    port: "443",
    criticality: "Medium",
    diagram_default: normalizeDiagramDefault(diagramDefault),
    notes: `GUIで追加した仮連携 (${fromRow?.product_name || ""} -> ${toRow?.product_name || ""})`.trim(),
  };
  state.serverIntegrations = [...state.serverIntegrations, integration];
  persistState();
}

function addCoverageRowToSelectedIntegration() {
  if (!state.selectedIntegrationId) return;
  const integration = state.integrations.find((row) => row.integration_id === state.selectedIntegrationId);
  state.coverage = [...state.coverage, createCoverageRow(state.selectedIntegrationId, nextCoverageCode(), "新規観点", integration?.owner || "", "GUIで追加した観点")];
  persistState();
  render();
}

function saveCoverageEdits(event) {
  event.preventDefault();
  if (!state.selectedIntegrationId) return;
  const formData = new FormData(event.currentTarget);
  const coverageRows = state.coverage.filter((row) => row.integration_id === state.selectedIntegrationId);
  const updatedRows = coverageRows.map((row, index) => ({
    ...row,
    viewpoint_code: String(formData.get(`viewpoint_code_${index}`) || row.viewpoint_code).trim(),
    viewpoint_name: String(formData.get(`viewpoint_name_${index}`) || row.viewpoint_name).trim(),
    required: String(formData.get(`required_${index}`) || row.required).trim(),
    status: String(formData.get(`status_${index}`) || row.status).trim(),
    test_depth: String(formData.get(`test_depth_${index}`) || row.test_depth).trim(),
    owner: String(formData.get(`owner_${index}`) || row.owner).trim(),
    test_case_id: String(formData.get(`test_case_id_${index}`) || row.test_case_id).trim(),
    evidence_required: String(formData.get(`evidence_required_${index}`) || row.evidence_required).trim(),
    evidence_id: String(formData.get(`evidence_id_${index}`) || row.evidence_id).trim(),
    evidence_status: String(formData.get(`evidence_status_${index}`) || row.evidence_status).trim(),
    last_tested_at: String(formData.get(`last_tested_at_${index}`) || row.last_tested_at).trim(),
    defect_id: String(formData.get(`defect_id_${index}`) || row.defect_id).trim(),
    required_reason: String(formData.get(`required_reason_${index}`) || row.required_reason).trim(),
    observability_point: String(formData.get(`observability_point_${index}`) || row.observability_point).trim(),
    remarks: String(formData.get(`remarks_${index}`) || row.remarks).trim(),
  }));

  let updateIndex = 0;
  state.coverage = state.coverage.map((row) => {
    if (row.integration_id !== state.selectedIntegrationId) {
      return row;
    }
    const nextRow = updatedRows[updateIndex];
    updateIndex += 1;
    return nextRow;
  });
  persistState();
  render();
}

function deleteCoverageRowAt(indexToDelete) {
  if (!state.selectedIntegrationId) return;
  let currentIndex = -1;
  state.coverage = state.coverage.filter((row) => {
    if (row.integration_id !== state.selectedIntegrationId) {
      return true;
    }
    currentIndex += 1;
    return currentIndex !== indexToDelete;
  });
  persistState();
  render();
}

function createDefaultCoverageRows(integrationId, owner) {
  return [
    createCoverageRow(integrationId, "NET", "通信", owner, "接続性を確認する"),
    createCoverageRow(integrationId, "DATA", "データ連携", owner, "基本データ連携を確認する"),
    createCoverageRow(integrationId, "OPS", "運用", owner, "運用時の確認手順を整理する"),
  ];
}

function createCoverageRow(integrationId, viewpointCode, viewpointName, owner, reason) {
  return {
    integration_id: integrationId,
    viewpoint_code: viewpointCode,
    viewpoint_name: viewpointName,
    required: "Yes",
    required_reason: reason,
    status: "PLANNED",
    test_case_id: "",
    test_depth: "Normal",
    evidence_required: "Yes",
    evidence_id: "",
    evidence_status: "未取得",
    observability_point: "未設定",
    last_tested_at: "",
    defect_id: "",
    owner,
    remarks: "",
  };
}

function nextCoverageCode() {
  const used = new Set(
    state.coverage.filter((row) => row.integration_id === state.selectedIntegrationId).map((row) => row.viewpoint_code)
  );
  const fallback = ["AUTH", "AUTHZ", "CFG", "DATA", "MON", "NET", "OPS", "FAIL", "PERF", "SEC"];
  const available = fallback.find((code) => !used.has(code));
  return available || `VP${state.coverage.length + 1}`;
}

function nextId(prefix, values) {
  const max = values.reduce((current, value) => {
    const match = String(value || "").match(/(\d+)$/);
    return Math.max(current, match ? Number(match[1]) : 0);
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  });
  return lines.join("\r\n");
}

function csvEscape(value) {
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function inferOwner(fromComponent, toComponent) {
  return (
    state.components.find((row) => row.component_name === fromComponent)?.owner ||
    state.components.find((row) => row.component_name === toComponent)?.owner ||
    ""
  );
}

function sanitizeLoadedData(data) {
  const components = (Array.isArray(data.components) ? data.components : []).filter(
    (row) => !REMOVED_COMPONENT_NAMES.has(String(row.component_name || "").trim())
  );
  const validComponentNames = new Set(components.map((row) => String(row.component_name || "").trim()).filter(Boolean));
  const removedIntegrationIds = new Set();
  const integrations = (Array.isArray(data.integrations) ? data.integrations : [])
    .filter((row) => {
      const fromName = String(row.from_component || "").trim();
      const toName = String(row.to_component || "").trim();
      const keep = validComponentNames.has(fromName) && validComponentNames.has(toName);
      if (!keep && row.integration_id) {
        removedIntegrationIds.add(String(row.integration_id).trim());
      }
      return keep;
    })
    .map((row) => ({
      ...row,
      prerequisite_integration_id: removedIntegrationIds.has(String(row.prerequisite_integration_id || "").trim())
        ? ""
        : row.prerequisite_integration_id,
    }));
  const validIntegrationIds = new Set(integrations.map((row) => String(row.integration_id || "").trim()).filter(Boolean));
  const coverage = (Array.isArray(data.coverage) ? data.coverage : []).filter((row) =>
    validIntegrationIds.has(String(row.integration_id || "").trim())
  );
  const servers = (Array.isArray(data.servers) ? data.servers : []).filter((row) =>
    validComponentNames.has(String(row.product_name || "").trim())
  );
  const validServerNames = new Set(servers.map((row) => String(row.server_name || "").trim()).filter(Boolean));
  const serverIntegrations = (Array.isArray(data.serverIntegrations) ? data.serverIntegrations : []).filter((row) =>
    validServerNames.has(String(row.from_server || "").trim()) && validServerNames.has(String(row.to_server || "").trim())
  );
  return { components, integrations, coverage, servers, serverIntegrations };
}

function isLegacyServerSample(servers, serverIntegrations) {
  const legacyNames = new Set(["Splunk SearchHead", "Splunk IndexServer", "Splunk DeploymentServer"]);
  return (
    Array.isArray(servers) &&
    Array.isArray(serverIntegrations) &&
    servers.length > 0 &&
    servers.length <= 3 &&
    serverIntegrations.length <= 3 &&
    servers.every((row) => legacyNames.has(String(row.server_name || "").trim()))
  );
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.components) || !Array.isArray(parsed.integrations) || !Array.isArray(parsed.coverage)) {
      return false;
    }
    const sanitized = sanitizeLoadedData({
      components: parsed.components,
      integrations: parsed.integrations,
      coverage: parsed.coverage,
      servers: Array.isArray(parsed.servers) ? parsed.servers : parseCsv(sample.servers),
      serverIntegrations: Array.isArray(parsed.serverIntegrations) ? parsed.serverIntegrations : parseCsv(sample.serverIntegrations),
    });
    const serverDefaultData = isLegacyServerSample(sanitized.servers, sanitized.serverIntegrations)
      ? sanitizeLoadedData({
          components: sanitized.components,
          integrations: sanitized.integrations,
          coverage: sanitized.coverage,
          servers: parseCsv(sample.servers),
          serverIntegrations: parseCsv(sample.serverIntegrations),
        })
      : sanitized;
      state = {
        ...state,
        components: sanitized.components,
        integrations: sanitized.integrations,
        coverage: sanitized.coverage,
        servers: serverDefaultData.servers,
        serverIntegrations: serverDefaultData.serverIntegrations,
        viewMode: parsed.viewMode === "server" ? "server" : "product",
        proposalReview: null,
        proposalModalOpen: false,
        selectedIntegrationId: sanitized.integrations[0]?.integration_id || "",
      selectedComponentName: "",
      editMode: false,
    pendingConnectionFrom: "",
    pendingConnectionDirection: "output",
    pendingConnectionDiagramDefault: "core",
    editorMode: "",
      detailModalOpen: false,
    };
    return true;
  } catch (error) {
    return false;
  }
}

function persistState() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        components: state.components,
        integrations: state.integrations,
        coverage: state.coverage,
        servers: state.servers,
        serverIntegrations: state.serverIntegrations,
        viewMode: state.viewMode,
      })
    );
  } catch (error) {
    // Ignore storage failures and continue with in-memory state.
  }
}

function renderDetailModalState() {
  const shouldOpen =
    !state.pendingConnectionFrom &&
    state.detailModalOpen &&
    Boolean(
      state.selectedComponentName ||
        state.selectedIntegrationId ||
        state.selectedServerName ||
        state.selectedServerIntegrationId ||
        state.editorMode
    );
  elements.detailModal.classList.toggle("is-open", shouldOpen);
  elements.detailModal.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
}

function closeDetailModal() {
  if (state.pendingConnectionFrom) {
    state.pendingConnectionFrom = "";
    state.pendingConnectionDirection = "output";
    state.pendingConnectionDiagramDefault = "core";
  }
  state.detailModalOpen = false;
  render();
}

function handleWindowKeydown(event) {
  if (event.key === "Escape" && state.proposalModalOpen) {
    closeProposalModal();
    return;
  }
  if (event.key === "Escape" && state.detailModalOpen) {
    closeDetailModal();
  }
}

function getNodeMetrics(name) {
  const width = Math.max(144, Math.min(220, 34 + String(name || "").length * 8));
  return {
    width,
    halfWidth: width / 2,
    height: 56,
    halfHeight: 28,
  };
}

function getNodeGuard(position, metrics, padding) {
  return {
    left: position.x - metrics.halfWidth - padding,
    right: position.x + metrics.halfWidth + padding,
    top: position.y - metrics.halfHeight - padding,
    bottom: position.y + metrics.halfHeight + padding,
  };
}

function buildFixedSourceRoutePlans(rows, positions, nodeMetrics, getId, getFromName, getToName) {
  const routePlans = rows.map((row, index) => {
    const id = getId(row);
    const fromName = getFromName(row);
    const toName = getToName(row);
    const from = positions.get(fromName);
    const to = positions.get(toName);
    const fromMetrics = nodeMetrics.get(fromName);
    const toMetrics = nodeMetrics.get(toName);
    if (!id || !from || !to || !fromMetrics || !toMetrics) return null;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const sourceDirection = dx >= 0 ? 1 : -1;
    const targetSide = pickNearestTargetSide(from, to, fromMetrics, toMetrics, sourceDirection);
    return {
      id,
      row,
      index,
      fromName,
      toName,
      from,
      to,
      fromMetrics,
      toMetrics,
      sourceDirection,
      fromSide: sourceDirection > 0 ? "right" : "left",
      toSide: targetSide,
      targetDirection: targetSide === "right" || targetSide === "bottom" ? 1 : -1,
      targetOrientation: targetSide === "left" || targetSide === "right" ? "horizontal" : "vertical",
      sortDistance: Math.abs(dx) + Math.abs(dy),
    };
  });

  const endpointGroups = new Map();
  routePlans.forEach((plan) => {
    if (!plan) return;
    const fromKey = `${plan.fromName}:${plan.fromSide}`;
    const toKey = `${plan.toName}:${plan.toSide}`;
    if (!endpointGroups.has(fromKey)) endpointGroups.set(fromKey, []);
    if (!endpointGroups.has(toKey)) endpointGroups.set(toKey, []);
    endpointGroups.get(fromKey).push({ plan, anchor: "from", peerX: plan.to.x, peerY: plan.to.y });
    endpointGroups.get(toKey).push({ plan, anchor: "to", peerX: plan.from.x, peerY: plan.from.y });
  });

  const endpointOffsets = new Map();
  endpointGroups.forEach((items, groupKey) => {
    const side = groupKey.split(":").at(-1);
    const axis = side === "left" || side === "right" ? "peerY" : "peerX";
    items
      .sort((a, b) => a[axis] - b[axis] || a.peerX - b.peerX || a.peerY - b.peerY || a.plan.id.localeCompare(b.plan.id, "ja"))
      .forEach((item, itemIndex) => {
        endpointOffsets.set(`${item.plan.id}:${item.anchor}`, (itemIndex - (items.length - 1) / 2) * 12);
      });
  });

  const occupiedHorizontalLanes = [];
  const occupiedVerticalLanes = [];
  routePlans
    .filter(Boolean)
    .sort((a, b) => b.sortDistance - a.sortDistance || a.index - b.index)
    .forEach((plan) => {
      const sourceOffset = endpointOffsets.get(`${plan.id}:from`) || 0;
      const targetOffset = endpointOffsets.get(`${plan.id}:to`) || 0;
      const startX = plan.from.x + plan.fromMetrics.halfWidth * plan.sourceDirection;
      const startY = plan.from.y + sourceOffset;
      const sourceStubX = startX + plan.sourceDirection * 22;
      const sourceGuard = getNodeGuard(plan.from, plan.fromMetrics, 22);
      const targetGuard = getNodeGuard(plan.to, plan.toMetrics, 22);

      if (plan.targetOrientation === "horizontal") {
        const targetDirection = plan.toSide === "right" ? 1 : -1;
        const endX = plan.to.x + plan.toMetrics.halfWidth * targetDirection;
        const endY = plan.to.y + targetOffset;
        const baseLaneX = (sourceStubX + endX) / 2 + plan.sourceDirection * 24;
        const topY = Math.min(startY, endY) - 18;
        const bottomY = Math.max(startY, endY) + 18;
        const laneX = pickVerticalLane(baseLaneX, topY, bottomY, sourceGuard, targetGuard, plan.fromSide, plan.toSide, occupiedVerticalLanes);
        occupiedVerticalLanes.push({ lane: laneX, rangeStart: topY, rangeEnd: bottomY });
        plan.labelX = laneX;
        plan.labelY = topY + (bottomY - topY) / 2 - 10;
        plan.pathData = [
          `M ${startX} ${startY}`,
          `L ${sourceStubX} ${startY}`,
          `L ${laneX} ${startY}`,
          `L ${laneX} ${endY}`,
          `L ${endX + targetDirection * 18} ${endY}`,
          `L ${endX} ${endY}`,
        ].join(" ");
        return;
      }

      const targetDirection = plan.toSide === "bottom" ? 1 : -1;
      const endX = plan.to.x + targetOffset;
      const endY = plan.to.y + plan.toMetrics.halfHeight * targetDirection;
      const baseLaneY = endY + targetDirection * (42 + (plan.index % 3) * 18);
      const leftX = Math.min(sourceStubX, endX) - 18;
      const rightX = Math.max(sourceStubX, endX) + 18;
      const laneY = pickHorizontalLane(baseLaneY, leftX, rightX, targetGuard, plan.toSide, occupiedHorizontalLanes);
      occupiedHorizontalLanes.push({ lane: laneY, rangeStart: leftX, rangeEnd: rightX });
      plan.labelX = leftX + (rightX - leftX) / 2;
      plan.labelY = laneY - 10;
      plan.pathData = [
        `M ${startX} ${startY}`,
        `L ${sourceStubX} ${startY}`,
        `L ${sourceStubX} ${laneY}`,
        `L ${endX} ${laneY}`,
        `L ${endX} ${endY + targetDirection * 18}`,
        `L ${endX} ${endY}`,
      ].join(" ");
    });

  return routePlans;
}

function pickNearestTargetSide(from, to, fromMetrics, toMetrics, sourceDirection) {
  const source = {
    x: from.x + fromMetrics.halfWidth * sourceDirection + sourceDirection * 22,
    y: from.y,
  };
  const left = to.x - toMetrics.halfWidth;
  const right = to.x + toMetrics.halfWidth;
  const top = to.y - toMetrics.halfHeight;
  const bottom = to.y + toMetrics.halfHeight;
  const verticalMiss = source.y < top ? top - source.y : source.y > bottom ? source.y - bottom : 0;
  if (source.x <= left && verticalMiss <= 36) {
    return "left";
  }
  if (source.x >= right && verticalMiss <= 36) {
    return "right";
  }
  const candidates = [
    { side: "left", x: left, y: clamp(source.y, top, bottom) },
    { side: "right", x: right, y: clamp(source.y, top, bottom) },
    { side: "top", x: clamp(source.x, left, right), y: top },
    { side: "bottom", x: clamp(source.x, left, right), y: bottom },
  ];
  return candidates
    .map((candidate) => ({
      ...candidate,
      distance: Math.abs(source.x - candidate.x) + Math.abs(source.y - candidate.y) + targetSidePenalty(candidate.side, from, to),
    }))
    .sort((a, b) => a.distance - b.distance || targetSidePriority(a.side) - targetSidePriority(b.side))[0].side;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function targetSidePenalty(side, from, to) {
  if (side === "top" && from.y > to.y) return 18;
  if (side === "bottom" && from.y < to.y) return 18;
  if (side === "left" && from.x > to.x) return 18;
  if (side === "right" && from.x < to.x) return 18;
  return 0;
}

function targetSidePriority(side) {
  return { bottom: 0, top: 1, left: 2, right: 3 }[side] ?? 4;
}

function pickVerticalLane(baseLaneX, topY, bottomY, sourceGuard, targetGuard, fromSide, toSide, occupiedVerticalLanes) {
  const candidateOffsets = [0, 24, -24, 48, -48, 72, -72, 96, -96];
  const outsideSource = fromSide === "left"
    ? (candidateLaneX) => candidateLaneX < sourceGuard.left
    : (candidateLaneX) => candidateLaneX > sourceGuard.right;
  const outsideTarget = toSide === "left"
    ? (candidateLaneX) => candidateLaneX < targetGuard.left
    : (candidateLaneX) => candidateLaneX > targetGuard.right;

  for (const candidateOffset of candidateOffsets) {
    const laneX = baseLaneX + candidateOffset;
    const collision = occupiedVerticalLanes.some(
      (lane) => Math.abs(lane.lane - laneX) < 18 && !(bottomY < lane.rangeStart || topY > lane.rangeEnd)
    );
    if (!collision && outsideSource(laneX) && outsideTarget(laneX)) {
      return laneX;
    }
  }

  if (fromSide === "right" || toSide === "right") {
    return Math.max(sourceGuard.right, targetGuard.right) + 24;
  }
  return Math.min(sourceGuard.left, targetGuard.left) - 24;
}

function pickHorizontalLane(baseLaneY, leftX, rightX, targetGuard, toSide, occupiedHorizontalLanes) {
  const candidateOffsets = [0, 24, -24, 48, -48, 72, -72, 96, -96];
  const outsideTarget = toSide === "top"
    ? (candidateLaneY) => candidateLaneY < targetGuard.top
    : (candidateLaneY) => candidateLaneY > targetGuard.bottom;

  for (const candidateOffset of candidateOffsets) {
    const laneY = baseLaneY + candidateOffset;
    const collision = occupiedHorizontalLanes.some(
      (lane) => Math.abs(lane.lane - laneY) < 18 && !(rightX < lane.rangeStart || leftX > lane.rangeEnd)
    );
    if (!collision && outsideTarget(laneY)) {
      return laneY;
    }
  }

  return toSide === "top" ? targetGuard.top - 24 : targetGuard.bottom + 24;
}

function getDiagramDefault(integration) {
  const explicit = String(integration.diagram_default || "").trim().toLowerCase();
  if (explicit === "core" || explicit === "secondary") {
    return explicit;
  }
  return inferDiagramDefault(integration);
}

function inferDiagramDefault(integration) {
  const values = [
    integration.from_component,
    integration.to_component,
    integration.integration_type,
    integration.business_scenario,
    integration.purpose,
    integration.protocol_or_method,
    integration.observability_point,
    integration.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const touchesSplunk = values.includes("splunk");
  const looksLikeLogFlow = ["syslog", "log", "ログ", "monitor", "監視", "alert", "アラート", "event", "イベント"].some((token) =>
    values.includes(token)
  );
  return touchesSplunk && looksLikeLogFlow ? "secondary" : "core";
}

function renderSelectOptions(values, selectedValue) {
  return values
    .map((value) => `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(value)}</option>`)
    .join("");
}

function renderFlowDirectionOptions(selectedValue) {
  return [
    ["output", "出力"],
    ["input", "入力"],
    ["bidirectional", "相互連携"],
  ]
    .map(
      ([value, label]) =>
        `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`
    )
    .join("");
}

function getDomainOptions() {
  return Array.from(new Set([...DOMAIN_ORDER, ...state.components.map((row) => row.domain).filter(Boolean)]));
}

function compareComponentsForLayout(a, b) {
  const domainDiff = DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain);
  if (domainDiff !== 0) {
    return domainDiff;
  }
  const integrationDiff = countRelatedIntegrations(b.component_name) - countRelatedIntegrations(a.component_name);
  if (integrationDiff !== 0) {
    return integrationDiff;
  }
  return a.component_name.localeCompare(b.component_name, "ja");
}

function countRelatedIntegrations(componentName) {
  return state.integrations.filter((row) => row.from_component === componentName || row.to_component === componentName).length;
}

function clientPointToSvg(event) {
  const svg = elements.mapSvg;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  return point.matrixTransform(matrix.inverse());
}

function isRelatedToSelectedComponent(row) {
  return isComponentRelated(state.selectedComponentName, row);
}

function isComponentRelated(componentName, row) {
  return row.from_component === componentName || row.to_component === componentName;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim() !== "");
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || "";
      return row;
    }, {});
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function groupBy(items, getKey) {
  const map = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    map.set(key, [...(map.get(key) || []), item]);
  });
  return map;
}

function isYes(value) {
  return (value || "").trim().toLowerCase() === "yes";
}

function normalizeStatus(value) {
  return (value || "").trim().toUpperCase().replaceAll("-", "_") || "PLANNED";
}

function pickWorstStatus(statuses) {
  return statuses.sort((a, b) => STATUS_PRIORITY.indexOf(a) - STATUS_PRIORITY.indexOf(b))[0] || "PLANNED";
}

function riskScore(row) {
  const criticality = row.criticality === "High" ? 100 : row.criticality === "Medium" ? 50 : 20;
  const fail = row.openRows.some((coverage) => normalizeStatus(coverage.status) === "FAIL") ? 80 : 0;
  const missingCoverage = row.missingCoverage ? 60 : 0;
  return criticality + fail + missingCoverage + row.openCount + row.evidenceMissingCount;
}

function needsEvidence(row) {
  return isYes(row.evidence_required) || Boolean(row.evidence_id || row.evidence_status);
}

function hasReviewedEvidence(row) {
  const status = (row.evidence_status || "").trim();
  return Boolean(row.evidence_id) && (status === "取得済" || status === "レビュー済" || status.toUpperCase() === "REVIEWED");
}

function getRiskLabels(row) {
  const labels = [];
  if (row.missingCoverage) {
    labels.push("観点未定義");
  }
  row.openRows.forEach((coverage) => {
    labels.push(`${coverage.viewpoint_code}:${normalizeStatus(coverage.status)}`);
  });
  row.evidenceMissingRows.forEach((coverage) => {
    labels.push(`${coverage.viewpoint_code}:証跡不足`);
  });
  return labels;
}

function formatProtocol(row) {
  const values = [row.protocol_or_method, row.protocol, row.port].filter(Boolean);
  return values.join(" / ");
}

function normalizeFlowDirection(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (VALID_FLOW_DIRECTIONS.includes(normalized)) {
    return normalized;
  }
  return "output";
}

function getFlowDirectionLabel(row) {
  const direction = normalizeFlowDirection(row.flow_direction);
  if (direction === "input") return "入力";
  if (direction === "bidirectional") return "相互連携";
  return "出力";
}

function getFlowArrowSymbol(row) {
  const direction = normalizeFlowDirection(row.flow_direction);
  if (direction === "input") return "<-";
  if (direction === "bidirectional") return "<->";
  return "->";
}

function formatIntegrationLink(row) {
  return `${row.from_component} ${getFlowArrowSymbol(row)} ${row.to_component}`;
}

function formatServerIntegrationLink(row) {
  return `${row.from_server} ${getFlowArrowSymbol(row)} ${row.to_server}`;
}

function summarizeDepth(rows) {
  return Array.from(new Set(rows.map((row) => row.test_depth).filter(Boolean))).join(", ");
}

function summarizeObservability(rows) {
  return Array.from(new Set(rows.map((row) => row.observability_point).filter(Boolean))).slice(0, 2).join(" / ");
}

function summarizeLastTestedAt(rows) {
  return rows.map((row) => row.last_tested_at).filter(Boolean).sort().slice(-1)[0] || "";
}

function summarizeDefects(rows) {
  return Array.from(new Set(rows.map((row) => row.defect_id).filter(Boolean))).join(", ");
}

function flowDirectionColor(direction) {
  if (direction === "input") return "#d97706";
  if (direction === "bidirectional") return "#7c3aed";
  return "#0f766e";
}

function secondaryFlowDirectionColor(direction) {
  if (direction === "input") return "#b98b54";
  if (direction === "bidirectional") return "#8d73bf";
  return "#5a8d86";
}

function criticalityToken(value) {
  if (value === "High") return "high";
  if (value === "Medium") return "medium";
  return "low";
}

function statusToken(value) {
  return normalizeStatus(value).toLowerCase().replaceAll("_", "-");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
