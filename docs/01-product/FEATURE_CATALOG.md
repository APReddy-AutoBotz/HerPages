# Complete feature catalog and scope boundaries

This catalog describes the complete intended system. Atomic acceptance criteria are in `requirements.json`. A feature being listed does not authorize its launch.

| Module | User value | Core behavior | Explicit boundary |
|---|---|---|---|
| Identity and profiles | Appropriate experience without excess disclosure | Local guest; service account; guardian relationship; assurance state; role switch | No public birth date, school or residential address |
| My Pages | Keep memories, milestones and reflections | Local create/edit/search/tags/media; lock; export; delete | No server journal search, hidden backups or cloud embeddings |
| Recovery and backup | Keep history despite device loss | Opt-in encrypted snapshots; integrity checks; restore drill; key-loss warning | No password-reset decryption or promise to recover missing keys |
| Growth activities | Translate interests into action | Reviewed content; local selection; user edits; optional reminders; skip/pause | No obligation to complete, child productivity rankings or diagnosis |
| Routine planning | Practical organization | Recurrence, quiet hours, local notifications, accessible checklist | No medical dosing recommendations or assumed delivery guarantees |
| Discover | Reduce opportunity-search effort | Source-verified catalog, filter, freshness, local match reason, save deadline | No guarantee of acceptance, scraped copyrighted lists or fake partnerships |
| Parenting support | Useful conversation and shared activities | Age-reviewed guidance; source, reviewer, translated content | No normative score for raising a 'good girl' |
| Family sharing | Intentionally share selected memories | Separate collections, recipient preview, key enrollment and revocation | No universal family master key or employee override |
| Independence | Ownership that changes responsibly | Adult assurance, key transfer, new consent and explicit reshare | Cannot erase recipients' existing copies |
| Adult community | Connection around interests | Invitation/eligibility policy; groups; report/block; moderation; appeals | Not guaranteed women-only identity; no appearance classifier |
| Teen circles | A possible safer peer space | Closed reviewed cohort, guardian/assent controls, trained moderation | Deferred; no stranger discovery or adult-minor DMs |
| Mentorship | Contextual guidance | Reviewed programs, scheduled bounded interactions, disclosure and feedback | Minor mentoring is structured/supervised, never a private open inbox |
| Events | Discover and participate | Organizer checks, external/first-party enrollment disclosure, capacity and reminders | Event listing is not a guarantee of physical safety |
| Safety resources | Know where to seek help | Offline official numbers, call handoff, trusted-contact education | No dispatch claims, rescue timer or paywall on help |
| Trusted-contact session | Voluntary time-bound coordination | Adult-only future feature; clear start/stop, expiry, acknowledgement, failures | No covert location, no silent contact upload, no baseline child tracking |
| HerGuide AI | Explain selected content and suggest options | Source-grounded adult assistance; per-request disclosure; deterministic permissions | Not a romantic companion, therapist, clinician, autonomous recruiter or hidden diarist |
| Organization portal | Operate legitimate programs | Organization tenancy, listing approval, applicant consent, coarse aggregate reporting | Cannot browse girls or sell audiences; no inferred vulnerability targeting |
| Editorial/admin | Keep the ecosystem reliable | Review queues, source dates, roles, audit of actions, kill switches | No private-vault browser or global impersonation |
| Subscription/entitlements | Fund useful services | Transparent plans, store receipts, restore purchase, adult payer | Paying does not own data; export/deletion remain accessible |
| Accessibility/localization | Usable across ages and languages | Scalable text, screen reader, reduced motion, English/Telugu-ready strings | No 'senior mode' imposed by birthday |

## Common error states

Every module specifies: loading, empty, denied, expired, offline, timeout, partial completion, rate limit and recovery. 'Saved on device' and 'Backed up' are different states. A stale opportunity displays its last check and may become non-actionable. A revoked consent blocks further connected processing even when the mobile screen has cached a prior permission.

## Content types

Page, milestone, interest, goal, routine, activity, opportunity, program, event, group, post, report, consent receipt, relationship grant, backup manifest, device enrollment and support case each have distinct schemas. Avoid one untyped `user_data` JSON bucket with global CRUD.
