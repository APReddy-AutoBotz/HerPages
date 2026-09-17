# Product requirements document

**Product:** HerPages. **Baseline:** 1.0. **Owner:** Parameswar Reddy. **Status:** specified; implementation not started.

## 1. Product outcome

Make it easy to preserve a meaningful personal journey, choose a useful next activity and discover credible opportunities, with privacy controls people can understand. The lifelong vision must provide a valuable first week; it must not depend on storing years of data before becoming useful.

## 2. Persona hypotheses

| Persona | Job to be done | Friction to validate | First useful outcome |
|---|---|---|---|
| Parent of an 8–12-year-old daughter | Support interests without constant searching or comparison | Advice overload; fragmented memories; distrust of social exposure | Save one milestone and choose a practical shared activity |
| Girl aged 10–12 | Explore interests and have a voice | A product that feels like a parent's report card | Choose or skip an activity and record a private reflection within approved access boundaries |
| Teen aged 13–17 | Find credible options without a public identity marketplace | Missed deadlines, unsuitable programs, safety concerns | A source-backed shortlist with an explanation and no forced public profile |
| Woman aged 18–24 | Turn interests into a next step | Scattered opportunities; uncertainty about sharing | Save a goal and a relevant learning/career opportunity |
| Woman aged 25–49 | Maintain chosen goals through changing circumstances | Fragmented tools and unwanted assumptions about life stage | Resume a goal without a penalty or a forced lifecycle template |
| Woman aged 50–64 | Start a new chapter | Products treating her as either a caregiver or retiree | Find learning, work, volunteering or mentoring options she chooses |
| Woman aged 65+ | Connect, create and learn independently | Small controls, recovery confusion, patronizing experiences | Capture a story in accessible mode and decide whether to share it |
| Guardian, editor or program operator | Support a bounded activity | Permission ambiguity and administration | Complete the assigned task without accessing private Pages |

These are design personas, not interviewed users. Pilot recruitment is remote and ethical; no real child data is collected merely to populate a demo.

## 3. Core journeys

### 3.1 Begin privately

Adult selects personal or guardian mode, reads a plain-language storage explanation and creates an encrypted local vault. Personal mode can start without a cloud account. Guardian mode involving real child information remains behind the child-processing gate, even if local. A synthetic demo requires no personal identity. A first Page takes no more than a title or short text; photos and birth dates are optional and purpose-explained.

### 3.2 One useful next step

User explicitly chooses an interest and a goal or selects a general activity. The app offers a short editable plan from reviewed content. Completion and reflections stay local. Skipping, changing interests and taking a break are normal states. No inferred intelligence, mental-health score, comparison leaderboard or career destiny.

### 3.3 Discover credible opportunities

Catalog entries show who runs the program, primary-source URL, verification date, eligibility, cost, deadline with time zone, location/remote mode and application destination. Local filters use intentionally supplied preferences. Unknown eligibility is shown as unknown; expired or unverified entries are suppressed from actionable recommendations. Initially an application leaves for an explicitly disclosed external website; HerPages does not claim to submit it.

### 3.4 Understand sharing

Every item has a readable privacy label. Private vault items do not inherit public profile permissions. A future share requires choosing the exact items and recipient, previewing exposure and acknowledging that recipient copies cannot be recalled. Family sharing uses separate encrypted collections rather than a universal family key. Connected community posts are explicitly server-readable for moderation.

### 3.5 Keep the story recoverable

Before optional backup is enabled, the user receives and proves access to a recovery method. Account login alone cannot decrypt a lost vault. The app displays last successful encrypted backup and last tested recovery, with a clear unsynced-items warning. A failed backup does not prevent local capture. A lost key and no authorized device may mean permanent data loss; do not disguise this.

### 3.6 Enter adulthood

Visual Horizon can continue at 18. Service authority is independently reevaluated. Guardian access does not silently persist as adult consent. The daughter establishes an independent account and key; then selects which child-history collections to transfer or reshare. Pending and disputed transfers are handled without exposing personal content to support staff. Historical recipient copies remain beyond technical recall.

### 3.7 Join later in life

A 58- or 72-year-old starts with current goals and optional earlier memories. No pressure to fill missing decades. Readability, voice accessibility and simpler navigation are user settings, not age-enforced limitations. Trusted delegates require explicit scoped grants and cannot reset a private vault simply because they are relatives.

## 4. Release scope

| Release | Included | Excluded |
|---|---|---|
| R0: documentation | This pack, contracts, fixtures and validators | Any claim of a functioning app |
| R1: native proof | Adult synthetic demo; vault create/lock/save/search; encrypted export/restore; stage rendering; accessibility | Cloud child data, production AI, communities, live safety |
| R2: foundation beta | Reviewed E2EE backup; verified catalog; account/consent services; parent-led beta only after gates; adult users including 50+ | Open social graph, DMs, emergency dispatch, autonomous applications |
| R3: growth pilot | Reviewed activities, local matching, teen participation only after consent/safeguarding approval; limited organization workflows | Behavior-based child profiling or unrestricted AI |
| R4: connected adults | Adult moderated groups/events and scoped mentor programs with trained operations | Cross-age direct messaging and safety guarantees |
| R5: advanced optional services | Audited selected-data AI, reviewed trusted-contact sessions, additional languages and countries | Automatic rollout based only on a release number |

A feature may be documented long before it is enabled. Child, cloud-AI, community, location and country gates are independent.

## 5. Requirements organization

`requirements.json` is the atomic functional requirement register. Every entry has an ID, phase, priority, acceptance outcome and test reference. `FEATURE_CATALOG.md` describes complete module behavior. `../03-architecture/NON_FUNCTIONAL_REQUIREMENTS.md` defines measurable system qualities. `../06-delivery/BACKLOG.md` maps implementation work to requirements and gates.

## 6. Roles

Use capabilities, not a single parent/user boolean. Roles include adult member, provisional minor, approved minor participant, guardian, trusted delegate, mentor, organization contributor, organization reviewer, editor, moderator, support and security administrator. One person may have multiple scoped roles. A payer is an entitlement role, not a vault owner. A moderator cannot impersonate a user or browse unrelated private content.

## 7. UX principles

Offer a meaningful offline core. Keep navigation stable while themes change. Support text scaling, screen readers, reduced motion and accessible colors at all ages. Never express status solely by color. Preserve user choice across birthdays. No daily guilt, countdown anxiety, scarcity tricks, follower competition or infinite-scroll dependence. A girl is not required to look, act or aspire in a stereotyped way.

## 8. Content and advice boundaries

General parenting, educational and life-skills content is editorially reviewed with named sources and review dates. Health, sexual-health, financial and legal topics require qualified review and careful age suitability; AI must not diagnose, prescribe or make a financial decision. Body-image, puberty and safety materials should be factual, non-shaming and reviewed by specialists before publication. Medical tracking is not a baseline product requirement.

## 9. Data and safety principles

Use local-first where it reduces exposure. Private content is never a silent input to community ranking or advertising. Cloud AI requires per-request selected disclosure with provider/retention explanation; no claim of end-to-end privacy while a cloud provider processes plaintext. The connected service necessarily sees some account, request and transport metadata. Do not say 'all data never leaves your phone.'

An emergency resource is accessible without subscription or a successful login. App notification success is not emergency rescue. Minor-location features are off pending a separate legal, engineering and safeguarding decision.

## 10. Commercial hypothesis

Free useful private capture and safety-resource access; optional paid backup/storage and richer planning; organizations may pay for ethical program administration rather than access to girls' profiles. Test annual willingness to pay before prices are frozen. No sale of personal data, advertiser audiences or inferred vulnerabilities. Portability must remain available when a subscription ends.

## 11. Pilot evaluation

Use adult usability sessions first, then guardian research and separately approved child participation with assent and consent. Suggested research goals: determine whether participants understand local/cloud labels, can recover a vault, choose a useful activity and understand an external opportunity application. Metrics are opt-in study measures, not hidden telemetry. Values in the research plan are decision thresholds, not forecasts.

## 12. Launch acceptance

A release must demonstrate traceability; native secure storage; restore on a clean second device; revoked-role denials; deletion/export behavior; age-policy enforcement; current notices and contacts; accessibility; catalog quality; an incident drill; and a truthful feature manifest. Child/community/safety/AI releases require their additional gates. Any critical bypass or misleading privacy state blocks the relevant launch.
