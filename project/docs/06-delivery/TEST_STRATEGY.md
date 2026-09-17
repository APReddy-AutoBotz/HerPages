# Test strategy and verification matrix

`test-cases.json` contains acceptance specifications, not executable app tests. `scripts/validate_docs.py` checks their traceability and documentation consistency. Application tests are implemented alongside backlog tasks.

## Test layers

| Layer | Tools/direction | What it proves |
|---|---|---|
| Document/contract consistency | Python standard-library validator | References, schema syntax, stage boundaries, contrast pairs and traceability |
| Pure domain unit | Vitest | Date/policy rules, local matching, recurrence, serialization |
| Component | React Native Testing Library / web component tools | States, labels, accessible actions; not native encryption |
| API integration | Fastify test harness + isolated Postgres/Supabase | Auth, RLS, tenant scope, consent withdrawal, idempotency |
| Native end-to-end | Maestro or Detox after compatibility spike | Real app flows on iOS/Android, permissions, offline and lifecycle behavior |
| Storage/crypto | Native harness + expert inspection | File encryption, keys, tampering, restore, rotation and downgrade behavior |
| Accessibility | VoiceOver, TalkBack, keyboard, large text, contrast checks | Usability across assistive modes and ages |
| Abuse/security | Authorized penetration/abuse tests | Cross-role attacks, unsafe contact, SSRF, logs, data leakage |
| AI | Versioned held-out evaluation suite | Grounding, privacy, refusal boundaries and safe failures |
| Operations | Recovery/incident/deletion table-top and drills | Team's ability to handle failure, not just software happy paths |

## Required fixture boundaries

Ages 5, 8, 12, 13, 15, 17, 18, 19, 35, 36, 49, 50, 64, 65, 72 and unknown; leap-day birthday; device time manipulation; adult with child-looking theme; minor with adult-looking theme; guardian with revoked relationship; organization A/B; trusted/revoked/new device; payer who is not owner; moderator without case assignment.

Every fixture is synthetic and labeled. Avoid real names/contact numbers/schools or copied diaries. Do not assume a profile with `age:18` is a verified adult; assurance state is separate.

## Security-critical suites

Capture network traffic and inspect native files/OS backups after capture, search, media import, crash, backup and AI refusal. Test clean-device recovery where old keys are absent. Simulate server key substitution and snapshot rollback. Test stale JWT, deleted account, withdrawn consent, revoked organization membership and changed age before queued execution.

At adulthood, verify old guardian credentials cannot obtain new data and old keys cannot decrypt new epochs; acknowledge that historical copied data persists. In community tests, minors cannot enter adult DM routes even by calling APIs directly. Safety tests cannot equate provider acknowledgement with help received.

## Performance and accessibility

Use documented reference hardware/datasets/networks and the NFR targets. Screen-reader and large-text tests cover recovery, consent and report flows, not only the home screen. Native background restrictions require physical-device tests. Include low storage, poor connectivity, interrupted uploads and denied permissions.

## Evidence

Each test run stores suite version, commit/build, environment, fixture IDs, expected/actual, result, sanitized artifacts and defects. No private text in CI logs or screenshots. Mark unavailable tests not run. Test-plan completeness is not test execution.

## CI progression

R0 runs document checks only. R1 adds lint/type/unit/component. R2 adds isolated API/RLS and scheduled native suites. Release gates include manual/expert checks not expressible as CI. Pin actions and dependencies; never run untrusted fork code with production secrets or use `pull_request_target` to execute contributor code.
