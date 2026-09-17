# Privacy architecture and data lifecycle

**Status:** product requirements, not a published privacy notice or compliance certification. **Principle:** collect and disclose less; make every boundary understandable. Primary legal sources and commencement limitations are in `LEGAL_REGISTER.md` and `../07-reference/SOURCES.md`.

## Data inventory

| Class | Examples | Default location | Who can read it | Retention principle |
|---|---|---|---|---|
| P0: device secret | Bootstrap key, recovery material | OS-backed device secret storage / user-held recovery copy | Authorized device/user; never staff | Until replaced or destroyed; recovery consequences explained |
| P1: intimate local | Pages, photos, goals, reflections, exact local birthday | Encrypted native database/files | Person with authorized device/key | User controlled; deletion and encrypted export supported |
| P2: encrypted backup | Ciphertext objects and encrypted manifest | Optional private cloud object storage | Authorized devices with keys; service sees ciphertext/metadata | Explicit backup policy, quotas and user deletion; legal review of relevant logs |
| P3: service private | Account, consent, age-assurance state, device grants, billing | Restricted cloud service | User and purpose-limited staff/services | Purpose-specific schedule, legal holds and minimization |
| P4: intentionally connected | Group posts, applications, program registrations | Cloud, with declared visibility | Approved audience; relevant moderators/partner roles | User notice, program purpose and safeguarding obligations |
| P5: temporary safety | Future adult location session, contact acknowledgements | Separate expiring store, if released | Explicit contacts and narrowly scoped service | Short purpose-bound lifetime subject to approved legal schedule |
| P6: operational evidence | Redacted security logs, consent receipts, moderation decisions | Restricted audit stores | Assigned operations/security/privacy roles | Applicable legal minimums and documented maximums |

Not all cloud data is public. Not all encrypted data is end-to-end encrypted. Service encryption at rest does not prevent the service from reading P3/P4. For P2 the proposed server has no vault decryption key, but sees object sizes, timing, account associations and transport metadata.

## Collection and processing rules

An adult personal vault can operate locally without a cloud account. Do not assume that processing a child's data is exempt from all obligations because it is local. Real child profiles remain gated by the reviewed legal basis, notices, guardian assurance and age-appropriate design.

Collect only the fields needed for a capability. The theme engine needs local stage choice, not centrally stored birth certificates. Opportunity discovery does not require a residential address, school schedule, diary, health history or contact book. Service age assurance should retain a minimal attestation/reference rather than a default copy of identification. Exact implementation needs a qualified privacy review.

No hidden analytics SDK, session replay, advertising identifier, contact upload, user-text crash breadcrumb or screen recording. Opt-in adult research is separate from baseline operational telemetry. A crash screenshot can contain private text; disable it in the vault.

## Explicit disclosure boundaries

Before sharing, display: exact items, recipient, purpose, whether the service/recipient can read them, persistence, and what revocation cannot undo. 'Encrypted backup' is different from 'Send to AI'. Cloud AI processing temporarily exposes selected plaintext to the approved service/provider; do not describe that request as end-to-end private from that provider.

Private search and routine calculation occur locally. Cloud search indexes only catalog or deliberately connected content. Never derive server-side embeddings, personality profiles or sensitive labels from private Pages.

## Device hygiene

Encrypt attachments, thumbnails, WAL/journal files and intermediate exports. Exclude sensitive plaintext from OS/cloud backup paths; test actual Android/iOS behavior. A photo imported from a camera roll may still exist unencrypted in the user's photo library or its own cloud backup; explain that HerPages cannot erase external copies. Remove location EXIF from shared derivatives unless explicitly needed and authorized. Mask recent-app previews on sensitive screens where supported. Clipboard, keyboard dictation and accessibility services have their own trust boundaries; do not promise they are controlled by vault encryption.

## Retention design — pending legal sign-off

Use a versioned schedule per class, purpose and jurisdiction. Proposed product targets: incomplete upload objects expire after a bounded cleanup window; expired safety-session application data is deleted rapidly; unneeded identity images are not retained; private user content follows the user's chosen storage mode. These are design aims, not legal guarantees.

Security/processing logs may have statutory requirements. CERT-In directions include retention requirements for applicable entities, and DPDP Rules include future-effective provisions relevant to retention/security. Do not turn those requirements into blanket retention of diaries or location history. Counsel must resolve which records, entities, periods and legal holds apply before a real-data launch. [S02, S13, S25]

Store an explicit `retention_until` or policy reference where appropriate, run deletion jobs, audit outcomes and test object deletion separately from row deletion. Backups require deletion tombstones reapplied before restoration to prevent resurrection. Document the time until encrypted objects disappear from service backups and distinguish that from immediate access revocation.

## Rights and withdrawal

Provide accessible export, deletion, consent withdrawal, correction and grievance channels consistent with the applicable legal regime. Withdrawal affects future processing and queued disclosures; it does not erase legally required evidence or another recipient's saved copy. A failed payment cannot block export or delete a vault without prior notice and a recovery path.

Account deletion and local-vault destruction are different actions. Account authentication recovery does not recover encryption keys. The UI must explain each separately and allow an explicit local-only continuation when technically possible.

## Staff and partner access

Support sees minimum account/diagnostic metadata. Editors see content evidence. Moderators see assigned connected-content reports. Partners see their own intentional applications. No role has a private-vault browsing tool. Privileged access is time-bound, logged and reviewed; an administrator cannot manufacture the key that decrypts P2.

## Residency and processors

Document each processor's actual fields, region, backups, logging, subprocessors and access routes. Selecting an India database region is not proof all data remains in India. Push, auth emails, CDN, builds, telemetry, AI and support need separate assessment. No new processor can be added by a coding agent without review.

## Privacy impact review

Before each gated release, record purpose, necessity, data flow, affected people, foreseeable harms, alternative designs, safeguards, residual risk, reviewer and decision. Required scenarios include a coercive guardian/partner, lost phone, compromised staff account, mistaken age, key loss, public screenshot, minor disclosure in an application and deceptive organizer. Approval is an evidence record, not a checkbox generated by AI.
