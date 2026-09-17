# Integration register and adapter contracts

No production integration is connected by this documentation. Each adapter needs owner, purpose, fields, region, retention, auth, rate limits, failure behavior, contract tests and approval evidence.

| Integration | Proposed use | Data allowed | Release condition |
|---|---|---|---|
| Supabase Auth/Postgres/Storage | Minimal accounts, policy state, catalog, encrypted backups | Service-private records; ciphertext only for vault | RLS, region/subprocessor and restore review |
| OS Keychain/Keystore | Device bootstrap/wrapping secrets | Small secrets under native access controls | Real-device compatibility and recovery tests |
| APNs/FCM | Optional generic notifications | Token and minimal event metadata | Permission, privacy and delivery-failure tests |
| Age/guardian assurance provider | Appropriate assurance and consent evidence | Minimum approved identity/relationship proof | Vendor and counsel approval; no raw document hoarding |
| AI provider | Bounded adult selected-content assistance | Only approved explicit selections | DPA, retention, model eval, budget and UI disclosure |
| Official safety resources | Dialer handoff and information | No data transfer to an imaginary API | Verify number/source/country; no claimed partnership |
| Opportunity sites | Explicit external application | Only what user chooses on that destination | Source/domain checks; minors' handoff gate |
| App stores | Distribution, receipts, age/audience declarations | Required account/billing data | Store policy review and truthful privacy labels |
| Web billing provider | Later organization subscription | Minimum billing data | Separate agreement and entitlement tests |
| Analytics/crash tooling | Redacted product reliability | No content, keys or child behavior stream | Processor review; scrubbing and payload tests |

## No assumed access

A public website does not imply an API, a partnership, permission to scrape, permission to republish content or permission to send personal information. Do not infer police/helpline API integration from the existence of 112. Do not infer verified employer status from a logo. [S10]

## Partner webhook rules

Verify signatures and timestamp/replay windows, use idempotency keys and map to allowed state transitions. External systems cannot assign local roles or declare a person adult through unverified payloads. Quarantine malformed payloads without logging their full content. Retry safely and expose delayed statuses rather than claiming completion.

## Service portability

Keep business rules out of vendor dashboard-only configuration. Export schemas, policy revisions, provider settings (without secrets), queue semantics and entitlement mapping. A provider replacement must not cause the server to start decrypting vaults. Every region change triggers the cross-border/notice review.
