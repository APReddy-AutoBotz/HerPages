# Screen and interaction specifications

Design components once; render role, stage and connectivity differences explicitly. All screens inherit accessibility and privacy-label requirements. No screen below implies its release gate has passed.

| ID / screen | Main content and action | Data boundary | Essential alternate states |
|---|---|---|---|
| UI-01 Welcome | Brand, personal/guardian/demo choice; storage explanation | No personal data required | Offline, unsupported device, large text |
| UI-02 Vault setup | Device lock, key creation, local-only warning | Device secrets only | Secure storage unavailable; canceled biometrics; interrupted init |
| UI-03 Recovery setup | Method explanation, save recovery material, proof-of-possession check | Device only; no screenshot/log upload | Lost method; incomplete confirmation; accessibility alternative |
| UI-04 Today | Chosen goal, one suggested activity, recent Page, saved deadline | Local personal state + cached public catalog | No goal; no interest; offline; no suitable activity |
| UI-05 My Pages | Timeline, local search, filter, add Page | Encrypted local vault | Empty; locked; corrupt record isolated; low storage |
| UI-06 Page editor | Text, optional media, tags, date; save status | Device; imported-file provenance | Permission denied; app killed; oversized file; save retry |
| UI-07 Page detail | Content, privacy label, edit/export/delete | Local; explicit export boundary | Missing media; deleted source; pending migration |
| UI-08 Interests and goals | Explicit choices, editable goal, skip/reset | Local | No recommendations; changed goal; all activities skipped |
| UI-09 Activity | Purpose, source, safety note, adaptable steps, optional reflection | Reviewed content; reflection local | Out-of-age range; inaccessible activity; stale source |
| UI-10 Discover | General catalog, local filters, clear remote/cost labels | Catalog cloud; preferences local | No matches; offline cached list; outdated catalog |
| UI-11 Opportunity | Organizer, evidence, eligibility, deadline/timezone, destination | Published metadata | Suspended; expired; fee unknown; possible scam |
| UI-12 External handoff | Destination and privacy explanation; guardian gate if required | User-approved disclosure beyond HerPages | Cancel; blocked domain; gate failed |
| UI-13 Profile/context | Display name, personal/guardian context, theme choice | Local preferences; minimum service profile | Unknown assurance; disputed relationship; adulthood due |
| UI-14 Guardian consent | Purposes, data, verifier, options, withdrawal | Service-private receipt | Provider unavailable; evidence rejected; unsupported jurisdiction |
| UI-15 Backup/devices | Last verified snapshot, size, devices, revoke, restore | Ciphertext metadata | Upload failed; restore required; revoked device; quota reached |
| UI-16 Privacy center | Storage modes, sharing grants, AI receipts, export/delete | Separate classes clearly displayed | Retention hold; queued deletion; local-only state |
| UI-17 Independence | Independent identity, collection preview, rekey/transfer status | Sensitive account + device key flow | Dispute; missing key; interrupted migration; no parent response |
| UI-18 Safety & Help | Official numbers, dialer handoff, last checked date | Offline directory; no default location | No calling support; airplane mode; wrong country |
| UI-19 Adult trusted session | Explicit contacts, duration, start/stop, acknowledgement | Future time-limited safety class | No GPS; stale fix; push denied; contact unacknowledged |
| UI-20 Community | Eligible groups, rules, post/report/block | Server-readable connected content | Moderation offline; suspended account; denied minor access |
| UI-21 Report and appeal | Category, exact disclosed evidence, case status | Restricted case management | Emergency redirect; blocked media; appeal pending |
| UI-22 Mentor program | Scope, verification detail, availability, boundaries | Consented program data | No capacity; revoked mentor; wrong age cohort |
| UI-23 HerGuide | Purpose, selected material, provider disclosure, answer sources | Explicit cloud disclosure only when enabled | Minor blocked; no source; timeout; dangerous request |
| UI-24 Partner workspace | Programs, submission, consented applications, aggregated outcomes | Organization tenant | Missing verification; forbidden applicant; revoked staff |
| UI-25 Editorial console | Review queue, evidence, publish/suspend controls | Catalog and review metadata | Conflicting edit; source expired; second review required |
| UI-26 Operations console | Feature flags, health metrics, restricted cases | Least privilege; no vault plaintext | Break-glass denied; audit failure; missing staffing |
| UI-27 Subscription | Plan, total price, renewal, cancel/restore | Adult billing/entitlements | Refund; grace; expired receipt; payer is not owner |
| UI-28 Accessibility | Text, contrast, motion, navigation preferences | Local | OS scaling; screen reader; Telugu layout |

## Key interaction details

The Page editor commits encrypted data transactionally before showing saved. Navigation away from an unsaved edit offers an accessible recovery action. Deletion explains whether it is local, backed-up or a recipient-owned copy. Shared/private labels never disappear behind a menu.

Birthday transitions are offered in Profile, not as a blocking celebration. A teenage user can dismiss an animation. A 70-year-old can choose a bright Wonder palette without access-policy changes. Family role switching requires a persistent context label and reauthentication for sensitive grants.

The partner portal must not contain a 'search girls' page. The admin console must not contain 'view user's vault'. No mock UI should imply these forbidden capabilities will be built later.

## Prototype walkthrough

Use synthetic personas aged 5, 8, 12, 15, 17, 18, 23, 33, 44, 58 and 72. Demonstrate both age-17 and age-18 Horizon: same theme, different legal-authority flow. Use an airplane-mode demonstration for private capture and a failed-backup demonstration to prove honest status design.
