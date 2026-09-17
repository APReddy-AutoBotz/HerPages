# HerPages — instructions for every coding agent

This repository is the source of truth. Read this file before modifying anything. The product is not a generic social network and the documentation baseline is not proof that any feature exists.

## Mandatory read order

1. `README.md` and `docs/06-delivery/STATUS.md`.
2. `docs/01-product/DECISIONS_AND_ASSUMPTIONS.md` and `docs/01-product/PRD.md`.
3. `docs/03-architecture/ARCHITECTURE.md`, `TECH_STACK.md`, and the relevant ADR.
4. `docs/04-trust/PRIVACY_AND_DATA_LIFECYCLE.md`, `CHILD_SAFETY_AND_COMMUNITY.md` and the feature's threat model.
5. The assigned backlog task, its requirement IDs, tests, dependencies and release gate.

## Non-negotiable instructions

- Preserve the exact brand **HerPages** and tagline **An app that grows with her.** Do not invent a new brand or claim trademark clearance.
- Visual stages and authorization are separate. Age 18 may retain Horizon styling but is not a minor in the India product policy. Unknown or disputed age never unlocks adult capabilities.
- A guardian may be a father or another authorized adult. Guardian access does not grant girls'/women's community membership.
- Never generate a gender classifier, attractiveness score, personality diagnosis or deterministic career prediction.
- Never upload vault plaintext, exact private interests, journal-derived embeddings, photographs, recovery secrets or safety coordinates to analytics, logs, model training, public buckets or developer tools.
- Do not use `localStorage`, AsyncStorage or a plain SQLite fallback for sensitive vault content. If secure native storage is unavailable, show a blocked state; do not quietly downgrade.
- No open child profiles, direct stranger messaging, adult-to-minor DMs, child behavioral analytics, live minor tracking or cloud AI on minor personal data in the baseline.
- A local-only feature is not automatically exempt from privacy law. Do not bypass consent gates by relabeling processing as on-device.
- No emergency-response guarantee; never fake a police integration, dispatch confirmation or successful notification. Distinguish queued, provider-accepted, device-delivered where available and contact-acknowledged states.
- No self-designed cryptographic primitives. Security-sensitive implementation requires the encryption spike and independent review. A JavaScript key wrapper is not automatically hardware-isolated cryptography.
- Never use user-editable account metadata as authority. All privileged operations are checked server-side against fresh roles, relationships, consent and revocation state.
- Do not deploy, provision paid infrastructure, enroll real minors, import real personal records or enable externally sending features just because a development task says build.
- Never seed real contact numbers, identity records, school locations or birthdays. Fixtures must be synthetic and visibly labeled.

## Working method

Work in a small reviewable branch. Identify task IDs such as `HP-003`, associated `FR-xxx` requirements and `TST-xxx` cases. Record a short implementation plan before editing. Do not implement a different stack to accommodate a builder limitation; use an adapter or raise an ADR.

Before adding dependencies, verify official current documentation and package provenance, pin compatible versions, commit the lockfile and record native compatibility. Never blindly run `@latest` inside an existing app. Do not mix Expo SDK and React Native versions outside the supported combination.

Keep business logic in `packages/domain`, policy checks in `packages/policy`, schemas in `contracts`, and platform implementations behind ports. Share tokens and contracts across mobile/web; do not force DOM components into React Native.

## Definition of done for a task

The PR must include: implemented paths; requirement coverage; commands actually run; test results and relevant artifacts; privacy/security impact; migrations and rollback/forward-fix notes; accessibility checks; unresolved limitations; updated status. Screenshots of a happy path do not prove authorization, encryption, deletion, recovery or notification delivery.

Run `python3 scripts/validate_docs.py` for documentation changes. Once application tooling exists, run the applicable lint, type, unit, integration, policy-negative and device tests listed in the task. A skipped or unavailable test is reported as not run, never passed.

## Parallel agents

Parallelize independent read-only research or isolated modules with explicit file ownership. One integrator owns migrations, contracts, auth, crypto and release manifests. Do not let concurrent agents rewrite the same schema or regenerate lockfiles independently. Rebase, inspect diff and rerun checks before merge.

## Stop conditions

Stop implementation of the affected feature and report a blocker when a critical source is unverified, cryptography silently degrades, a permission can be bypassed, a child-safety gate is missing, a migration can destroy data, or a provider contract cannot support the promised privacy. Continue unrelated safe work. Never remove the failing check to make CI green.

## Handover format

State: commit and branch; finished tasks; not-finished tasks; tests run; fixtures used; current feature flags; environment-variable names only; next task; known defects; decisions pending. Do not include keys, passwords, access tokens, recovery codes or private conversation transcripts.
