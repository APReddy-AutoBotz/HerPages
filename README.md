# HerPages

## An app that grows with her.

**Her story belongs to her.**

HerPages is a proposed privacy-first growth, personal-journey and opportunity platform for girls and women. A parent can begin a daughter's story; she gains an age-appropriate voice and, at adulthood, independent control. Women can also join at any age, including 50+, 65+ and beyond, without needing a childhood history.

> **Repository status:** HP-002 foundation implemented; native encryption/recovery (HP-003) is not yet implemented. No production service, emergency integration, legal certification or customer validation is represented as complete.

**Owner:** Parameswar Reddy / APReddy-AutoBotz  
**Architecture baseline:** 1.0 — 16 September 2026  
**Initial market hypothesis:** India; English-first with Telugu localization foundations. Expansion is gated by research and jurisdiction-specific review.

## Start here

| You are… | Read first |
|---|---|
| Product owner or collaborator | [Product charter](docs/01-product/PRODUCT_CHARTER.md), [PRD](docs/01-product/PRD.md), [decisions and assumptions](docs/01-product/DECISIONS_AND_ASSUMPTIONS.md) |
| Designer | [Lifecycle and access](docs/01-product/LIFECYCLE_AND_ACCESS.md), [design system](docs/02-design/DESIGN_SYSTEM.md), [screen specifications](docs/02-design/SCREEN_SPECIFICATIONS.md) |
| Engineer or coding agent | [AGENTS.md](AGENTS.md), [architecture](docs/03-architecture/ARCHITECTURE.md), [stack](docs/03-architecture/TECH_STACK.md), [delivery backlog](docs/06-delivery/BACKLOG.md) |
| Privacy or security reviewer | [Privacy](docs/04-trust/PRIVACY_AND_DATA_LIFECYCLE.md), [encryption](docs/04-trust/ENCRYPTION_KEY_MANAGEMENT.md), [threat model](docs/04-trust/THREAT_MODEL.md), [legal register](docs/04-trust/LEGAL_REGISTER.md) |
| Child-safety reviewer | [Consent and age assurance](docs/04-trust/CONSENT_AND_AGE_ASSURANCE.md), [child safety](docs/04-trust/CHILD_SAFETY_AND_COMMUNITY.md) |
| Starting implementation | [Roadmap](docs/06-delivery/ROADMAP.md), [Bolt playbook](docs/06-delivery/BOLT_BUILD_PLAYBOOK.md), [Codex handover](docs/06-delivery/CODEX_HANDOVER.md), [release gates](docs/06-delivery/RELEASE_GATES.md) |

The [documentation index](docs/README.md) lists the full pack. [STATUS.md](docs/06-delivery/STATUS.md) distinguishes documented, implemented, tested and released work. [SOURCES.md](docs/07-reference/SOURCES.md) records primary-source research and verification limitations.

## Current implementation state

HP-002 establishes a pnpm monorepo with:

```text
apps/mobile/          React Native + Expo SDK 57 shell
apps/web/             Next.js shell
services/api/         Fastify API skeleton
packages/contracts/   typed/validated contracts
packages/design-tokens/
packages/domain/
packages/policy/
packages/vault-port/  interfaces only; no crypto implementation yet
```

The HP-002 workspace was manually transferred once and accidentally nested under `/project/`; the repair branch flattens the source tree back to repository root and removes transfer-only artifacts. See [repository repair note](docs/06-delivery/REPOSITORY_REPAIR.md). Fresh GitHub/fresh-checkout verification is required before HP-003 starts.

## Product promise

HerPages helps someone **capture what matters, choose a useful next step and discover relevant opportunities**, without turning her private life into an advertising profile.

The proposed product has five connected areas:

- **My Pages:** private memories, reflections, milestones and personal goals.
- **Grow:** optional routines, life skills and age-appropriate activities, without shame-based streaks or fixed assumptions about marriage, motherhood, career or retirement.
- **Discover:** editorially checked opportunities, learning, events and career exploration, with source links, eligibility and freshness dates.
- **Connect:** carefully gated girls'/women's communities and mentorship; not an open children's social network.
- **Safety & Help:** accessible official resources and, only after separate verification, optional trusted-contact features. HerPages does not promise police arrival, emergency dispatch or guaranteed message delivery.

Parents and authorized guardians of any gender can use guardian functions. Girls'/women's community eligibility is a separate policy and is not established using face, voice or appearance-based gender inference.

## One brand; a lifelong experience

| Age | Suggested visual chapter | Experience emphasis |
|---|---|---|
| 0–5 | First Pages | Parent-led memories and activities |
| 6–9 | Wonder | Curiosity and shared discovery |
| 10–12 | Bloom | Interests, confidence and life skills |
| 13–15 | Aura | Voice, exploration and digital awareness |
| 16–18 | Horizon | Education, skills, opportunities, safety |
| 19–24 | Rise | Learning, work and self-directed goals |
| 25–35 | Momentum | Career, money, life goals, wellbeing |
| 36–49 | Rooted | Leadership, family, goals, balance |
| 50–64 | Flourish | Reinvention, wellbeing, finance, mentoring |
| 65+ | Evergreen | Community, purpose, experiences, legacy, mentoring |

**A visual chapter never grants permission.** In the India baseline, the under-18 policy boundary is evaluated independently of the Horizon theme, which includes age 18. Theme changes are opt-in; accessibility settings are available at every age. A birthday never makes a profile public or grants another person access.

## Architecture in one view

```mermaid
flowchart LR
    M[Mobile: React Native / Expo] --> L[Encrypted local vault]
    M -->|optional client-encrypted backup| B[Ciphertext object storage]
    M -->|minimum service data| A[TypeScript modular API]
    W[Web / partner / admin] --> A
    A --> P[PostgreSQL / Supabase Auth / RLS]
    A --> O[Curated content and opportunities]
    A --> Q[Outbox and workers]
    A -->|explicit selected disclosure only| AI[Provider-independent AI gateway]
    L -. no server plaintext access .-> B
```

**Chosen direction:** React Native + Expo + TypeScript; SQLite/SQLCipher for the native vault; OS-backed secret storage; Next.js for web/partner/admin; a TypeScript modular monolith; PostgreSQL/Supabase; versioned API and JSON Schema contracts; GitHub as source of truth. Exact security implementation is selected only after HP-003 passes the native compatibility and recovery spike.

The same database is not copied indiscriminately into the cloud. Local vault content, encrypted backups, service-private account data and intentionally published community content are different data classes with different access and retention rules.

## Non-negotiable boundaries

1. No private vault plaintext in application logs, analytics, push notifications, public buckets or server-side search indexes.
2. No targeted advertising, sale of personal data or hidden behavioral profiling. Explicit interests are not automatically a legal exemption from child-data rules.
3. No open minor profiles, stranger messaging, adult-to-minor private mentoring or live minor-location sharing at initial release.
4. No account-password reset that silently decrypts a vault. Recovery requires a separately designed and tested key-recovery process.
5. No custom cryptographic primitives, self-certified safety claims or blanket claims that all data stays on the phone.
6. No public child-facing launch, cloud AI on minors' personal data or community launch until their respective release gates pass.
7. No investor-style claims of validated demand, retention, market share or guaranteed profitability without evidence.

## Build strategy

**Bolt is temporary acceleration; GitHub is ownership; Codex is continuity.** The promotional period does not define product scope or justify bypassing security. Use synthetic data in builder environments. Prove the native vault and clean-room handover before depending on generated UI.

The next engineering step after fresh HP-002 verification is **HP-003 — native encryption/key/recovery feasibility spike**. Do not start HP-003 from a loose file copy or a web-only environment pretending to prove native security.

## Validate documentation

```sh
python3 scripts/validate_docs.py
python3 -m unittest discover -s scripts -p 'test_*.py' -v
```

Application checks, when dependencies are installed, are defined by the root workspace scripts. The documentation validator is **not** an application test suite, native security audit or legal review.

## Collaboration and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Do not post vulnerabilities, personal records, identity documents, recovery material or children's data in this public repository. See [licensing and ownership](docs/07-reference/OWNERSHIP_AND_LICENSING.md); no open-source license has been selected merely because the repository is public.
