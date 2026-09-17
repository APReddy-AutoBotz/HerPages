# Implementation backlog

**Progress:** HP-001 is complete. HP-002 is implemented and fresh-checkout CI verified. HP-003 has a corrected portable feasibility implementation with GitHub CI evidence; real Android/iOS verification and independent cryptographic review remain outstanding, so G2 is **NOT PASSED**. HP-004 is implemented as a portable lifecycle/capability engine with golden-policy tests; server enforcement and restricted-capability enablement remain gated. HP-005 onward are not started unless explicitly recorded otherwise. Completion requires code and test evidence, not a checked box in a generated plan. FR requirements live in `../01-product/requirements.json`; TST cases in `test-cases.json`.

| Task | Scope and acceptance | Depends on | Requirements | Gate |
|---|---|---|---|---|
| HP-001 | Publish coherent docs/contracts, source register and passing documentation checks | None | FR-058, FR-064 | G0 |
| HP-002 | Standard pnpm workspace, native app, API/web skeleton, pinned compatible versions, clean setup | HP-001 | FR-058 | G1 |
| HP-003 | Native encryption/key/recovery spike; prove no plaintext fallback and clean-device recovery | HP-002 | FR-008, FR-009, FR-014 | G1/G2 |
| HP-004 | Independent lifecycle and capability engine, unknown/18 boundary, server-authoritative flags | HP-002 | FR-015, FR-016, FR-039, FR-045, FR-056 | G1/G3 |
| HP-005 | Offline Pages create/edit/search and accurate privacy status | HP-003 | FR-001, FR-002, FR-003, FR-005 | G1 |
| HP-006 | Encrypted media/temp handling, archive export and local deletion | HP-005 | FR-004, FR-006, FR-007 | G2 |
| HP-007 | Service auth, guardian assurance adapter, consent receipts/withdrawal, negative auth tests | HP-004 | FR-017, FR-018, FR-019, FR-055 | G3 |
| HP-008 | Opt-in encrypted snapshots, trusted enrollment, conflicts, revoke and restore | HP-003, HP-007 | FR-009, FR-010, FR-011, FR-012, FR-013, FR-014 | G2 |
| HP-009 | Adulthood transfer and explicit scoped delegation with disputed states | HP-007, HP-008 | FR-020, FR-022 | G2/G3 |
| HP-010 | Shared tokens, storage labels, screen states and accessibility test fixtures | HP-002 | FR-005, FR-015, FR-059 | G1 |
| HP-011 | Reviewed catalog schema, evidence, editor roles, expiry and source checks | HP-007 | FR-028, FR-029, FR-031 | G4 |
| HP-012 | Local explicit-interest matching, save and external handoff | HP-005, HP-011 | FR-023, FR-030, FR-032 | G4 |
| HP-013 | Goals, routines, quiet hours and reviewed non-shaming activities | HP-005, HP-011 | FR-024, FR-025, FR-026, FR-027 | G3/G4 |
| HP-014 | Privacy center, class-specific export/deletion, tombstones and retention controls | HP-007, HP-008 | FR-049, FR-050, FR-051 | G2/G3 |
| HP-015 | Transactional outbox, idempotent workers and minimal notification transport | HP-007 | FR-053, FR-054 | G4 |
| HP-016 | Verified organization portal, tenant-scoped applications and safe aggregates | HP-011, HP-014 | FR-033, FR-034, FR-035 | G4 |
| HP-017 | Adult selected-input AI gateway plus evaluation suite, no private-minor cloud input | HP-004, HP-014, HP-023 | FR-046, FR-047, FR-048 | G6 |
| HP-018 | Adult groups/report/block/appeals with real trained moderation | HP-007, HP-014, HP-023 | FR-036, FR-037, FR-038, FR-039 | G5 |
| HP-019 | Bounded adult mentor programs; supervised youth design remains separately gated | HP-018 | FR-040 | G5/G3 |
| HP-020 | Offline verified official help directory and truthful call handoff | HP-010 | FR-041, FR-042, FR-045 | G4 |
| HP-021 | Optional adult-only contact/location sessions with failure, expiry and misuse testing | HP-007, HP-015, HP-020, HP-023 | FR-043, FR-044, FR-045 | G7 |
| HP-022 | Adult billing, entitlements, quota/cost controls, cancellation/export protections | HP-007, HP-014 | FR-057, FR-063 | G4 |
| HP-023 | Least-privilege admin, telemetry scrubbing, incident runbooks, independent reviews and release evidence | HP-002 onward | FR-049, FR-052, FR-055, FR-061, FR-064 | G2/G3/G8 |
| HP-024 | Later-life onboarding, accessible delegated help and English/Telugu foundations | HP-010 | FR-021, FR-022, FR-059, FR-060 | G4 |
| HP-025 | Remote research, demand/pricing validation and transparent pilot measurement | HP-001 | FR-062 | G4 |
| HP-026 | Bolt-to-Codex clean-room handover and exact status/evidence manifest | HP-002 and completed tranche | FR-058, FR-064 | G8 |

## Work-package contract

Every implementation task records objective, non-goals, affected files, dependencies, FR/TST IDs, data classes, feature flag, design state, tests, evidence location, migration/rollback and handover. Split a task when one PR cannot be reviewed safely. Do not relabel an unmet dependency as optional to accelerate a demo.

## Critical path

HP-002 → HP-003 → HP-005/006 → HP-007/008 → HP-014/023 → gated beta. Design/catalog/research can proceed alongside the native security spike. AI/community/location are not prerequisites for the first useful product.

**Current gate note:** HP-005 may be planned only against the reviewed HP-003 interfaces. Do not treat the absence of native HP-003 evidence as G2 approval or use real private data; native device verification remains a prerequisite for G2.

## Estimation policy

No fabricated completion percentage or day estimate. Estimate after spike evidence and team capacity are known. Report artifacts actually implemented and tests actually run. A screen count is not a measure of product readiness.
