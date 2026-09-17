# API contracts and trust boundaries

`openapi.json` is the machine-readable baseline for core connected routes. It is a design contract with a reserved `.invalid` server, not a reachable API. Connected-community, billing and safety APIs are intentionally withheld from public enablement until their gates and later contracts pass.

## Protocol conventions

Prefix `/v1`. JSON requests use UTF-8. Authenticate with verified short-lived tokens over TLS. Each request carries a correlation ID generated without personal content. Sensitive commands require fresh session/step-up checks, current database authority and feature-gate evaluation. Verify issuer, audience, expiration and signature; never decode a JWT and trust its content without verification.

Use UTC RFC3339 timestamps and explicit deadline time zones. Opaque cursor pagination has a bounded page size. UUID resource IDs do not replace authorization. Idempotency keys are required on commands that create side effects; bind key to actor, route and request-body digest. A reused key with a different request returns conflict.

## Error contract

Return `code`, human-safe `message`, `request_id`, optional `retry_after_seconds` and allowlisted field errors. Never echo a key, diary excerpt, identity document or provider prompt. Standard codes include UNAUTHENTICATED, FORBIDDEN, ASSURANCE_REQUIRED, CONSENT_REQUIRED, FEATURE_DISABLED, VALIDATION_ERROR, CONFLICT, RATE_LIMITED, DEPENDENCY_UNAVAILABLE and INTEGRITY_FAILURE. Avoid revealing whether a forbidden resource belongs to another user; use consistent not-found/denial behavior.

## Core command semantics

`GET /v1/catalog/opportunities`: only published, reviewed metadata. Coarse public filtering; baseline personal matching stays local. `GET /v1/me/capabilities`: current versioned capability response with expiry; a client cache cannot authorize a server action.

`POST /v1/consents`: records a purpose-specific receipt after approved assurance and correct actor-subject authority. It is not a bypass for creating a guardian relationship. `POST /v1/consents/{id}/withdraw`: reevaluates dependent grants and queued disclosures, without deleting evidence needed for lawful audit.

`POST /v1/vaults/{id}/snapshots`: establishes a draft against expected parent sequence and actor device. `POST /v1/vaults/{id}/snapshots/{snapshotId}/upload-grants`: issues bounded object-path/content-type/size grants; stores no plaintext content. `POST .../finalize`: validates object existence, ciphertext digest and expected head atomically. `GET .../snapshots`: authorized metadata only. Download grants require current device authority.

`POST /v1/devices/{id}/revoke`: fresh-auth operation; invalidates future grants and refresh/session routes as designed. It cannot erase an offline device or recipient copy. `POST /v1/privacy/deletions`: purpose-aware workflow with separate receipt, state and hold information.

`POST /v1/organizations/{id}/opportunities`: tenant-scoped draft only. `POST /v1/opportunities/{id}/publish`: editor authorization plus review state; organization authors cannot self-approve.

`POST /v1/ai/requests`: off by default; adult-only explicit selected disclosure, bounded purpose and approved provider. It must reject a request before forwarding content when eligibility, consent or budget fails. The response states sources and uncertainty; it never grants a permission or triggers an application.

## Network boundary protections

No private vault page CRUD on the server. No arbitrary URL-fetch proxy. Ingestion uses allowlisted protocols, DNS/IP checks, redirect limits and file-size/time limits. Reject loopback/private network destinations, unsupported media and zip bombs. User uploads are quarantined only for connected-content flows; encrypted vault blobs cannot be meaningfully scanned as plaintext by the server.

## Concurrency and versioning

Use `expected_version`/`expected_sequence` for sensitive updates. On conflict, preserve both versions and require explicit resolution. Minor additive API changes keep compatibility; changed privacy semantics or crypto format require version/gate updates. Clients below a minimum secure version can be denied connected service access while preserving local export.

## Contract tests

Test token expiry, forged actor IDs, cross-tenant IDs, revoked device, changed consent between queue/execute, duplicate idempotency key, omitted expected version, oversized blobs, corrupted cipher manifest and disabled features. Validate request/response schemas both client-side and server-side. Contract validation alone does not prove encryption or correct business authorization.
