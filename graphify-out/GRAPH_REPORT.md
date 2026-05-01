# Graph Report - .  (2026-05-01)

## Corpus Check
- 459 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3222 nodes · 6001 edges · 94 communities detected
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 1942 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]

## God Nodes (most connected - your core abstractions)
1. `internal()` - 74 edges
2. `fetch()` - 73 edges
3. `test_state()` - 60 edges
4. `String` - 56 edges
5. `RecordApi` - 32 edges
6. `async_main()` - 30 edges
7. `Connection` - 30 edges
8. `Connection` - 30 edges
9. `getStripe()` - 30 edges
10. `AppState` - 29 edges

## Surprising Connections (you probably didn't know these)
- `forceCreate()` --calls--> `String`  [INFERRED]
  apps/api/src/pool/index.ts → database/crates/sqlite/src/from_sql.rs
- `test_insert_update_delete_rows()` --calls--> `insert()`  [INFERRED]
  database/crates/core/src/admin/rows/delete_rows.rs → apps/api/src/__tests__/billing/customers-repository.test.ts
- `test_read_rows()` --calls--> `insert()`  [INFERRED]
  database/crates/core/src/records/expand.rs → apps/api/src/__tests__/billing/customers-repository.test.ts
- `list_records_handler()` --calls--> `list()`  [INFERRED]
  database/crates/core/src/records/list_records.rs → apps/api/src/pool/resources.ts
- `build_cors()` --calls--> `list()`  [INFERRED]
  database/crates/core/src/server/mod.rs → apps/api/src/pool/resources.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (175): test_email_handler(), TestEmailRequest, build_upload_avatar_form_req(), create_avatar_handler(), download_avatar(), get_avatar_handler(), test_avatar_upload(), upload_avatar() (+167 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (164): checkPermission(), validateDesktopScope(), validateFilesystemScope(), validateNetworkScope(), validateScope(), validateShellScope(), deleteAccountCreds(), getAccountCreds() (+156 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (72): to_user_reference(), postgres::Client, postgres::Transaction<'a>, execute_batch(), execute_batch_impl(), Connection, execute(), execute_batch() (+64 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (129): Mode, parse_handler(), ParseRequest, ParseResponse, query_handler(), QueryRequest, QueryResponse, cursor_to_value() (+121 more)

### Community 4 - "Community 4"
Cohesion: 0.02
Nodes (87): AdminError, router(), admin_auth_router(), AuthApi, router(), ConfiguredOAuthProvidersResponse, list_configured_providers_handler(), login_with_external_auth_provider() (+79 more)

### Community 5 - "Community 5"
Cohesion: 0.03
Nodes (136): change_email_confirm_handler(), logout_handler(), get_redirect_location(), register_test_user(), setup_state_and_test_user(), test_auth_change_email_flow(), test_auth_change_password_flow(), test_auth_delete_user_flow() (+128 more)

### Community 6 - "Community 6"
Cohesion: 0.02
Nodes (106): formatForConsole(), log(), shipToBetterStack(), shouldLog(), generateRequestId(), getContextFields(), runWithContext(), setContextField() (+98 more)

### Community 7 - "Community 7"
Cohesion: 0.02
Nodes (77): get_config_handler(), update_config_handler(), ContentTypeRejection, RequestContentType, ResponseContentType, Either, Either<T>, EitherRejection (+69 more)

### Community 8 - "Community 8"
Cohesion: 0.03
Nodes (130): cancelDeletionRequest(), createDeletionRequest(), getActiveDeletionRequest(), getScheduledDeletions(), markDeletionCompleted(), getCreditAccount(), getCreditBalance(), getSubscriptionInfo() (+122 more)

### Community 9 - "Community 9"
Cohesion: 0.03
Nodes (72): bootOldSandbox(), getOldSandboxId(), shellQuote(), tarFilesInOldSandbox(), toBuffer(), toSafePathSegment(), transferFiles(), uploadAndExtractOnNewSandbox() (+64 more)

### Community 10 - "Community 10"
Cohesion: 0.03
Nodes (64): get_api_json_schema_handler(), GetTableSchemaParams, JsonSchema, ListJsonSchemasResponse, build_api_json_schema(), build_api_json_schema_internal(), json_schema_handler(), JsonSchemaQuery (+56 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (70): buildBapxMasterUrl(), buildEnvPayload(), buildHeaders(), buildToolboxUrl(), inject(), buildAuthorizedKeysInstallCommand(), buildConnectionForJustavps(), buildConnectionForLocalDocker() (+62 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (30): buildDevSourceBinds(), buildDockerEnvWriteCommand(), findRepoRoot(), getDocker(), getImageForVersion(), getImagePullStatus(), getSandboxInternalApiUrl(), getSandboxUpdateStatus() (+22 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (42): AttachedDatabase, ConnectionEntry, ConnectionError, ConnectionKey, ConnectionManager, ConnectionManagerState, init_main_db_impl(), apply_base_migrations() (+34 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (23): assert_name(), build_create_access_query(), build_read_delete_schema_query(), build_update_access_query(), convert_acl(), CreateRecordAccessQueryTemplate, Entity, filter_excluded_columns() (+15 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (38): getModelPricing(), initModelPricing(), refreshPricing(), stopModelPricing(), flushSentry(), stopDrainer(), fetchDockerHubDevTags(), fetchStableReleases() (+30 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (35): getModel(), resolveOpenRouterId(), matchAllowedRoute(), extractUsageFromAnthropicStream(), extractUsageFromStream(), resolveActor(), billLlmBapxProxy(), billLlmPassthrough() (+27 more)

### Community 17 - "Community 17"
Cohesion: 0.06
Nodes (42): AuthAssets, AuthConfig, ChangeEmailTemplate, ChangePasswordTemplate, hidden_input(), LoginMfaTemplate, LoginTemplate, OAuthProvider (+34 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (19): createCredentialRoutes(), resolveAccount(), createAccountRouter(), createApiKeysRouter(), createBackupRouter(), requireAccessibleJustavpsSandbox(), createCloudSandboxRouter(), createDb() (+11 more)

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (26): delete_files_marked_for_deletion(), delete_pending_files_impl(), FileDeletionsDb, FileError, FileManager, apply_ops(), extract_record(), extract_record_id() (+18 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (14): buildCustomerCloudInitScript(), buildJustAVPSHostRecoveryCommand(), ensureWebhookRegistered(), findRecentlyCreatedMachineByName(), isRecoverableMachineCreateError(), justavpsFetch(), JustAVPSProvider, mintProxyTokenOnJustAvps() (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.07
Nodes (12): as_millis_f64(), HttpMethod, HttpVersion, insert_logs(), JsonLog, LogFieldStorage, LogVisitor, sqlite_logger_on_response() (+4 more)

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (8): AppleIdToken, AppleOAuthProvider, ApplePublicKey, ApplePublicKeys, fetch_apple_public_keys(), GitlabOAuthProvider, MicrosoftOAuthProvider, MicrosoftUser

### Community 23 - "Community 23"
Cohesion: 0.08
Nodes (26): fetch_logs(), GeoipCity, list_logs_handler(), ListLogsResponse, LogEntry, LogJson, any_qs_value_to_sql(), apply_filter_recursively_to_record() (+18 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (11): AuthError, RecordError, Email, EmailError, fallback_sender(), get_sender(), get_site_url(), Mailer (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (14): build_callback(), build_job(), build_job_registry_from_config(), CallbackResultTrait, DefaultSystemJob, delete_pending_files_job(), ExecutionResult, Job (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (11): available_oauth_providers_handler(), OAuthProviderEntry, OAuthProviderResponse, AuthOptions, build_oauth_providers_from_config(), OAuthProvider, oauth_providers_static_registry(), OAuthProviderError (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.12
Nodes (13): AuthMethod, EmailChangeTokenClaims, EmailVerificationTokenClaims, generate_new_key_pair(), JwtHelper, JwtHelperError, PendingAuthTokenClaims, read_file() (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.1
Nodes (10): insert(), Error, ChangeEvent, EventError, EventErrorStatus, EventPayload, JsonEventPayload, serialization_sse_event_test() (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.1
Nodes (10): BillingError, ChannelError, ConflictError, ExecutionError, InsufficientCreditsError, NotFoundError, SubscriptionError, ValidationError (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.13
Nodes (10): callCore(), fetchMasterJson(), fetchWithTimeout(), findRepoRoot(), getAdminKeySchema(), getAllAdminKeys(), getMasterUrlCandidates(), getProjectRoot() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (5): TunnelRateLimiter, start(), tick(), forceCreate(), replenish()

### Community 32 - "Community 32"
Cohesion: 0.23
Nodes (1): DataDir

### Community 33 - "Community 33"
Cohesion: 0.26
Nodes (7): build_executor(), event_loop(), Executor, Message, Options, pg_poc_named_parameter_test(), pg_poc_test()

### Community 34 - "Community 34"
Cohesion: 0.28
Nodes (14): ascendingId(), messageId(), partId(), randomBase62(), sessionId(), toHex(), createMigrationNotice(), extractUserText() (+6 more)

### Community 35 - "Community 35"
Cohesion: 0.31
Nodes (14): clearSession(), dequeue(), enqueue(), getActiveSessionIds(), getAllQueues(), getDataDir(), getSessionQueue(), moveDown() (+6 more)

### Community 36 - "Community 36"
Cohesion: 0.15
Nodes (4): uniqueEvent(), createMockStripeClient(), createMockStripeEvent(), createMockStripeSubscription()

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (4): FacebookOAuthProvider, FacebookUser, FacebookUserPicture, FacebookUserPictureData

### Community 38 - "Community 38"
Cohesion: 0.28
Nodes (11): deriveOverallStatus(), deriveRecommendedAction(), describeProbeFailure(), fetchEndpointJson(), getJustAvpsInstanceHealth(), mapHostStatus(), parseKeyValue(), summarizeHost() (+3 more)

### Community 39 - "Community 39"
Cohesion: 0.23
Nodes (5): deleteSandboxEnv(), fetchMasterJson(), fetchWithTimeout(), getMasterUrlCandidates(), setSandboxEnv()

### Community 40 - "Community 40"
Cohesion: 0.31
Nodes (3): filter_record_apis(), ManagerState, SubscriptionManager

### Community 41 - "Community 41"
Cohesion: 0.24
Nodes (1): DiscordOAuthProvider

### Community 42 - "Community 42"
Cohesion: 0.24
Nodes (1): GithubOAuthProvider

### Community 43 - "Community 43"
Cohesion: 0.24
Nodes (1): GoogleOAuthProvider

### Community 44 - "Community 44"
Cohesion: 0.24
Nodes (1): TwitchOAuthProvider

### Community 45 - "Community 45"
Cohesion: 0.2
Nodes (8): AlreadyAcceptedError, AlreadyMemberError, InviteExpiredError, NotAuthorizedError, NotFoundError, TeamsError, ValidationError, WrongEmailError

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (4): bool, Cow<'_, T>, Option<T>, Value

### Community 47 - "Community 47"
Cohesion: 0.32
Nodes (3): ArcLockGuard, LockError, LockGuard

### Community 48 - "Community 48"
Cohesion: 0.68
Nodes (7): checkLocalSandboxHealth(), getCandidateContainerNames(), hasManagedRecoveryService(), inspectContainerStatus(), recoverSandboxContainer(), run(), shellQuote()

### Community 49 - "Community 49"
Cohesion: 0.52
Nodes (6): ensureMigrationColumn(), getMessagesByThread(), getSql(), getThreadById(), getThreadsByAccount(), markThreadMigrated()

### Community 51 - "Community 51"
Cohesion: 0.48
Nodes (5): validateDesktopScope(), validateFilesystemScope(), validateNetworkScope(), validateScope(), validateShellScope()

### Community 52 - "Community 52"
Cohesion: 0.33
Nodes (2): rusqlite::CachedStatement<'a>, rusqlite::Statement<'a>

### Community 53 - "Community 53"
Cohesion: 0.4
Nodes (4): ExtraTokenFields, OAuthClientSettings, OAuthProvider, OAuthUser

### Community 54 - "Community 54"
Cohesion: 0.4
Nodes (2): IncomingStream<'_, L>, SocketAddr

### Community 55 - "Community 55"
Cohesion: 0.4
Nodes (1): Value

### Community 56 - "Community 56"
Cohesion: 0.5
Nodes (2): createClient(), tokensFromAuthToken()

### Community 57 - "Community 57"
Cohesion: 0.67
Nodes (3): build_info_response(), info_handler(), InfoResponse

### Community 58 - "Community 58"
Cohesion: 0.5
Nodes (2): Job, ListJobsResponse

### Community 60 - "Community 60"
Cohesion: 0.83
Nodes (3): membersTableSql(), probe(), resolveMembersTable()

### Community 61 - "Community 61"
Cohesion: 0.67
Nodes (2): notifyPermissionRequest(), notifyTunnelEvent()

### Community 63 - "Community 63"
Cohesion: 0.67
Nodes (1): Vault

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (2): FromSql, FromSqlError

### Community 65 - "Community 65"
Cohesion: 0.67
Nodes (1): ToSqlProxy<'a>

### Community 66 - "Community 66"
Cohesion: 0.67
Nodes (2): SyncConnection, SyncTransaction

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (2): ensureSchema(), runSqlFile()

### Community 74 - "Community 74"
Cohesion: 1.0
Nodes (1): AuthConfig

### Community 76 - "Community 76"
Cohesion: 1.0
Nodes (1): Database

### Community 77 - "Community 77"
Cohesion: 1.0
Nodes (1): i64

### Community 78 - "Community 78"
Cohesion: 1.0
Nodes (1): f32

### Community 79 - "Community 79"
Cohesion: 1.0
Nodes (1): f64

### Community 80 - "Community 80"
Cohesion: 1.0
Nodes (1): Box<str>

### Community 81 - "Community 81"
Cohesion: 1.0
Nodes (1): std::rc::Rc<str>

### Community 82 - "Community 82"
Cohesion: 1.0
Nodes (1): std::sync::Arc<str>

### Community 83 - "Community 83"
Cohesion: 1.0
Nodes (1): Vec<u8>

### Community 84 - "Community 84"
Cohesion: 1.0
Nodes (1): Box<[u8]>

### Community 85 - "Community 85"
Cohesion: 1.0
Nodes (1): std::rc::Rc<[u8]>

### Community 86 - "Community 86"
Cohesion: 1.0
Nodes (1): std::sync::Arc<[u8]>

### Community 87 - "Community 87"
Cohesion: 1.0
Nodes (1): [u8; N]

### Community 89 - "Community 89"
Cohesion: 1.0
Nodes (1): Vec<(String, Value)>

### Community 90 - "Community 90"
Cohesion: 1.0
Nodes (1): NamedParams

### Community 91 - "Community 91"
Cohesion: 1.0
Nodes (1): Vec<(&str, Value)>

### Community 92 - "Community 92"
Cohesion: 1.0
Nodes (1): &[(&str, Value)]

### Community 93 - "Community 93"
Cohesion: 1.0
Nodes (1): NamedParamsRef<'_, N>

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): [(&str, Value); N]

### Community 95 - "Community 95"
Cohesion: 1.0
Nodes (1): [(&str, ToSqlProxy<'a>); N]

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (1): Vec<Value>

### Community 97 - "Community 97"
Cohesion: 1.0
Nodes (1): [ToSqlProxy<'a>; N]

### Community 98 - "Community 98"
Cohesion: 1.0
Nodes (1): (T,)

### Community 99 - "Community 99"
Cohesion: 1.0
Nodes (1): [Value; N]

### Community 100 - "Community 100"
Cohesion: 1.0
Nodes (1): Transaction

### Community 101 - "Community 101"
Cohesion: 1.0
Nodes (1): Statement

### Community 102 - "Community 102"
Cohesion: 1.0
Nodes (1): ToSqlProxy

### Community 103 - "Community 103"
Cohesion: 1.0
Nodes (1): Value

### Community 104 - "Community 104"
Cohesion: 1.0
Nodes (1): rusqlite::types::Value

## Knowledge Gaps
- **318 isolated node(s):** `TestEmailRequest`, `InfoResponse`, `Job`, `ListJobsResponse`, `RunJobRequest` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 32`** (16 nodes): `DataDir`, `.backup_path()`, `.config_path()`, `.data_path()`, `.default()`, `.ensure_directory_structure()`, `.key_path()`, `.logs_db_path()`, `.main_db_path()`, `.migrations_path()`, `.queue_db_path()`, `.root()`, `.secrets_path()`, `.session_db_path()`, `.uploads_path()`, `data_dir.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (10 nodes): `DiscordOAuthProvider`, `.display_name()`, `.factory()`, `.get_user()`, `.name()`, `.new()`, `.oauth_scopes()`, `.provider()`, `.settings()`, `discord.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (10 nodes): `GithubOAuthProvider`, `.display_name()`, `.factory()`, `.get_user()`, `.name()`, `.new()`, `.oauth_scopes()`, `.provider()`, `.settings()`, `github.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (10 nodes): `GoogleOAuthProvider`, `.display_name()`, `.factory()`, `.get_user()`, `.name()`, `.new()`, `.oauth_scopes()`, `.provider()`, `.settings()`, `google.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (10 nodes): `TwitchOAuthProvider`, `.display_name()`, `.factory()`, `.get_user()`, `.name()`, `.new()`, `.oauth_scopes()`, `.provider()`, `.settings()`, `twitch.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (6 nodes): `rusqlite::CachedStatement<'a>`, `.bind_parameter()`, `.parameter_index()`, `rusqlite::Statement<'a>`, `.bind_parameter()`, `.parameter_index()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (5 nodes): `IncomingStream<'_, L>`, `.io()`, `.remote_addr()`, `SocketAddr`, `.connect_info()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (5 nodes): `Value`, `.accepts()`, `.from_sql()`, `.from_sql_null()`, `.to_sql()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (5 nodes): `createClient()`, `decodeUserFromToken()`, `registerUser()`, `tokensFromAuthToken()`, `client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (4 nodes): `Job`, `list_jobs_handler()`, `ListJobsResponse`, `list_jobs.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (4 nodes): `createPermissionRequestsRouter()`, `notifyPermissionRequest()`, `notifyTunnelEvent()`, `permission-requests.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (3 nodes): `Vault`, `.from_text()`, `.to_text()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (3 nodes): `FromSql`, `FromSqlError`, `from_sql.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (3 nodes): `ToSqlProxy<'a>`, `.from()`, `.to_sql()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (3 nodes): `SyncConnection`, `SyncTransaction`, `traits.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (3 nodes): `ensureSchema()`, `runSqlFile()`, `ensure-schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (2 nodes): `AuthConfig`, `.token_ttls()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (2 nodes): `Database`, `database.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (2 nodes): `i64`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (2 nodes): `f32`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (2 nodes): `f64`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `Box<str>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `std::rc::Rc<str>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (2 nodes): `std::sync::Arc<str>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (2 nodes): `Vec<u8>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (2 nodes): `Box<[u8]>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `std::rc::Rc<[u8]>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `std::sync::Arc<[u8]>`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `[u8; N]`, `.column_result()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `Vec<(String, Value)>`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (2 nodes): `NamedParams`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (2 nodes): `Vec<(&str, Value)>`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (2 nodes): `&[(&str, Value)]`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (2 nodes): `NamedParamsRef<'_, N>`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (2 nodes): `[(&str, Value); N]`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (2 nodes): `[(&str, ToSqlProxy<'a>); N]`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (2 nodes): `Vec<Value>`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `[ToSqlProxy<'a>; N]`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (2 nodes): `(T,)`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (2 nodes): `[Value; N]`, `.bind()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (2 nodes): `Transaction`, `transaction.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (2 nodes): `Statement`, `statement.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (2 nodes): `ToSqlProxy`, `to_sql.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (2 nodes): `Value`, `.try_from()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (2 nodes): `rusqlite::types::Value`, `.from()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `String` connect `Community 8` to `Community 0`, `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 7`, `Community 38`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 15`, `Community 48`, `Community 16`, `Community 19`, `Community 20`, `Community 31`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **Why does `internal()` connect `Community 0` to `Community 2`, `Community 3`, `Community 4`, `Community 37`, `Community 5`, `Community 6`, `Community 41`, `Community 10`, `Community 42`, `Community 43`, `Community 44`, `Community 14`, `Community 17`, `Community 19`, `Community 22`, `Community 24`, `Community 26`, `Community 28`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `fetch()` connect `Community 6` to `Community 1`, `Community 38`, `Community 39`, `Community 8`, `Community 9`, `Community 11`, `Community 12`, `Community 15`, `Community 16`, `Community 20`, `Community 30`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Are the 73 inferred relationships involving `internal()` (e.g. with `get_api_json_schema_handler()` and `insert_row_handler()`) actually correct?**
  _`internal()` has 73 INFERRED edges - model-reasoned connections that need verification._
- **Are the 62 inferred relationships involving `fetch()` (e.g. with `fetchWithTimeout()` and `callCore()`) actually correct?**
  _`fetch()` has 62 INFERRED edges - model-reasoned connections that need verification._
- **Are the 54 inferred relationships involving `test_state()` (e.g. with `test_insert_update_delete_rows()` and `admin_insert_geometry_test()`) actually correct?**
  _`test_state()` has 54 INFERRED edges - model-reasoned connections that need verification._
- **Are the 55 inferred relationships involving `String` (e.g. with `create_avatar_handler()` and `recursively_merge_vault_and_env()`) actually correct?**
  _`String` has 55 INFERRED edges - model-reasoned connections that need verification._