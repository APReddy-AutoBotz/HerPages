# Lifecycle, ownership and access model

## Three independent concepts

1. **Visual chapter:** an optional presentation suggestion based on a locally supplied age or user choice.
2. **Legal/policy status:** jurisdiction-specific adult/minor/unknown/disputed state maintained by an approved assurance process for connected features.
3. **Capability grant:** explicit, scoped and revocable permission to perform a particular operation.

Never use `theme === 'horizon'` to authorize access. Never trust a client-supplied age band or editable user metadata to grant adult capabilities. A 19-year-old may keep Bloom colors; a 17-year-old may choose an adult-looking palette without acquiring adult rights.

## Canonical visual chapters

| Inclusive age range | ID | Label | Default emphasis |
|---|---|---|---|
| 0–5 | first_pages | First Pages | Parent-led memories and simple shared activities |
| 6–9 | wonder | Wonder | Play, curiosity and creativity |
| 10–12 | bloom | Bloom | Interests, confidence and life skills |
| 13–15 | aura | Aura | Voice and exploration |
| 16–18 | horizon | Horizon | Education, skills and next steps |
| 19–24 | rise | Rise | Independence, learning and work |
| 25–35 | momentum | Momentum | Self-selected goals and opportunities |
| 36–49 | rooted | Rooted | Growth, reinvention and connection |
| 50–64 | flourish | Flourish | New directions, mentoring and chosen priorities |
| 65+ | evergreen | Evergreen | Learning, purpose, experiences and selected legacy |

Age ranges are continuous and non-overlapping in `../../contracts/lifecycle.json`. Unknown age uses a neutral visual default and restrictive connected policy. Do not cap legitimate ages at 99. Date math must handle leap years, local civil dates and corrections; store dates as dates, not timestamps pretending to be birthdays.

## Experience by role

| Action | Guardian | Minor participant | Adult member | Staff/partner |
|---|---|---|---|---|
| Create own local personal vault | Yes | Only approved minor mode | Yes | Own personal use only |
| Create child-history vault | Approved legal relationship + gate | No | Only if authorized guardian | No |
| Read a private collection | Only with its actual key and grant | Only with its actual key and grant | Only with its actual key and grant | No employee bypass |
| Publish public profile | Guardian's own adult profile, not child | No baseline capability | Opt-in after connected gate | Organization profile only |
| Join open adult group | Separate membership policy | No | After eligibility and moderation gates | No recruitment browsing of minors |
| DM adult/minor | No cross-age direct messaging | Disabled | Adult-only, future gate | Mentors cannot privately DM minors |
| Apply to program | Authorized purpose-specific flow | Assisted where required | Self-directed | Receive only intentional applications |
| Change legal age/guardian status | Evidence/review, not free edit | Evidence/review | Evidence/review | Narrow assurance reviewer only |
| Grant location access | No unilateral secret tracking | Disabled baseline | Explicit time-limited session, later | No staff browsing |
| Pay subscription | Can fund a profile | Purchases gated | Can fund self/others | Billing access never gives vault access |

## Relationship state machine

`proposed → assurance_pending → active → suspended → revoked`.

Only `active` permits approved child service processing. A request does not prove guardianship. A role must be tied to a subject, purpose, start/end and evidence reference. Withdrawal, age change, legal dispute and safeguarding events trigger reevaluation. Reject self-approval and relationship reassignment through generic profile-update APIs.

## Adulthood transition

`minor_active → transition_due → independent_identity_pending → key_transfer_pending → adult_independent`, with `disputed` and `blocked` side states.

At the legal boundary, the server ceases to treat guardian authority as sufficient for new adult disclosures or key grants. If the user has not completed independence, do not assign her content to a parent permanently by default. Freeze sensitive sharing changes and offer supported resolution; local data already on a device remains technically available to whoever can unlock it.

Use separate collections from the beginning: child-history, parent-authored private reflections, family-shared memories and the daughter's later personal vault. Do not pool all family data under one forever key. Legal entitlement to historical records may differ by content authorship and jurisdiction; the transfer review decides what may move, rather than assuming every parent's note belongs to the child.

A verified daughter account creates its own keys. On an authorized device, approved content is exported or rewrapped/re-encrypted into a daughter-controlled collection. Rotate future collection keys and revoke old grants. Test that the old parent's token cannot retrieve new ciphertext and old key material cannot decrypt new data. Explain that old copies and screenshots cannot be remotely erased.

## Older-adult autonomy

Age 50 or 65 never reduces authority or automatically creates a caregiver role. Delegation is explicit, narrow, expiring and separately revocable. Example: help manage an event RSVP without diary access. Avoid a catch-all 'family admin'. Incapacity, death and nomination workflows are deferred pending legal and encryption design; a support request is not proof of legal authority, and legal authority cannot reconstruct a key the service does not possess.

## Visual transition

Offer a chapter preview near a milestone, not an automatic overnight redesign. Keep current theme, switch now or choose another palette. Do not infer cognition, employment, menopause, marriage or family role from age. Accessibility preferences override theme styling. Record theme preference locally; no need to send date of birth to a theme server.
