# Threat model and abuse-risk register

**Method:** assets, actors, trust boundaries, misuse cases and evidence requirements. **Status:** preliminary design review; not penetration testing.

## Assets and actors

Protect private Pages/media, encryption/recovery material, child identity/relationship data, community safety, opportunity applications, precise location, payment entitlements and release-signing credentials. Threat actors include strangers, coercive guardians/partners, malicious users/mentors/organizers, compromised employees, cloud attackers, malicious dependencies, a compromised build publisher and a lost/unlocked device holder. Honest mistakes are also threats.

## Trust boundaries

Device locked/unlocked; app/OS keyboard and photo library; local vault/cloud metadata; encrypted backup/server storage; account login/vault keys; guardian/daughter; child/adult; organization A/B; community/private Pages; editor/moderator/support; cloud AI; push/SMS; build/release systems.

| ID | Threat | Required prevention/detection | Validation / residual risk |
|---|---|---|---|
| TH-01 | Cloud storage disclosure | Client encryption, private bucket, scoped grants | Inspect network/objects; metadata remains visible |
| TH-02 | Plaintext files/cache/WAL | Encrypt all native persistence and temp paths | Release-build filesystem/backup inspection |
| TH-03 | Unlocked device compromise | OS lock, reauth, minimal memory lifetime, preview masking | Cannot guarantee protection from malware/coercion |
| TH-04 | Account reset decrypts vault | Separate key recovery; trusted enrollment | Reset account on clean device must not decrypt |
| TH-05 | Server substitutes recipient key | Authenticated device verification and key-change warning | Malicious-server test; protocol review needed |
| TH-06 | Old device keeps access | Revoke grants/tokens, rotate future keys | Deny fresh reads; old copies remain outside recall |
| TH-07 | Snapshot overwrite/rollback | Immutable sequences, CAS, trusted head checks | Concurrent heads/tampering; new-device anchor limitation |
| TH-08 | Fake guardian or age | Approved assurance, server-owned status, disputes | Forged DOB/metadata/self-approval tests |
| TH-09 | Parent retains adult authority | Independent adulthood workflow and scoped collections | Age17/18, stalled transfer, stale token tests |
| TH-10 | Cross-tenant partner leak | RLS + fresh API tenant/capability checks | Read/update/export with another organization's IDs |
| TH-11 | Service role bypass | Narrow privileged adapters; invoker policies | Test actual backend route, not only database client |
| TH-12 | Insider reads intimate data | No server plaintext/key, least privilege | Admin attempts; a malicious client release remains risk |
| TH-13 | Child grooming/age mixing | No open minor discovery/DM; closed cohort gates | Adversarial message/link patterns and report confidentiality |
| TH-14 | Fake opportunity/scam | Source checks, reviewed publication, takedown | Redirect/domain/fee change fixtures |
| TH-15 | Prompt injection/data exfiltration | Treat sources as data, no arbitrary tools, explicit selections | Malicious catalog/PDF/text evaluation |
| TH-16 | Sensitive push/crash data | Generic payloads, content scrubbing, no screenshots | Capture transport/logs in synthetic scenarios |
| TH-17 | Covert location/control | Explicit adult sessions, expiry, no remote-start | Coercive-contact and stale-session tests |
| TH-18 | Unsafe 'help delivered' claim | Evidence-based state names, visible failures | Provider accepts but contact never receives |
| TH-19 | Deletion resurrection | Tombstones, object cleanup, restore reconciliation | Restore old service backup after deletion |
| TH-20 | Malicious release/dependency | Protected release workflow, pinned dependencies, review/SBOM | Build provenance review; signing alone is insufficient |
| TH-21 | Unauthorized URL/file processing | SSRF guards, type/size limits, quarantine | Internal-IP redirects, zip bombs, oversized files |
| TH-22 | Small cohort re-identification | Aggregate suppression and purpose limits | Queries producing identifiable small cells |
| TH-23 | Billing used as authority | Separate payer/beneficiary/access | Paying parent cannot read adult daughter's vault |
| TH-24 | Recovery inaccessible to older user | Accessible instructions, restore rehearsal, scoped help | Screen reader/large text tests, no helper master key |

## Severity and release handling

Rate impact and likelihood with a recorded rationale; do not average a critical privacy breach into a favorable score. Unauthorized vault disclosure, child contact bypass, role escalation, irrecoverable migration loss and deceptive safety confirmations are stop-ship for the affected release. Assign owner, remediation and proof to each accepted risk.

## Verification plan

Use synthetic fixtures, consented test devices and authorized environments. Separate design review, automated tests, manual native inspection, abuse simulation and independent penetration/crypto review. Run at least one recovery, breach and moderation-capacity tabletop before their features launch. Record actual findings in private security systems; publish only sanitized summaries and status.
