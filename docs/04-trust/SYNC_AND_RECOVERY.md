# Backup, synchronization and recovery protocol

## Scope

The first connected vault feature is **single-writer versioned encrypted backup**, not automatic real-time multi-device editing. Live synchronization and family collaboration require later protocol design. Public catalogs can be cached independently because they do not contain private vault state.

## Snapshot state machine

`local_dirty → preparing → encrypted → uploading → awaiting_finalize → finalized`, with `failed`, `conflict` and `abandoned` states.

1. Create a consistent local database export/checkpoint under the reviewed encryption design.
2. Assign a random snapshot ID, next sequence and expected parent snapshot.
3. Encrypt manifest and objects on device; calculate ciphertext digests.
4. Ask the API for scoped upload grants after fresh authorization.
5. Upload bounded chunks. Resume using object IDs/digests; never resend plaintext.
6. Finalize with compare-and-swap on the expected server head.
7. Server verifies object presence, bounds and ciphertext digests; it cannot verify semantic plaintext correctness.
8. Client records finalized receipt and optionally performs a test restore/integrity check.

'Uploaded' is not 'restorable'. Show last complete backup and whether recovery was tested. Partial snapshots cannot be advertised as complete.

## Conflict rules

Two writers cannot overwrite a head silently. If device B finalizes against an old parent, return conflict and preserve both encrypted branches. The user chooses a recovery/merge flow on an authorized device. Never last-write-wins a consent, role, key grant or deletion request. A selected writer lease helps avoid accidental conflicts but is not a security boundary without server enforcement.

For future live sync, specify record revisions, tombstones, causal ordering and merge rules. Text merges require user review; attachment duplication is preferable to silent loss. Do not introduce a generic plaintext replication library to save implementation time.

## Restore workflow

Account login retrieves metadata, not decrypted history. Obtain keys from a trusted device or user-held recovery method. Download an authorized complete snapshot, authenticate every envelope, reject unsupported versions and restore into a new encrypted database. Run structural validation and verify record/media counts before replacing the current database. Keep a recoverable checkpoint until the new store is confirmed.

Test a clean new device, not only logout/login on a phone that still has keys. iOS keychain persistence can make an inadequate test appear successful. Android uninstall and OS backup behavior must be exercised. [S04]

## Failure matrix

| Failure | Required behavior |
|---|---|
| Offline/cloud outage | Continue local operations; show backup pending; do not remove existing data |
| Storage quota reached | Explain quota; preserve local data/export; no destructive cleanup without notice |
| Upload interrupted | Resume encrypted objects with digest validation; expire abandoned temporary objects |
| Wrong recovery material | Fail without partial plaintext import; rate-limit online attempts without pretending to stop offline attacks |
| Tampered object/manifest | Reject snapshot; retain known-good database; surface integrity failure |
| Lost all keys and trusted devices | Explain unrecoverability; allow new empty vault with explicit separation |
| Revoked device | Deny fresh metadata/object grants; disclose limitations for existing offline copies |
| Stale server snapshot | Compare known trusted head/sequence; warn on rollback when detectable |
| New device has no trusted head | Acknowledge that rollback detection is limited without an external trusted anchor |
| Schema migration interrupted | Resume or revert to encrypted checkpoint; do not open as plaintext |
| Deletion followed by service restore | Reapply deletion/revocation tombstones before reconnecting restored services |

## Retention and portability

Snapshot retention is user-visible and subject to verified storage costs and legal schedules. A subscription lapse permits export and a notified transition; no instant destruction. Portable archive includes version, crypto profile, required metadata and recovery instructions, but never publishes secrets. Run cross-version restore tests before changing the format.

A business-continuity plan must allow local exports if the service is discontinued. Cloud availability is not a lifetime promise; a documented archive format helps the user outlive the service.
