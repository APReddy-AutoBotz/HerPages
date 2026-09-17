# HP-004 Transfer Document

## Commit information

- **Current origin/main SHA:** `96893c10d240af2fd30e76cb8595eef270fc848e`
- **HP-004 commit SHA:** `ebeee2fe16e91dd59e77a51d28b3a73bae7336fc`
- **Parent SHA:** `96893c10d240af2fd30e76cb8595eef270fc848e`
- **Branch:** `feat/hp-004-lifecycle-policy`

## Changed file list

| File | Change |
|------|--------|
| `packages/contracts/src/capability.ts` | New — Zod schemas for assurance level, relationship state, adulthood-transition state, capability names, policy decision and subject types |
| `packages/contracts/src/index.ts` | Modified — exports for the new capability module |
| `packages/domain/src/index.ts` | Modified — pure state machines for relationship and adulthood transitions |
| `packages/domain/src/__tests__/domain.test.ts` | Modified — 12 state-machine tests |
| `packages/policy/src/index.ts` | Modified — fail-closed capability evaluator with never-authority field rejection |
| `packages/policy/src/__tests__/policy.test.ts` | Modified — 16 policy tests including 8 golden cases |
| `docs/06-delivery/STATUS.md` | Modified — HP-004 status recorded |
| `docs/06-delivery/BACKLOG.md` | Modified — HP-004 progress recorded |

Total: 8 files changed, 446 insertions(+), 50 deletions(-)

## Requirements covered

- **FR-015:** Visual lifecycle stages and authorization are separate. Age 17 and 18 both resolve to Horizon visual chapter but have different policy authority.
- **FR-016:** Theme never grants authority. Forged theme/client_age/client_clock/user_metadata/payer_status fields are explicitly rejected.
- **FR-039:** Adult-to-minor DM denied regardless of role (mentor or guardian).
- **FR-045:** Minor live-location denied even when a guardian toggles a client flag.
- **FR-056:** Unknown or disabled capabilities fail closed. Unknown/disputed assurance denies even with adult age.

## Tests actually run and counts

| Command | Result |
|--------|--------|
| `pnpm install --frozen-lockfile` (pnpm 8.15.9) | Pass — 702 packages installed |
| `pnpm typecheck` | Pass — all 8 packages typecheck clean |
| `pnpm test` | Pass — 74 tests total across 6 packages |
| `pnpm build` | Pass — all packages and web app built |
| `npx expo install --check` | Pass — dependencies up to date |
| `npx expo config --json --full` | Pass — valid Expo SDK 57 config |
| `npx expo-doctor` | 20/21 checks passed — 1 pre-existing baseline failure (multiple lock files: pnpm-lock.yaml + package-lock.json both present on origin/main, not introduced by HP-004) |
| `python3 scripts/validate_docs.py` | Pass — 774 files, 175 markdown, 145 JSON, 64 requirements, 64 acceptance cases |
| `python3 -m unittest discover -s scripts -p "test_*.py" -v` | Pass — 10 tests OK |

### Test breakdown by package

| Package | Tests |
|---------|-------|
| `@herpages/policy` | 16 (8 golden cases POL-01..POL-08 + 8 FR enforcement) |
| `@herpages/domain` | 12 (stage resolution + relationship/adulthood state machines) |
| `@herpages/contracts` | 7 |
| `@herpages/design-tokens` | 5 |
| `@herpages/vault-native` | 33 |
| `services/api` | 1 |
| **Total** | **74** |

## Anything not tested

- Server-side enforcement wiring (Supabase RLS, edge functions) — HP-004 delivers the portable engine and tests only; server integration is a separate task.
- UI rendering of visual lifecycle stages — HP-004 covers authority separation only, not visual chapter rendering (that is HP-010 / FR-015 visual scope).
- Real device cryptographic verification — unchanged from HP-003 status; G2 gate remains NOT PASSED.
- Expo-doctor lock-file check — pre-existing baseline failure on origin/main, not caused by HP-004.

## Confirmations

- **HP-003 crypto untouched:** `packages/vault-native/` has zero changes in the HP-004 diff. No crypto, keystore, recovery, rotation, or envelope files were modified.
- **HP-005 not started:** No Pages functionality, no Supabase tables, no edge functions, no auth flows were added or modified.
- **Synthetic data only:** All test subjects use synthetic ages, assurances, and jurisdictions. No real identities, contact numbers, school locations, or birthdays were used.

## Patch artifacts

- `hp-004-lifecycle-policy.patch` — git format-patch output for the HP-004 commit
- `hp-004-lifecycle-policy.patch.sha256` — SHA-256 checksum of the patch file
