# Async work, events and notifications

## Durable jobs

Persist a business-state update and its outbox event in one Postgres transaction. A worker claims work with a lease, performs a bounded action and records result. Delivery is at least once; handlers must be idempotent. A retry cannot reapply a consent grant, duplicate a charge, republish an expired opportunity or emit repeated safety alerts.

Envelope fields: event_id, event_type, schema_version, occurred_at, resource_ref, actor_ref where needed, policy_version, idempotency_key and minimal payload. Do not embed private Pages, keys, exact locations, images, full emails or identity evidence. Queue references point to authorized records; worker access is narrower than a universal admin account.

## Event families

`consent.withdrawn`, `relationship.suspended`, `device.revoked`, `snapshot.created`, `snapshot.finalized`, `snapshot.failed`, `catalog.review_due`, `opportunity.expired`, `deletion.requested`, `deletion.completed`, `organization.member_revoked`, `moderation.case_opened`, `entitlement.changed`. Future safety events require a separate approved contract and retention profile.

On consent withdrawal or account/role revocation, cancel relevant unsent disclosures and reevaluate in-flight work. Cache invalidation is not enough: workers check fresh policy before sending. Failed jobs enter a restricted dead-letter state with no sensitive payload in alert messages.

## Reminders

Personal routines use device-local notifications where feasible, with quiet hours, snooze and off controls. Content stays generic by default. A notification on a locked phone must not reveal that a teen is seeking a particular kind of help. Reminders are convenience features, not medication adherence or emergency monitoring.

## Push transport

APNs/FCM/optional Expo transport sees tokens and delivery metadata. Explain subprocessors in the data map. Default payload: generic event type and opaque fetch reference, not a diary excerpt, school name, location or event applicant detail. Token registration needs user permission; token association is revoked on signout or device revocation.

Distinguish `queued`, `transport_accepted`, `delivered_if_supported`, `acknowledged` and `failed`. Do not invent delivery receipts where a provider does not expose them. Deep links require a fresh authorized fetch; a notification must not expose a permanent bearer URL.

## Retry policy proposal

Exponential backoff with jitter, maximum attempts and deadline. Deadlines are operation-specific: a stale opportunity reminder should be dropped after its deadline, while a deletion job should continue under operator attention. Safety-session timing is separately designed and cannot reuse a generic marketing notification queue.

## Operations

Track aggregate queue depth, oldest job, retry count, dead letters and processing latency. Redact identifiers from public dashboards. A runbook explains pause, replay, poison-message isolation and audit. Test worker crash after external send but before acknowledgement to prove deduplication behavior.
