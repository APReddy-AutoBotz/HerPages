# Safety assistance: truthful scope and failure design

## Initial release

Provide a verified offline-capable official help directory, including India's 112 emergency resource and appropriate jurisdiction-specific information after verification. A call action opens the device dialer or supported OS calling flow. This is not a dispatch API and does not establish a police partnership. No promise of police arrival within minutes, universal network coverage or guaranteed assistance. [S10]

The directory works without login or payment. Keep country, source, last verified date and next review date. Expired/unverified numbers require review; do not generate helplines with an LLM. Offline app access does not mean a phone can place a call without cellular/network availability.

## Future trusted-contact sessions — adults only, separately gated

A user explicitly chooses contacts, duration and what information to share. Confirm contact ownership/acceptance, not merely an entered number. Start/stop controls are visible. No contact can remotely start surveillance. Precise location is not collected before permission and session start. A session expires and defaults to no background tracking.

Choose a reviewed transport model: encrypted contact-to-contact data where feasible versus server-readable relay when necessary. Document which recipients/processors can read coordinates. An SMS fallback is not end-to-end encrypted; require disclosure and explicit configuration. No sensitive coordinate in generic push payloads or public URLs. Do not upload an entire contact book.

## State model

`inactive → permission_check → active → check_in_due → awaiting_response → contacts_notified → acknowledged → completed/expired`, plus `failed`, `canceled` and `degraded` states.

The state machine must not confuse transport acceptance with a human acknowledgement. A contact acknowledging a message is not a rescue. Show stale location timestamps and approximate accuracy when available. No false green 'safe' status solely because a timer ended.

## Failure cases

GPS disabled; approximate-only permission; OS kills background process; battery saver; phone off; app removed; no data/cellular; push denied; token revoked; contact asleep; SMS failure; server outage; wrong country; duplicated retry; abuser controls a contact; user travels across time zones. Each has user-visible limitations and bounded retries. The app cannot solve all these conditions.

## Child restrictions

Live location for minors is off. Do not assume a safety exception authorizes all guardian tracking. A separate necessity, legal, safeguarding and coercion analysis must precede any design change. Public group, event or mentor features never reveal a minor's live location, school schedule or home address.

## Privacy and retention

Treat session data as its own sensitive class with short reviewed retention, restricted access and deletion jobs. Security logs may need different legal retention; store minimal metadata rather than precise histories where possible. Do not market 'nothing is stored' before verifying all transport/provider logs.

## Release evidence

Physical-device tests under poor networks/background restrictions; verified official resources; user comprehension of limitations; contact-consent tests; misuse/red-team review; staffed incident process; and legal approval. Safety remains a support capability, not a substitute for local emergency services or professional safeguarding.
