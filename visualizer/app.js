const VIEWPOINTS = ["NET", "AUTH", "AUTHZ", "CFG", "DATA", "MON", "PERF", "FAIL", "OPS", "SEC"];
const STATUS_PRIORITY = ["FAIL", "HOLD", "PLANNED", "READY", "RUN", "PASS", "NOT_NEEDED"];
const DOMAIN_ORDER = ["User Access", "Identity", "Network Security", "Platform", "Security Ops", "Operations"];

const sample = {
  components: `component_id,component_name,domain,owner,description
CMP-001,Outlook,User Access,M365Team,メール通知と利用者接点
CMP-002,SharePoint,User Access,M365Team,文書管理と権限制御
CMP-003,Active Directory,Identity,IdentityTeam,認証とグループ管理
CMP-004,FortiGate,Network Security,NetworkTeam,境界防御と通信制御
CMP-005,Cisco Switch,Network Security,NetworkTeam,L2/L3ネットワークとSyslog送信
CMP-006,VMware vSphere,Platform,ServerTeam,仮想基盤と仮想サーバ管理
CMP-007,Splunk,Security Ops,OpsTeam,ログ収集と監視アラート
CMP-008,COTS Batch Tool,Operations,OpsTeam,定期運用ジョブと外部製品連携
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
CMP-022,Themis,Identity,IdentityTeam,多要素認証基盤`,
  integrations: `integration_id,from_component,to_component,integration_type,business_scenario,purpose,protocol_or_method,protocol,port,environment,criticality,owner,lifecycle_stage,prerequisite_integration_id,consumer_team,provider_team,review_status,expected_evidence,observability_point,last_tested_at,failure_impact,notes
INT-001,Outlook,SharePoint,通知,メール通知からの文書参照,通知メールから文書へアクセス,HTTPS,TCP,443,IT,High,M365Team,ケース作成済,,UserSupportTeam,M365Team,Open,アクセス画面キャプチャと認証ログ,SharePointアクセスログと利用者画面,2026-06-28,利用者が文書へ到達できない,URL到達と認証状態を確認
INT-002,SharePoint,Active Directory,認可,グループ権限による文書閲覧,グループ権限による閲覧制御,LDAP/Graph,TCP,389/443,IT,High,IdentityTeam,実施中,INT-001,M365Team,IdentityTeam,Open,権限差分画面とADグループ変更履歴,SharePoint権限画面とAD監査ログ,2026-06-26,権限過不足により情報漏えいまたは閲覧不可,ADグループ反映と権限差分を確認
INT-003,FortiGate,SharePoint,通信制御,SharePoint通信の許可と遮断,SharePoint通信の許可と拒否,HTTPS policy,TCP,443,IT,High,NetworkTeam,ケース作成済,INT-001,M365Team,NetworkTeam,Open,FWポリシー設定と遮断ログ,FortiGateトラフィックログ,2026-06-20,許可漏れまたは不要通信の通過,FWポリシーと遮断ログを確認
INT-004,VMware vSphere,Active Directory,認証,仮想サーバのドメイン参加,仮想サーバのドメイン参加,Kerberos/LDAP,TCP/UDP,88/389/445,IT,High,ServerTeam,実施中,,ServerTeam,IdentityTeam,Open,ドメイン参加結果とGPO適用ログ,イベントログとGPO結果レポート,2026-06-27,サーバ運用と認証連携が成立しない,GPO反映と再起動後状態を確認
INT-005,Cisco Switch,Splunk,ログ連携,ネットワーク機器ログ集約,ネットワーク機器ログの集約,Syslog,UDP,514,IT,Medium,OpsTeam,完了,,OpsTeam,NetworkTeam,Open,Splunk検索結果と送信元ホスト確認,Splunkインデックス検索,2026-06-30,障害解析に必要なログが欠損,送信元ホストと時刻を確認
INT-006,FortiGate,Splunk,監視,セキュリティイベント監視,セキュリティログ監視,Syslog,UDP,514,IT,High,SecOps,要再試験,INT-005,SecOps,NetworkTeam,Open,Splunkアラート履歴とイベント検索結果,Splunk相関検索とアラート履歴,2026-07-01,重大イベントの検知遅延または未検知,重大イベントの検知とアラートを確認
INT-007,Outlook,Active Directory,認証,利用者認証とアドレス帳参照,利用者認証とアドレス帳参照,Kerberos/LDAP,TCP,88/389,IT,Medium,IdentityTeam,ケース作成済,INT-001,UserSupportTeam,IdentityTeam,Open,認証成功ログと属性参照結果,認証ログと属性参照結果画面,2026-06-24,利用者認証または宛先解決に失敗,資格情報と属性参照を確認
INT-008,COTS Batch Tool,SharePoint,ファイル連携,夜間処理後の運用ファイル格納,運用ファイルの格納と参照,HTTPS/API,TCP,443,IT,Medium,OpsTeam,実施中,INT-001,OpsTeam,M365Team,Open,格納ファイル一覧と処理ログ,SharePointファイル一覧とバッチログ,2026-06-29,運用ファイルの欠損または権限誤り,夜間処理後の格納結果を確認
INT-009,COTS Batch Tool,Splunk,ログ連携,ジョブログ監視,ジョブログの監視連携,File forwarder,TCP,9997,IT,Medium,OpsTeam,ケース作成済,INT-008,OpsTeam,SecOps,Open,Splunk検索結果と異常終了アラート履歴,Splunk取り込み状況とアラート履歴,2026-06-25,ジョブ異常の検知遅延,異常終了ログの検知を確認
INT-010,Virtru,Outlook,通知,保護付きメール送受信,メールでの保護連携,Mail add-in/API,TCP,443,IT,High,M365Team,ケース作成済,INT-001,UserSupportTeam,M365Team,Open,暗号化メール画面と送受信ログ,Outlook送信履歴とVirtru監査ログ,2026-07-02,保護付きメールが送受信できない,メールでの連携のみ仮登録
INT-011,NextLabs,SharePoint,ファイル連携,共有ファイルの保護制御,ファイル共有時の保護連携,Policy enforcement/API,TCP,443,IT,High,M365Team,ケース作成済,INT-008,M365Team,M365Team,Open,保護ポリシー適用結果と共有ログ,SharePoint共有履歴とポリシー監査ログ,2026-07-02,共有ファイルに保護ポリシーが適用されない,ファイル共有での連携のみ仮登録
INT-012,OpenFreeRadius,Active Directory,認証,ネットワーク認証の利用者照合,RADIUS認証基盤の利用者照合,RADIUS/LDAP,UDP/TCP,1812/389,IT,High,IdentityTeam,ケース作成済,,NetworkTeam,IdentityTeam,Open,認証成功ログとAD参照結果,Radius認証ログとAD監査ログ,2026-07-02,利用者認証が成立せずネットワーク接続できない,RADIUS認証バックエンドの仮連携
INT-013,SKYSEA,Active Directory,認証,端末資産と利用者情報の関連付け,端末管理用の利用者情報参照,LDAP,TCP,389,IT,Medium,OpsTeam,ケース作成済,,OpsTeam,IdentityTeam,Open,端末台帳と利用者情報の参照結果,SKYSEA操作ログとAD参照ログ,2026-07-02,端末利用者情報が突合できない,資産管理向けの仮連携
INT-014,SKYSEA,Splunk,ログ連携,端末操作ログの集約,端末管理ログの監視連携,Syslog/API,TCP,443/514,IT,Medium,OpsTeam,ケース作成済,INT-013,OpsTeam,SecOps,Open,Splunk検索結果と操作ログ,SKYSEA監査ログとSplunk検索,2026-07-02,端末操作ログが集約されない,監視用途の仮連携
INT-015,Trellix HX,Splunk,監視,EDRイベントの監視集約,EDRイベントの監視連携,Syslog/API,TCP,443/514,IT,High,SecOps,実施中,,SecOps,SecOps,Open,アラート履歴とEDRイベント検索,Splunk相関検索とHXイベントログ,2026-07-03,EDRイベントが監視に上がらない,EDR監視用途の仮連携
INT-016,Trellix ePO,Trellix HX,設定反映,エージェントとポリシー統合管理,EDRポリシー配布と統合管理,Management API,TCP,443,IT,High,SecOps,ケース作成済,INT-015,SecOps,SecOps,Open,ポリシー配布結果と管理コンソール画面,ePO配布ログとHXエージェント状態,2026-07-03,HXへポリシーが反映されない,管理基盤の仮連携
INT-017,Tenable,VMware vSphere,監視,仮想サーバの脆弱性診断,仮想サーバの脆弱性スキャン連携,Scanner/API,TCP,443,IT,Medium,SecOps,ケース作成済,INT-004,SecOps,ServerTeam,Open,スキャン結果と対象資産一覧,Tenableスキャン結果とvSphere資産情報,2026-07-03,脆弱性診断対象が取得できない,脆弱性診断用途の仮連携
INT-018,IDEA CA,Active Directory,認証,証明書発行対象の利用者連携,認証局向けの利用者情報連携,LDAP/API,TCP,389/443,IT,High,IdentityTeam,ケース作成済,,IdentityTeam,IdentityTeam,Open,証明書発行結果と利用者情報参照ログ,CA発行ログとAD監査ログ,2026-07-04,証明書発行対象を正しく識別できない,認証局用途の仮連携
INT-019,Tripwire,Splunk,監視,改ざん検知イベントの集約,改ざん検知イベントの監視連携,Syslog/API,TCP,443/514,IT,High,SecOps,ケース作成済,,SecOps,SecOps,Open,改ざん検知イベントと検索結果,Splunk相関検索とTripwireイベントログ,2026-07-04,改ざん検知イベントが監視へ連携されない,改ざん検知用途の仮連携
INT-020,Horizon VDI,Active Directory,認証,VDI利用者のドメイン認証,仮想デスクトップ利用者認証,Kerberos/LDAP,TCP,88/389,IT,High,ServerTeam,実施中,,UserSupportTeam,IdentityTeam,Open,ログイン成功画面と認証ログ,VDI接続ログとAD認証ログ,2026-07-04,VDI利用者がログインできない,VDI認証用途の仮連携
INT-021,Horizon VDI,VMware vSphere,運用,仮想デスクトップ基盤のホスト連携,VDIホスト管理連携,Management API,TCP,443,IT,High,ServerTeam,ケース作成済,INT-020,ServerTeam,ServerTeam,Open,仮想デスクトップ一覧とホスト状態,VDI管理画面とvSphere状態画面,2026-07-04,仮想デスクトップを配備できない,VDIホスト用途の仮連携
INT-022,Veeam Backup,VMware vSphere,運用,仮想基盤バックアップ,バックアップ対象の取得と保護,Backup API,TCP,443,IT,High,ServerTeam,実施中,INT-004,OpsTeam,ServerTeam,Open,バックアップジョブ結果と復元ログ,Veeamジョブ履歴とvSphere資産一覧,2026-07-04,バックアップまたは復元が成立しない,バックアップ用途の仮連携
INT-023,FortiManager,FortiGate,設定反映,FWポリシーの統合管理,FortiGateポリシー配布管理,Management API,TCP,443,IT,High,NetworkTeam,ケース作成済,INT-003,NetworkTeam,NetworkTeam,Open,ポリシー配布結果と管理画面,FortiManager配布ログとFortiGate設定差分,2026-07-04,FWポリシーを一括反映できない,Forti管理用途の仮連携
INT-024,iDoperation,Active Directory,認可,特権IDの利用者管理,特権ID管理向けの利用者情報連携,LDAP/API,TCP,389/443,IT,High,IdentityTeam,ケース作成済,,OpsTeam,IdentityTeam,Open,特権ID付与結果と操作ログ,特権申請ログとAD監査ログ,2026-07-04,特権ID付与や棚卸が正しく行えない,特権管理用途の仮連携
INT-025,Themis,Horizon VDI,認証,VDI利用時の多要素認証,仮想デスクトップ向け多要素認証,Auth API,TCP,443,IT,High,IdentityTeam,ケース作成済,INT-020,UserSupportTeam,IdentityTeam,Open,MFA成功画面と認証履歴,Themis認証履歴とVDI接続ログ,2026-07-04,VDI利用時に多要素認証が成立しない,MFA用途の仮連携`,
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
INT-008,DATA,データ連携,Yes,運用ファイルがSharePointへ格納される必要がある,READY,TC-008-001,Normal,Yes,,未取得,SharePointファイル一覧,2026-06-29,,OpsTeam,ファイル格納結果
INT-008,AUTHZ,認可,Yes,格納先権限が運用ファイルの閲覧範囲を決めるため,PLANNED,TC-008-002,Abnormal,Yes,,未取得,権限確認画面,2026-06-29,,OpsTeam,格納先権限
INT-008,OPS,運用,Yes,夜間処理後の確認手順を明確化するため,PLANNED,TC-008-003,Recovery,Yes,,未取得,夜間処理ログ,2026-06-29,,OpsTeam,夜間処理後の確認手順
INT-009,DATA,データ連携,Yes,ジョブログがSplunkへ取り込まれる必要がある,READY,TC-009-001,Normal,Yes,,未取得,Splunk取り込み状況,2026-06-25,,OpsTeam,ジョブログ取り込み
INT-009,MON,監視,Yes,異常終了をアラートで検知する必要がある,PLANNED,TC-009-002,Abnormal,Yes,,未取得,異常終了アラート履歴,2026-06-25,,OpsTeam,異常終了アラート
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
INT-025,FAIL,障害,Yes,MFA失敗時の拒否動作を確認する必要がある,PLANNED,TC-025-002,Abnormal,Yes,,未取得,MFA失敗履歴,2026-07-04,,IdentityTeam,MFA失敗時の拒否動作`,
};

let state = {
  components: [],
  integrations: [],
  coverage: [],
  selectedIntegrationId: "",
  selectedComponentName: "",
  editMode: false,
  pendingConnectionFrom: "",
  editorMode: "",
  draggingComponentName: "",
  dragMoved: false,
  suppressNodeClickName: "",
};

const elements = {
  componentsFile: document.getElementById("componentsFile"),
  integrationsFile: document.getElementById("integrationsFile"),
  coverageFile: document.getElementById("coverageFile"),
  sampleButton: document.getElementById("sampleButton"),
  editModeButton: document.getElementById("editModeButton"),
  addComponentButton: document.getElementById("addComponentButton"),
  startConnectionButton: document.getElementById("startConnectionButton"),
  autoLayoutButton: document.getElementById("autoLayoutButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  importJsonButton: document.getElementById("importJsonButton"),
  jsonFileInput: document.getElementById("jsonFileInput"),
  criticalityFilter: document.getElementById("criticalityFilter"),
  ownerFilter: document.getElementById("ownerFilter"),
  integrationTypeFilter: document.getElementById("integrationTypeFilter"),
  openOnlyFilter: document.getElementById("openOnlyFilter"),
  summaryStrip: document.getElementById("summaryStrip"),
  mapSvg: document.getElementById("mapSvg"),
  selectedDetail: document.getElementById("selectedDetail"),
  editorPanel: document.getElementById("editorPanel"),
  riskTableBody: document.querySelector("#riskTable tbody"),
  coverageTable: document.getElementById("coverageTable"),
};

elements.sampleButton.addEventListener("click", loadSample);
elements.editModeButton.addEventListener("click", toggleEditMode);
elements.addComponentButton.addEventListener("click", beginAddComponent);
elements.startConnectionButton.addEventListener("click", toggleConnectionMode);
elements.autoLayoutButton.addEventListener("click", autoArrangeComponents);
elements.exportJsonButton.addEventListener("click", exportJson);
elements.exportCsvButton.addEventListener("click", exportCsvFiles);
elements.importJsonButton.addEventListener("click", () => elements.jsonFileInput.click());
elements.jsonFileInput.addEventListener("change", importJson);
elements.componentsFile.addEventListener("change", loadUploadedFiles);
elements.integrationsFile.addEventListener("change", loadUploadedFiles);
elements.coverageFile.addEventListener("change", loadUploadedFiles);
elements.criticalityFilter.addEventListener("change", render);
elements.ownerFilter.addEventListener("change", render);
elements.integrationTypeFilter.addEventListener("change", render);
elements.openOnlyFilter.addEventListener("change", render);

loadSample();

async function loadSample() {
  const loaded = await loadBundledCsv();
  if (loaded) {
    return;
  }

  state = {
    components: parseCsv(sample.components),
    integrations: parseCsv(sample.integrations),
    coverage: parseCsv(sample.coverage),
    selectedIntegrationId: "INT-006",
    selectedComponentName: "",
    editMode: false,
    pendingConnectionFrom: "",
    editorMode: "",
  };
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  render();
}

async function loadBundledCsv() {
  try {
    const [componentsText, integrationsText, coverageText] = await Promise.all([
      fetch("../data/components.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
      fetch("../data/integration_points.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
      fetch("../data/coverage_matrix.csv", { cache: "no-store" }).then(ensureOk).then((response) => response.text()),
    ]);

    state = {
      components: parseCsv(componentsText),
      integrations: parseCsv(integrationsText),
      coverage: parseCsv(coverageText),
      selectedIntegrationId: "INT-006",
      selectedComponentName: "",
      editMode: false,
      pendingConnectionFrom: "",
      editorMode: "",
    };
    hydrateOwnerFilter();
    hydrateIntegrationTypeFilter();
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
    components: parseCsv(componentsText),
    integrations: parseCsv(integrationsText),
    coverage: parseCsv(coverageText),
    selectedIntegrationId: "",
    selectedComponentName: "",
    editMode: false,
    pendingConnectionFrom: "",
    editorMode: "",
  };
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  render();
}

function render() {
  const enriched = getFilteredIntegrations().map(enrichIntegration);
  const displayIntegrations = getDisplayIntegrations(enriched);
  if (!enriched.some((row) => row.integration_id === state.selectedIntegrationId) && enriched[0]) {
    state.selectedIntegrationId = enriched[0].integration_id;
  }
  if (state.selectedComponentName && !enriched.some(isRelatedToSelectedComponent)) {
    state.selectedComponentName = "";
  }
  if (!displayIntegrations.some((row) => row.integration_id === state.selectedIntegrationId) && displayIntegrations[0]) {
    state.selectedIntegrationId = displayIntegrations[0].integration_id;
  }

  renderSummary(displayIntegrations, enriched);
  renderMap(enriched);
  renderDetail(displayIntegrations);
  renderEditorPanel(displayIntegrations);
  renderRiskTable(displayIntegrations);
  renderCoverageTable(displayIntegrations);
  renderControlState();
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

function getFilteredIntegrations() {
  const criticality = elements.criticalityFilter.value;
  const owner = elements.ownerFilter.value;
  const integrationType = elements.integrationTypeFilter.value;
  const openOnly = elements.openOnlyFilter.checked;

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

  const cards = [
    ["表示対象", focusedLabel],
    ["構成要素", componentNames.size],
    ["結合点", integrations.length],
    ["要試験観点", requiredCount],
    ["未完了観点", openCount],
    ["証跡不足", evidenceMissingCount],
    ["観点未定義", missingCoverageCount],
    ["High未完了", highOpen],
  ];

  elements.summaryStrip.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="summary-card">
          <div class="summary-label">${escapeHtml(label)}</div>
          <div class="summary-value">${escapeHtml(String(value))}</div>
        </article>
      `
    )
    .join("");
}

function renderMap(integrations) {
  const width = 1280;
  const height = 760;
  const domains = DOMAIN_ORDER;
  const domainX = new Map(domains.map((domain, index) => [domain, 110 + index * 205]));
  const componentsByName = new Map(state.components.map((component) => [component.component_name, component]));
  const visibleNames = state.editMode
    ? state.components.map((component) => component.component_name)
    : Array.from(new Set(integrations.flatMap((row) => [row.from_component, row.to_component].filter(Boolean))));
  const grouped = groupBy(visibleNames, (name) => componentsByName.get(name)?.domain || "Operations");
  const positions = new Map();

  domains.forEach((domain) => {
    const names = grouped.get(domain) || [];
    const startY = Math.max(120, 330 - names.length * 48);
    names.forEach((name, index) => {
      const component = componentsByName.get(name) || {};
      const customX = Number(component.pos_x);
      const customY = Number(component.pos_y);
      positions.set(name, {
        x: Number.isFinite(customX) && customX > 0 ? customX : domainX.get(domain) || 110,
        y: Number.isFinite(customY) && customY > 0 ? customY : startY + index * 112,
        domain,
      });
    });
  });

  const defs = `
    <defs>
      ${["High", "Medium", "Low"].map(
        (level) => `
          <marker id="arrow-${level}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="${criticalityColor(level)}"></path>
          </marker>
        `
      ).join("")}
    </defs>
  `;

  const domainLabels = domains
    .map((domain) => `<text x="${domainX.get(domain)}" y="42" text-anchor="middle" class="domain-label">${domain}</text>`)
    .join("");

  const edges = integrations
    .map((row, index) => {
      const from = positions.get(row.from_component);
      const to = positions.get(row.to_component);
      if (!from || !to) return "";

      const midX = (from.x + to.x) / 2;
      const bendY = Math.min(from.y, to.y) - 54 - (index % 3) * 14;
      const selected = state.selectedIntegrationId === row.integration_id;
      const relatedToComponent = !state.selectedComponentName || isRelatedToSelectedComponent(row);
      const color = criticalityColor(row.criticality);
      const widthValue = selected ? 5.4 : relatedToComponent ? (row.riskCount > 0 ? 3.4 : 2.6) : 1.4;
      const opacity = selected ? 1 : relatedToComponent ? 0.92 : 0.16;
      const dangerMark = selected && row.riskCount > 0
        ? `<circle cx="${midX}" cy="${bendY - 18}" r="9" fill="#b42318"></circle>
           <text x="${midX}" y="${bendY - 14}" text-anchor="middle" fill="#fff" font-size="10" font-weight="900">${row.riskCount}</text>`
        : "";
      const edgeLabel = selected ? [row.integration_id, row.integration_type].filter(Boolean).join(" ") : "";
      const edgeLabelMarkup = selected
        ? `<text x="${midX}" y="${bendY - 28}" text-anchor="middle">${escapeHtml(edgeLabel)}</text>`
        : "";

      return `
        <g class="edge ${relatedToComponent ? "edge-related" : "edge-muted"}" data-id="${escapeHtml(row.integration_id)}" tabindex="0">
          <path d="M ${from.x + 72} ${from.y} C ${midX} ${bendY}, ${midX} ${bendY}, ${to.x - 72} ${to.y}"
            stroke="${color}" stroke-width="${widthValue}" opacity="${opacity}" marker-end="url(#arrow-${row.criticality || "Low"})"></path>
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
      if (!pos) return "";
      const selected = state.selectedComponentName === name;
      const related = !state.selectedComponentName || name === state.selectedComponentName || integrations.some((row) =>
        isComponentRelated(name, row)
      );
      return `
        <g class="node ${selected ? "node-selected" : related ? "node-related" : "node-muted"} ${state.editMode ? "node-draggable" : ""}" data-name="${escapeHtml(name)}" tabindex="0" transform="translate(${pos.x - 72}, ${pos.y - 28})">
          <rect width="144" height="56" rx="6"></rect>
          <text x="72" y="25" text-anchor="middle">${escapeHtml(name)}</text>
          <text class="domain" x="72" y="42" text-anchor="middle">${escapeHtml(component.owner || pos.domain)}</text>
        </g>
      `;
    })
    .join("");

  elements.mapSvg.innerHTML = `${defs}${domainLabels}${edges}${nodes}`;
  elements.mapSvg.querySelectorAll(".edge").forEach((edge) => {
    const select = () => {
      state.selectedIntegrationId = edge.dataset.id;
      state.selectedComponentName = "";
      state.editorMode = "";
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
  elements.mapSvg.querySelectorAll(".node").forEach((node) => {
    if (state.editMode) {
      node.addEventListener("pointerdown", (event) => startNodeDrag(event, node.dataset.name));
    }
    const focus = () => {
      const name = node.dataset.name;
      if (state.suppressNodeClickName === name) {
        state.suppressNodeClickName = "";
        return;
      }
      if (state.editMode && state.pendingConnectionFrom) {
        if (state.pendingConnectionFrom === name) {
          state.pendingConnectionFrom = "";
        } else {
          createIntegrationBetween(state.pendingConnectionFrom, name);
          state.pendingConnectionFrom = "";
          state.selectedComponentName = "";
        }
      } else {
        state.selectedComponentName = state.selectedComponentName === name ? "" : name;
      }
      state.editorMode = "";
      render();
    };
    node.addEventListener("click", focus);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focus();
      }
    });
  });
}

function renderDetail(integrations) {
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
      <div class="detail-value">${escapeHtml(selected.integration_id)} / ${escapeHtml(selected.from_component)} -> ${escapeHtml(selected.to_component)}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">シナリオ / 連携目的</div>
      <div class="detail-value">${escapeHtml(selected.business_scenario || "")}</div>
      <div>${escapeHtml(selected.purpose || "")}</div>
    </div>
    <div class="detail-block">
      <div class="detail-label">種別 / 方式 / 重要度 / 担当</div>
      <div class="chip-row">
        <span class="chip chip-low">${escapeHtml(selected.integration_type || "未分類")}</span>
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
    .map((row) => `${row.integration_id}: ${row.from_component} -> ${row.to_component}`)
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
  if (!state.editMode) {
    elements.editorPanel.innerHTML = "";
    return;
  }

  const selectedComponent = state.components.find((row) => row.component_name === state.selectedComponentName);
  const selectedIntegration = state.integrations.find((row) => row.integration_id === state.selectedIntegrationId);
  const statusNote = state.pendingConnectionFrom
    ? `接続開始元: ${state.pendingConnectionFrom}。接続先の製品ノードをクリックすると線を追加します。`
    : "編集モードです。製品を追加するか、製品詳細・結合点詳細を変更できます。";

  let body = `<p class="empty-state">製品または結合点を選択してください。</p>`;
  if (state.editorMode === "new-component") {
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
        ${isNew ? `<button type="button" id="cancelComponentCreateButton">閉じる</button>` : `<button type="button" id="componentConnectButton">この製品から線を引く</button><button type="button" id="resetComponentPositionButton">自動配置へ戻す</button>`}
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

function bindEditorPanelEvents() {
  const createForm = document.getElementById("componentCreateForm");
  if (createForm) {
    createForm.addEventListener("submit", saveNewComponent);
    document.getElementById("cancelComponentCreateButton")?.addEventListener("click", () => {
      state.editorMode = "";
      render();
    });
  }

  const componentForm = document.getElementById("componentEditForm");
  if (componentForm) {
    componentForm.addEventListener("submit", saveComponentEdits);
    document.getElementById("componentConnectButton")?.addEventListener("click", () => {
      if (!state.selectedComponentName) return;
      state.pendingConnectionFrom = state.selectedComponentName;
      render();
    });
    document.getElementById("resetComponentPositionButton")?.addEventListener("click", resetSelectedComponentPosition);
  }

  const integrationForm = document.getElementById("integrationEditForm");
  if (integrationForm) {
    integrationForm.addEventListener("submit", saveIntegrationEdits);
    document.getElementById("addCoverageRowButton")?.addEventListener("click", addCoverageRowToSelectedIntegration);
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
          <td class="wrap">${escapeHtml(row.from_component)} -> ${escapeHtml(row.to_component)}<br>${escapeHtml(row.purpose || "")}</td>
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

function getDisplayIntegrations(integrations) {
  if (!state.selectedComponentName) {
    return integrations;
  }
  return integrations.filter(isRelatedToSelectedComponent);
}

function renderControlState() {
  elements.editModeButton.textContent = state.editMode ? "編集モード終了" : "編集モード開始";
  elements.addComponentButton.disabled = !state.editMode;
  elements.startConnectionButton.disabled = !state.editMode || !state.selectedComponentName;
  elements.autoLayoutButton.disabled = !state.editMode;
  elements.startConnectionButton.textContent = state.pendingConnectionFrom
    ? `接続先を選択中: ${state.pendingConnectionFrom}`
    : "線を引く";
}

function startNodeDrag(event, componentName) {
  if (!state.editMode || !componentName) return;
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
  state.editorMode = "";
  render();
}

function beginAddComponent() {
  if (!state.editMode) return;
  state.selectedComponentName = "";
  state.selectedIntegrationId = "";
  state.editorMode = "new-component";
  render();
}

function toggleConnectionMode() {
  if (!state.editMode || !state.selectedComponentName) return;
  state.pendingConnectionFrom = state.pendingConnectionFrom ? "" : state.selectedComponentName;
  state.editorMode = "";
  render();
}

function autoArrangeComponents() {
  const domainX = new Map(DOMAIN_ORDER.map((domain, index) => [domain, 110 + index * 205]));
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
      pos_x: String(domainX.get(domain) || 110),
      pos_y: String(Math.round(startY + index * 112)),
    };
  });
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
          notes: String(formData.get("notes") || "").trim(),
        }
      : row
  );
  render();
}

function exportJson() {
  const payload = JSON.stringify(
    {
      components: state.components,
      integrations: state.integrations,
      coverage: state.coverage,
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
}

async function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  const parsed = JSON.parse(text);
  state.components = Array.isArray(parsed.components) ? parsed.components : [];
  state.integrations = Array.isArray(parsed.integrations) ? parsed.integrations : [];
  state.coverage = Array.isArray(parsed.coverage) ? parsed.coverage : [];
  state.selectedComponentName = "";
  state.selectedIntegrationId = state.integrations[0]?.integration_id || "";
  state.pendingConnectionFrom = "";
  state.editorMode = "";
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  render();
  event.target.value = "";
}

function createIntegrationBetween(fromComponent, toComponent) {
  const integrationId = nextId("INT", state.integrations.map((row) => row.integration_id));
  const integration = {
    integration_id: integrationId,
    from_component: fromComponent,
    to_component: toComponent,
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
    notes: "GUIで追加した連携",
  };
  state.integrations = [...state.integrations, integration];
  state.coverage = [...state.coverage, ...createDefaultCoverageRows(integrationId, integration.owner)];
  hydrateOwnerFilter();
  hydrateIntegrationTypeFilter();
  state.selectedIntegrationId = integrationId;
}

function addCoverageRowToSelectedIntegration() {
  if (!state.selectedIntegrationId) return;
  const integration = state.integrations.find((row) => row.integration_id === state.selectedIntegrationId);
  state.coverage = [...state.coverage, createCoverageRow(state.selectedIntegrationId, nextCoverageCode(), "新規観点", integration?.owner || "", "GUIで追加した観点")];
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

function renderSelectOptions(values, selectedValue) {
  return values
    .map((value) => `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(value)}</option>`)
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

function criticalityColor(value) {
  if (value === "High") return "#b42318";
  if (value === "Medium") return "#b7791f";
  return "#0f766e";
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
