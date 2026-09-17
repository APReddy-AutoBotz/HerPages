# Logical data model and authorization design

This is a logical schema specification, not an applied migration. Physical migrations are created only after the storage/crypto spikes and are reviewed with the access tests. Use UUIDs/opaque IDs, UTC timestamps for events, civil dates for birthdays, explicit status enums and schema versions.

## 1. Local encrypted model

| Entity | Important fields | Rules |
|---|---|---|
| vault_meta | vault_id, schema_version, key_epoch, created_at, last_snapshot_seq | No raw root key field; one active writer in first backup release |
| subjects_local | subject_id, display_name, optional birth_date, chosen_theme | Exact birthday remains local unless assurance legally needs it; theme is not authorization |
| collections | collection_id, subject_id, kind, owner_context, key_epoch | Kind: personal, child_history, parent_private, family_shared; no automatic universal family visibility |
| pages | page_id, collection_id, title, body, occurred_on, revision, created_at, updated_at, deleted_at | Local encrypted text and search; no cloud mirror of body/title |
| media | media_id, page_id, encrypted_path, content_hash, wrapped_file_key, mime_type, byte_length | File bytes encrypted; no public URLs or EXIF location in a shared derivative |
| interests | interest_id, subject_id, taxonomy_id, user_label, selected_at | Explicit choice; local only in baseline |
| goals | goal_id, subject_id, text, status, optional target_date | No inferred rank or diagnosis |
| routines | routine_id, recurrence_rule, timezone, enabled, quiet_hours | Local notification plan; missed reminders are not misconduct |
| routine_events | event_id, routine_id, occurrence_key, user_status | Unique occurrence key prevents duplicate completions |
| saved_opportunities | opportunity_id, catalog_revision, saved_at, local_note | Source metadata may be cached; private notes stay local |
| local_outbox | operation_id, type, encrypted_payload, state | Sensitive payloads remain encrypted; do not create generic plaintext sync log |
| recovery_receipts_local | method, created_at, last_verified_at | No secret in a human-readable receipt |

SQLite foreign keys, transactions and parameterized queries are required. Local migrations run against encrypted storage and produce recoverable checkpoints. Soft-deleted records are removed after the applicable local policy; secure deletion on flash storage has limitations, so key destruction and OS protection complement deletion.

## 2. Service-private model

| Entity | Important fields | Access / invariants |
|---|---|---|
| principals | id linked to auth identity, account_status, jurisdiction, created_at | Self-read limited fields; status changes through privileged workflow |
| policy_subjects | id, principal_id nullable, assurance_status, adult_status, next_transition_at, policy_version | No public DOB; only approved assurance service changes status |
| relationships | id, actor_id, subject_id, role, state, starts_at, expires_at, evidence_ref | Active, purpose-scoped grant; uniqueness prevents duplicate active identical grants |
| consents | id, actor_id, subject_id, purpose, notice_version, policy_version, evidence_ref, granted_at, withdrawn_at | Append-only receipts plus current projection; withdrawal not overwritten |
| devices | device_id, principal_id, public_key_ref, enrollment_state, revoked_at | Public keys only; untrusted key replacement must not enroll itself |
| vaults | vault_id, owner_principal_id, subject_id, status, current_sequence | Opaque cloud metadata; no plaintext name, body, tags or interests |
| vault_grants | id, vault_id, recipient_device_id, epoch, wrapped_key_ref, status | Grant through authenticated trusted device; service cannot derive key |
| snapshots | snapshot_id, vault_id, sequence, parent_id, encrypted_manifest_ref, state, bytes, created_at | Unique vault+sequence; finalization CAS; no completion before all objects exist |
| snapshot_objects | snapshot_id, opaque_object_id, ciphertext_sha256, byte_length | Hash ciphertext, not low-entropy plaintext; scoped storage prefix |
| deletion_jobs | request_id, actor_id, class, status, hold_reason, completed_at | Authorization and legal holds rechecked; retries idempotent |
| entitlements | id, payer_principal_id, beneficiary_ref, provider, receipt_ref, state, expiry | Billing beneficiary is not vault ownership |
| notification_tokens | id, principal_id, device_id, encrypted_token, purpose, revoked_at | Private; delete/revoke on signout and account deletion as appropriate |
| audit_events | event_id, actor_ref, action_code, resource_ref, result, policy_version, occurred_at | Redacted metadata; no vault content or full request bodies |

Birth-date proof, guardian verification and identity evidence are high-risk. Prefer an auditable provider reference/attestation over retaining a raw identity document. The precise data needed and retention are open legal/security decisions, not permission to store everything.

## 3. Catalog and organization model

`organizations(id,name,verification_state,contact_ref)`; `org_memberships(org_id,principal_id,role,status)`; `opportunities(id,org_id,title,category,eligibility,source_url,application_url,deadline,timezone,review_state,verified_at,next_review_at)`; `content_items(id,type,locale,age_suitability,body,source_refs,reviewer,version,state)`; `catalog_revisions(id,published_at,digest)`; `applications(id,program_id,applicant_ref,consent_id,state,retention_until)`; `application_fields(application_id,field_name,value_class,encrypted_value)`.

A partner cannot read non-applicants. Different organization IDs must be checked in every read/export/update, not merely filtered in the UI. Public catalog data excludes internal review evidence and applicant information. Source URL retrieval must pass SSRF and domain controls in the ingestion worker.

## 4. Connected community model — gated

`groups`, `memberships`, `posts`, `post_revisions`, `reports`, `moderation_cases`, `case_assignments`, `decisions`, `appeals`, `blocks`. Adult eligibility is checked on join/post/read as applicable. Minor cohorts are separate policy domains and disabled. Public/private-group visibility is explicit. Report access is narrower than general moderation access; no cross-case search of intimate disclosures.

## 5. Constraints and indexes

Use foreign keys and constrained state transitions. Index `(owner_principal_id,status)`, `(vault_id,sequence)`, `(actor_id,subject_id,state)`, `(org_id,review_state,deadline)`, `(subject_id,purpose,withdrawn_at)` and `(outbox_state,next_attempt_at)` according to query plans. Paginate by stable cursor, not unbounded offsets. Avoid indexing exact sensitive values centrally when the server does not need them.

## 6. RLS policy intent

| Resource | Read | Write |
|---|---|---|
| Published catalog projection | Public or approved service client | Editor via reviewed workflow |
| Own service profile | Active authenticated owner | Allowlisted fields only; not authority |
| Relationship/age state | Involved principal with redacted evidence | Approved assurance command only |
| Consent receipt | Relevant principal/authorized narrow reviewer | Purpose-specific append/withdraw command |
| Vault metadata/objects | Current owner or active device grant | Scope+epoch+current policy; revoked devices denied |
| Organization applications | Authorized staff in that exact org/program | Applicant-approved submission/review roles |
| Moderation cases | Assigned authorized reviewer | Audited state machine |
| Private journal | No cloud table | No cloud table |

Enable RLS on every exposed table; explicit grants and policies are both needed. No `USING (true)` on personal records. Avoid user-editable metadata for auth. Views use security-invoker semantics where supported; functions have restricted execute permissions and safe search paths. Test table, view, RPC and storage routes, including elevated-backend behavior. [S07]

## 7. Deletion and backups

A tombstone prevents restored service backups from resurrecting deleted users or grants. Object deletion is separate from row deletion. Revoke access immediately where policy allows, then process actual deletion with evidence and legal-hold handling. Retention is set per class; see privacy/legal register before promising a deadline.
