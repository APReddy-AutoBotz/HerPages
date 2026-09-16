# Technology stack and selection rationale

## Recommended stack

| Layer | Choice | Why / boundary |
|---|---|---|
| Mobile | React Native + Expo development builds + TypeScript | One iOS/Android product codebase with native modules; Expo Go is not the secure-vault test environment. [S03] |
| Navigation | Expo Router | Consistent app routing; server policy still authorizes connected actions. |
| Local vault | expo-sqlite with SQLCipher enabled | Encrypted native relational storage and local search; media separately encrypted. [S03] |
| Secret storage | Expo SecureStore plus reviewed native key/crypto adapter | Bootstrap secrets, OS lock integration; not a claim that all keys never enter process memory. [S04–S06] |
| Local queries | Parameterized SQL repository interfaces initially | Fewer migration abstractions while proving recovery; Drizzle may be adopted by ADR after compatibility testing. |
| Client state | React state; Zustand only for non-sensitive UI state | No persistent global state containing unlocked diary text or keys. |
| Server-state cache | TanStack Query, memory-first with data-class-specific persistence | Do not persist authenticated content into unencrypted generic caches. |
| Forms/contracts | React Hook Form + Zod, generated contract checks | Consistent validation; server validates again. |
| Web/partner/admin | Next.js App Router + TypeScript | Standard web stack; native vault deliberately not exposed in web v1. [S24] |
| Web styling | CSS variables + accessible component primitives | Shared design tokens, independent native implementation; avoid a lock-in UI generator. |
| API | Fastify + TypeScript on an active Node LTS | Explicit schema validation, portable containers and modular route ownership. |
| Service database | Supabase-managed PostgreSQL + Auth + RLS | Fast setup with standard Postgres portability and row-level authorization. [S07] |
| Objects | Supabase private Storage initially | Ciphertext backups and separately classified connected uploads; signed grants are bearer capabilities. |
| Jobs | Postgres transactional outbox + worker | Durable retries without adding a broker before need. |
| Search | Local vault FTS; Postgres catalog search | No central private-journal embeddings or separate search cluster. |
| Notifications | Local reminders; APNs/FCM via reviewed adapter | Push payloads generic; delivery not guaranteed. Expo transport can be used after privacy review. |
| AI | Provider-independent API adapter, off by default | Provider contracts, retention and minor restrictions are release gates. [S12] |
| Payments | Entitlement port + store-specific billing integration | Verify storefront rules; web B2B billing is separate. [S09] |
| Tooling | pnpm workspace, optional Turborepo, GitHub Actions | Reproducible builds and shared packages; no need for premature orchestrator complexity. |
| Tests | Vitest; React Native Testing Library; native E2E with Maestro or Detox after spike; Playwright for web | Real-device encryption/recovery tests cannot be replaced by browser snapshots. |

## Version policy

No package lockfile is fabricated in a documentation-only repo. At HP-002/003 select the then-supported stable Expo SDK and its required React/React Native versions using official compatibility guidance, select active Node LTS, record exact versions, pin dependencies and commit a lockfile. Do not repeat unverified version claims from brainstorming. Update through compatibility-tested dependency PRs, not floating `latest` tags.

Native crypto and SQLCipher are go/no-go spikes. Verify Android/iOS build, release signing, biometric changes, uninstall/reinstall, backup exclusions, WAL/temp files, device-to-device restore and package maintenance/license. Do not generate a custom crypto library because a wrapper is unavailable. Use standard reviewed native primitives behind a small interface and obtain specialist review before real data.

## Why not alternatives first?

A pure PWA cannot automatically provide the same OS-backed secret model and durable mobile background behavior. Flutter is technically possible but would add a second language alongside the user's TypeScript ecosystem. A web wrapper is suitable for a demo, not proof of a native vault. Firebase is a viable service alternative, but mixing it with Supabase adds operational and permission duplication. Microservices and a vector database add complexity without solving the first user problem.

## Ports to preserve

`VaultRepository`, `CryptoProvider`, `RecoveryProvider`, `CatalogRepository`, `PolicyEvaluator`, `IdentityAssuranceProvider`, `NotificationTransport`, `AIProvider`, `BillingProvider`, `ObjectStore`, `Clock` and `AuditSink` have interface contracts and synthetic test doubles. Test doubles cannot be enabled silently in production. An explicit build/runtime manifest must label mock integrations.

## Vendor checks before provision

Confirm supported region, encryption/key custody, backups, logs, data processing agreement, subprocessors, exportability, deletion behavior, abuse-reporting route, pricing and quotas. Exact Supabase auth/session semantics and changelog changes must be rechecked at implementation. S07 includes an important distinction: RLS is not E2EE and an elevated service key can bypass RLS.

## Windows and remote development

Use Windows/WSL or a supported development host for code and Android testing. iOS native builds/testing require an appropriate macOS/Xcode runner or approved cloud build service and actual supported devices. A successful web preview does not prove iOS compatibility. Do not promise that the entire production test matrix can be completed using only a browser.
