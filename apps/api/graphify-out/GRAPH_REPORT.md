# Graph Report - apps/api  (2026-05-01)

## Corpus Check
- 244 files · ~175,490 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1293 nodes · 2157 edges · 41 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 535 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `fetch()` - 70 edges
2. `getStripe()` - 30 edges
3. `LocalDockerProvider` - 28 edges
4. `execOnHost()` - 24 edges
5. `getCreditAccount()` - 21 edges
6. `updateCreditAccount()` - 21 edges
7. `PipedreamProvider` - 20 edges
8. `JustAVPSProvider` - 19 edges
9. `executeUpdate()` - 18 edges
10. `getTier()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `resolveEndpoint()` --calls--> `getProvider()`  [INFERRED]
  test-exec.ts → src/platform/providers/index.ts
- `api()` --calls--> `fetch()`  [INFERRED]
  scripts/build-snapshot.ts → src/index.ts
- `getConfig()` --calls--> `readContainerConfig()`  [INFERRED]
  test-exec.ts → src/update/container-config.ts
- `getConfig()` --calls--> `buildFromInspect()`  [INFERRED]
  test-exec.ts → src/update/container-config.ts
- `getConfig()` --calls--> `writeContainerConfig()`  [INFERRED]
  test-exec.ts → src/update/container-config.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (113): getCreditAccount(), getCreditBalance(), getSubscriptionInfo(), getYearlyAccountsDueForRotation(), updateCreditAccount(), upsertCreditAccount(), deactivateConflictingCustomers(), getCustomerByAccountId() (+105 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (51): getRequestUrl(), normalizeForwardedHeader(), buildBapxMasterUrl(), buildEnvPayload(), buildHeaders(), buildToolboxUrl(), inject(), PipedreamProvider (+43 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (28): buildDevSourceBinds(), buildDockerEnvWriteCommand(), findRepoRoot(), getDocker(), getImageForVersion(), getImagePullStatus(), getSandboxInternalApiUrl(), getSandboxUpdateStatus() (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (42): destroyOne(), findCandidate(), grab(), provision(), getDefaultProviderName(), getProvider(), createApiKey(), serializeSandbox() (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (43): requireAdmin(), can(), canSync(), assertScope(), applyOverridesToRole(), effectiveScopes(), resolveRole(), resolveRoleSync() (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (51): cmdConfig(), cmdExec(), cmdStatus(), cmdUpdate(), cmdVerify(), getConfig(), resolveEndpoint(), buildDockerRunCommand() (+43 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (25): buildCustomerCloudInitScript(), buildJustAVPSHostRecoveryCommand(), ensureWebhookRegistered(), findRecentlyCreatedMachineByName(), isProxyTokenStale(), isRecoverableMachineCreateError(), justavpsFetch(), JustAVPSProvider (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (44): ensureAccountMember(), getAccountRole(), listAccountMembers(), listUserMemberships(), removeAccountMember(), updateAccountRole(), createInvite(), deleteExpiredInvites() (+36 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (38): getModel(), resolveOpenRouterId(), matchAllowedRoute(), extractUsageFromAnthropicStream(), extractUsageFromStream(), resolveActor(), billLlmBapxProxy(), billLlmPassthrough() (+30 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (35): setContextField(), setSentryUser(), apiKeyAuth(), combinedAuth(), extractPreviewSandboxId(), isLocalPreviewBypassRequest(), setPreviewSessionCookie(), trailbaseAuth() (+27 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (34): bootOldSandbox(), getOldSandboxId(), shellQuote(), tarFilesInOldSandbox(), toBuffer(), toSafePathSegment(), transferFiles(), uploadAndExtractOnNewSandbox() (+26 more)

### Community 11 - "Community 11"
Cohesion: 0.07
Nodes (23): getModelPricing(), initModelPricing(), refreshPricing(), stopModelPricing(), flushSentry(), drainOnce(), getAuthHeaders(), getOpenCodeUrl() (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (12): createAccountRouter(), createApiKeysRouter(), createBackupRouter(), requireAccessibleJustavpsSandbox(), createCloudSandboxRouter(), cleanupTestData(), createMockProvider(), createTestApp() (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (21): fetchDockerHubDevTags(), fetchStableReleases(), getAllVersions(), getLatestDev(), getLatestStable(), getLatestVersionForChannel(), getRunningChannel(), getRunningVersion() (+13 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (20): buildAuthorizedKeysInstallCommand(), buildConnectionForJustavps(), buildConnectionForLocalDocker(), generateKeypair(), getDockerClient(), injectPublicKeyViaHostExec(), injectPublicKeyViaHostExecWithRetry(), resolveLocalSshPort() (+12 more)

### Community 15 - "Community 15"
Cohesion: 0.09
Nodes (2): listActiveSandboxesByAccount(), notifySandboxesConnectorSync()

### Community 16 - "Community 16"
Cohesion: 0.1
Nodes (10): BillingError, ChannelError, ConflictError, ExecutionError, InsufficientCreditsError, NotFoundError, SubscriptionError, ValidationError (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.13
Nodes (10): callCore(), fetchMasterJson(), fetchWithTimeout(), findRepoRoot(), getAdminKeySchema(), getAllAdminKeys(), getMasterUrlCandidates(), getProjectRoot() (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (15): formatForConsole(), log(), shipToBetterStack(), shouldLog(), generateRequestId(), getContextFields(), runWithContext(), buildDockerEnvWriteCommand() (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.28
Nodes (14): ascendingId(), messageId(), partId(), randomBase62(), sessionId(), toHex(), createMigrationNotice(), extractUserText() (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.31
Nodes (14): clearSession(), dequeue(), enqueue(), getActiveSessionIds(), getAllQueues(), getDataDir(), getSessionQueue(), moveDown() (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (4): uniqueEvent(), createMockStripeClient(), createMockStripeEvent(), createMockStripeSubscription()

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (4): start(), tick(), cleanup(), replenish()

### Community 23 - "Community 23"
Cohesion: 0.28
Nodes (11): deriveOverallStatus(), deriveRecommendedAction(), describeProbeFailure(), fetchEndpointJson(), getJustAvpsInstanceHealth(), mapHostStatus(), parseKeyValue(), summarizeHost() (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (5): getOverridesCached(), invalidateOverrides(), key(), isScope(), listOverrides()

### Community 25 - "Community 25"
Cohesion: 0.23
Nodes (5): deleteSandboxEnv(), fetchMasterJson(), fetchWithTimeout(), getMasterUrlCandidates(), setSandboxEnv()

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (10): cancelDeletionRequest(), createDeletionRequest(), getActiveDeletionRequest(), getScheduledDeletions(), markDeletionCompleted(), cancelAccountDeletion(), deleteAccountImmediately(), getAccountDeletionStatus() (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.2
Nodes (8): AlreadyAcceptedError, AlreadyMemberError, InviteExpiredError, NotAuthorizedError, NotFoundError, TeamsError, ValidationError, WrongEmailError

### Community 28 - "Community 28"
Cohesion: 0.43
Nodes (6): ensureGenericLocalSandboxRecord(), findExistingLocalSandboxRow(), getBaseUrl(), getHealthUrl(), getLocalSandboxSnapshot(), getMappedPorts()

### Community 29 - "Community 29"
Cohesion: 0.68
Nodes (7): checkLocalSandboxHealth(), getCandidateContainerNames(), hasManagedRecoveryService(), inspectContainerStatus(), recoverSandboxContainer(), run(), shellQuote()

### Community 30 - "Community 30"
Cohesion: 0.43
Nodes (6): checkPermission(), validateDesktopScope(), validateFilesystemScope(), validateNetworkScope(), validateScope(), validateShellScope()

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (1): SandboxEventBus

### Community 32 - "Community 32"
Cohesion: 0.52
Nodes (6): ensureMigrationColumn(), getMessagesByThread(), getSql(), getThreadById(), getThreadsByAccount(), markThreadMigrated()

### Community 33 - "Community 33"
Cohesion: 0.48
Nodes (5): validateDesktopScope(), validateFilesystemScope(), validateNetworkScope(), validateScope(), validateShellScope()

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (1): TunnelRateLimiter

### Community 38 - "Community 38"
Cohesion: 0.8
Nodes (4): fromHeaders(), getDefaultProvider(), getProviderFromRequest(), getProviderSync()

### Community 39 - "Community 39"
Cohesion: 0.83
Nodes (3): membersTableSql(), probe(), resolveMembersTable()

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (2): notifyPermissionRequest(), notifyTunnelEvent()

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (3): checkCredits(), deductCredits(), getCreditBalance()

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (2): main(), parseArgs()

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (2): ensureSchema(), runSqlFile()

## Knowledge Gaps
- **7 isolated node(s):** `NotAuthorizedError`, `NotFoundError`, `AlreadyMemberError`, `AlreadyAcceptedError`, `InviteExpiredError` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 15`** (22 nodes): `deleteIntegration()`, `getAppSandboxLinks()`, `getIntegrationByApp()`, `getIntegrationById()`, `getIntegrationForSandbox()`, `getLinkedSandboxes()`, `getSandboxAppConflict()`, `hasSandboxIntegration()`, `insertIntegration()`, `linkSandboxIntegration()`, `listActiveSandboxesByAccount()`, `listIntegrationsByAccount()`, `listSandboxIntegrations()`, `unlinkSandboxIntegration()`, `updateIntegrationLabel()`, `updateIntegrationLastUsed()`, `verifySandboxOwnership()`, `createIntegrationsRouter()`, `createIntegrationsTokenRouter()`, `notifySandboxesConnectorSync()`, `repositories.ts`, `routes.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (7 nodes): `SandboxEventBus`, `.constructor()`, `.emit()`, `.off()`, `.on()`, `.processWebhook()`, `sandbox-events.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (5 nodes): `TunnelRateLimiter`, `.check()`, `.checkAndConsume()`, `.cleanup()`, `rate-limiter.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (4 nodes): `createPermissionRequestsRouter()`, `notifyPermissionRequest()`, `notifyTunnelEvent()`, `permission-requests.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (3 nodes): `main()`, `parseArgs()`, `seed-legacy-migration.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (3 nodes): `ensureSchema()`, `runSqlFile()`, `ensure-schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `fetch()` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`, `Community 13`, `Community 17`, `Community 18`, `Community 23`, `Community 25`, `Community 28`?**
  _High betweenness centrality (0.362) - this node is a cross-community bridge._
- **Why does `getTrailbase()` connect `Community 7` to `Community 0`, `Community 9`, `Community 3`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `validatePreviewToken()` connect `Community 9` to `Community 1`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 59 inferred relationships involving `fetch()` (e.g. with `api()` and `getRequestUrl()`) actually correct?**
  _`fetch()` has 59 INFERRED edges - model-reasoned connections that need verification._
- **Are the 29 inferred relationships involving `getStripe()` (e.g. with `syncLegacyStripeSubscription()` and `performDeletion()`) actually correct?**
  _`getStripe()` has 29 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `execOnHost()` (e.g. with `cmdStatus()` and `cmdUpdate()`) actually correct?**
  _`execOnHost()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `getCreditAccount()` (e.g. with `getCreditSummary()` and `deductCredits()`) actually correct?**
  _`getCreditAccount()` has 20 INFERRED edges - model-reasoned connections that need verification._