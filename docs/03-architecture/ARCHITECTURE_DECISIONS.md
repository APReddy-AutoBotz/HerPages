# Architecture decision records

All ADRs below are **proposed baseline decisions** pending implementation evidence. Record an ADR change rather than silently contradicting these choices.

## ADR-001 — Native local-first vault

**Context:** intimate records, long life span, offline need and the user's preference for phone-local data. **Decision:** React Native/Expo native encrypted vault; separate connected cloud. **Alternatives:** cloud-only database, web-only PWA, native Swift/Kotlin. **Consequences:** stronger data minimization, harder recovery and native testing; web v1 cannot display the private vault. **Revisit:** only after an independently reviewed browser key/threat model or verified native incompatibility.

## ADR-002 — Data classes instead of one synchronized user database

**Decision:** distinguish local private, optional ciphertext, service-private and intentionally connected data. **Consequence:** clear feature boundaries; no generic server diary search or cloud profiling. **Tradeoff:** encrypted data cannot be moderated or searched centrally. **Revisit:** requires explicit user-facing privacy change, not an implementation shortcut.

## ADR-003 — Encryption provider and recovery are gated

**Decision:** standard audited primitives behind native interfaces; no bespoke algorithm or email-password-derived vault key. Initial encryption implementation depends on a compatibility/recovery spike. **Consequence:** no immediate 'zero knowledge' marketing; specialist review budget required. **Revisit:** if platform support changes, migrate formats using tested versioned archives.

## ADR-004 — Versioned snapshots before live multi-device sync

**Decision:** immutable encrypted backups with single active writer and explicit conflict handling. **Alternatives:** CRDT per item, plaintext database replication, last-write-wins object overwrite. **Consequence:** useful recoverability without pretending conflict-free sharing; live collaboration deferred. **Revisit:** when users demonstrate a frequent multi-writer need and a reviewed protocol exists.

## ADR-005 — Theme separate from authority

**Decision:** grouped visual chapters, user choice, independent server policy for age/relationships/capabilities. **Consequence:** age 18 can look like Horizon while having adult rights; an older woman can use any palette. **Revisit:** jurisdictional boundaries may vary, never merge with theme logic.

## ADR-006 — Modular monolith and durable outbox

**Decision:** one TypeScript API codebase with worker, Postgres, standard adapters. **Alternatives:** many microservices, serverless functions for every workflow. **Consequence:** easier authorization and operations; isolate modules in code. **Revisit:** measured isolation/scaling need and a team able to operate more services.

## ADR-007 — Local explicit matching; AI optional

**Decision:** local rule-based recommendations over published catalog and intentional interests. No hidden activity inference. Cloud AI is adult-only, per-request selected disclosure and disabled until reviewed. **Consequence:** limited personalization but stronger transparency and lower costs. **Revisit:** only with lawful purpose, user comprehension and measured usefulness; child review remains separate.

## ADR-008 — Community is not an encrypted vault extension

**Decision:** connected community content is server-readable for moderation and separately consented; no open minor social network initially. **Consequence:** cannot claim the whole application is E2EE; moderation must be staffed. **Revisit:** encryption of messaging requires a new abuse/reporting architecture; does not remove safeguarding responsibilities.

## ADR-009 — Safety resources before location sessions

**Decision:** verified offline official resources and dialer handoff first. No police integration or response-time promise. Adult trusted-contact sessions deferred; minor location disabled. **Consequence:** smaller honest safety feature, no covert tracking. **Revisit:** only after formal integration, operational and legal evidence.

## ADR-010 — No data-sale or child-advertising model

**Decision:** test subscription and purpose-limited organization workflows, not audience monetization. **Consequence:** disciplined cost management and slower growth may be necessary. **Revisit:** any business-model change needs owner, privacy and safeguarding review; it cannot repurpose historical data silently.

## ADR-011 — Public repository, private operations

**Decision:** publish architecture/specifications/synthetic fixtures; keep secrets, research records, identity evidence, user data and security reports outside Git. **Consequence:** documentation transparency is not source-license permission or a security guarantee. **Revisit:** licensing remains owner decision.

## ADR-012 — Build-tool independence

**Decision:** standard repo, documented contracts, no hidden builder-only business rules. Bolt capacity is spent on coherent vertical slices and reusable design; Codex resumes using task IDs, tests and status. **Consequence:** feature breadth never substitutes for migration/native feasibility. **Revisit:** alternate tools must still satisfy clean-room setup and ownership requirements.

## ADR-013 — HP-003 crypto profile (PROVISIONAL — independent review required)

**Context:** HP-003 spike needed to prove the native encryption/key/recovery model is feasible on Expo SDK 57. **Decision:** AES-256-GCM via expo-crypto with 96-bit CSPRNG nonces; canonical AAD binding vault_id, object_id, key_epoch, format_version, purpose; high-entropy generated recovery secret (no KDF); expo-sqlite with SQLCipher (`useSQLCipher: true`, PRAGMA key before access); expo-secure-store for bootstrap/wrapping secret. No custom primitives. Fail-closed on unavailable secure storage — no plaintext fallback. **Alternatives:** react-native-keychain (not needed yet), PBKDF2/Argon2 KDF (not needed — recovery secret is high-entropy), web crypto substitute (not valid for native vault). **Consequences:** portable logic tested with 37 Vitest tests; native behavior NOT verified on device; G2 NOT passed. **Revisit:** after independent crypto/security review and native device tests pass. See `docs/03-architecture/HP-003_SPIKE_FINDINGS.md` for full details.
