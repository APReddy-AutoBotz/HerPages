# User journeys and service blueprints

## J-01: Private first Page

**Actor:** adult woman, including someone joining at 67. **Trigger:** install. **Success:** one encrypted Page saved offline.

1. Select personal mode and readable text size. Choose a visual chapter or skip age styling.
2. Explain local storage, optional backup and loss risk using a brief comparison.
3. Initialize the native vault and key; detect missing secure-storage support.
4. Write or dictate a short Page. Dictation must disclose whether the OS/provider sends audio off device; it is not automatically private.
5. Save locally and display 'On this device'. Search works offline.
6. Offer, but do not force, a tested encrypted recovery/export step.

**Failures:** insufficient storage; interrupted save; secure key unavailable; biometric changes; app killed while media encryption runs. Preserve the last valid transaction, show recoverable status and never persist a plaintext temporary fallback.

## J-02: Parent starts her daughter's history

**Actor:** authorized guardian of any gender. **Precondition:** child-processing legal and safeguarding gates passed.

Guardian verifies adult status and relationship through the approved process, reviews purpose-specific notices, then creates a child-history collection. Child data is not collected beforehand through a hidden onboarding analytics SDK. The guardian chooses an activity and records a milestone. Parent-private reflections are separate. A child participation invitation is not enabled merely because a birth date was entered.

**Failures:** guardian cannot verify; relationship disputed; consent withdrawn; parent loses device. Provide a neutral explanation and non-personal demo. Do not ask support staff to inspect intimate vault content to resolve identity.

## J-03: Weekly shared activity

**Actor:** parent and participating child in a reviewed pilot. Select from reviewed activities matched locally to an explicitly chosen interest. Explain why an item is suggested. Child can change the activity, skip it or describe a different interest. Completion is not sent to sponsors. The parent sees only agreed shared items; do not claim confidentiality beyond the reviewed permissions and actual encryption design.

## J-04: Find and save an opportunity

**Actor:** adult or approved assisted minor flow. Browse a general catalog, filter locally, inspect evidence and deadline, then save locally. Before opening an external application, show organization identity, destination domain and what the user may disclose there. For minors, use required guardian gates. HerPages records no submission unless an integrated application receipt actually exists.

**Failures:** listing expired; page unavailable; ambiguous age criteria; changed fee; suspicious organizer. Hide actionable CTA when unverified, flag to editorial and preserve the source timestamp.

## J-05: New device recovery

**Actor:** adult or authorized guardian. Account sign-in restores only service metadata. An existing trusted device or the user's recovery material unlocks the encrypted backup. Show backup age and devices. Restore into a new encrypted database, verify integrity and sample records, then finalize device enrollment. Never replace a good local database with a partially decrypted backup.

**Failures:** wrong recovery material; tampering; revoked device; unsupported schema; account unavailable; no backup. Explain which item is missing. The user can start a new empty vault without pretending the old one has been recovered.

## J-06: Her Pages become independently controlled

At legal adulthood, offer independence setup separately from theme changes. Fresh assurance and authentication establish an independent account. Preview proposed collections, distinguish family/parent records and obtain required transfer approval. Transfer approved content on an authorized device; rotate future keys and revoke old grants. The adult explicitly chooses any continuing family share. Test stale tokens and offline old devices. Never send a parent's recovery key to an adult daughter's email as a shortcut.

## J-07: Adult woman joins a community

**Preconditions:** adult eligibility and staffed moderation gates passed. User sees community rules and actual moderation visibility, chooses a display name and an approved group. No journal content is imported. Posts have a preview and reporting/blocking controls. A removed post has a reason and appeal route. Quiet hours and notification limits are respected.

## J-08: Mentor after 50

A 56-year-old chooses to offer expertise, not because of her age but her preference. Verification describes exactly what was checked. Programs define scope, availability and boundaries. Adult mentees request a bounded session. Any later minor program uses supervised cohorts and separate safeguards. A badge does not imply police clearance or guarantee safe behavior.

## J-09: Official help while offline

User opens Safety & Help without an account. Cached country-specific resources show the last verification date. A call button hands off to the phone dialer; the app does not mark help as dispatched. No subscription or AI response stands between the user and official resources. Offline app use does not imply cellular calling will work without a network.

## J-10: Organization publishes an opportunity

An organization administrator authenticates with MFA, verifies organization details and adds a draft with eligibility and source evidence. An editor approves it. The service publishes catalog metadata, not a target list of girls. Users apply intentionally. Organization users can access only consented applications to their own program. An overdue review auto-suspends the listing.

## J-11: Deletion and subscription cancellation

Cancellation stops renewal, not ownership. The user can export and choose local-only operation. Deletion separately explains local data, ciphertext backups, service records, legally retained evidence and recipient copies. Queue cleanup is idempotent. A restoration from a service backup must reapply deletion tombstones before reopening access.
