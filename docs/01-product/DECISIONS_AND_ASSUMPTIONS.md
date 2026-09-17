# Decisions, assumptions and corrections

This is the authority register. A statement in an earlier brainstorming conversation does not override this baseline.

## Founder-confirmed direction

| ID | Decision |
|---|---|
| D-01 | Name: HerPages. Tagline direction: An app that grows with her. |
| D-02 | Product extends from parent-supported childhood to women aged 50+, 65+ and beyond. |
| D-03 | Modern evolving palettes; grouped life stages rather than a compulsory redesign every birthday. |
| D-04 | Personal-data protection and keeping intimate content on the phone are central requirements. |
| D-05 | GitHub repository: APReddy-AutoBotz/HerPages. Documentation and work must be preserved there. |
| D-06 | Bolt is a temporary build accelerator; Codex is the long-term continuation environment. |
| D-07 | Public consumer product with girls'/women's features, opportunities and potentially organizational programs. |

## Architectural decisions proposed in this baseline

| ID | Proposed baseline | Consequence |
|---|---|---|
| A-01 | Native mobile first; separate web/partner/admin surfaces | Native encryption must be tested, not simulated in browser storage. |
| A-02 | Local encrypted vault, optional client-encrypted backup, separate service database | Cloud connectivity is not synonymous with public visibility; each data class has explicit rules. |
| A-03 | First executable slice uses adult testers and synthetic child data | Protects the child-facing launch while testing the foundation. |
| A-04 | Parent-led 8–12 beta is the initial market hypothesis, after legal/safeguarding gates | Not a restriction on the lifelong vision; not permission to recruit real children immediately. |
| A-05 | No advertising in the baseline; subscription and opt-in organizational programs tested later | Stronger alignment with users; commercial viability remains unproven. |
| A-06 | Minor community, live location and cloud-personal AI disabled by default | Specialist review and operating capability are prerequisites. |
| A-07 | India-only launch policy before country expansion | Store distribution and enrollment restrictions must be configured and tested. |
| A-08 | One modular API plus worker, not a microservices estate | Easier remote operation and consistent authorization. |
| A-09 | Stage names and themes are suggestions; legal access is independent | Horizon may include age 18 without extending parental authority. |

## Corrections to earlier brainstorming

**Phased law commencement.** The DPDP Rules notification contains different commencement tranches. It is incorrect to describe every substantive requirement as already fully operational in September 2026. The legal register records the source and release review; the product adopts protective defaults now. [S01–S02]

**Personalization.** Explicitly entering interests does not automatically make every later inference or recommendation lawful for a child. No hidden behavioral profiling; child personalization stays local and bounded, subject to review.

**Cryptographic storage.** SecureStore is not a guarantee that arbitrary data keys live only inside a Secure Enclave. An app must access plaintext to render it; some keys or key-derived material are present in process memory. Device compromise remains in scope as a limitation. [S04–S06]

**Adulthood.** Rekeying and revocation stop future authorized access; they cannot recall screenshots, exported files or historical plaintext already possessed by another person. Ownership transition requires an independently verified daughter account and a safe transfer workflow, not an automatic birthday data dump.

**Emergency support.** An SOS screen is not a police integration. 112 access is distinct from authorized dispatch connectivity, and no arrival time is promised. [S10]

**Market evidence.** Long-term retention, willingness to pay, reliable women-only identity and competition gaps have not been measured. No numerical opportunity score or guaranteed success claim is adopted.

**Schedule.** No exact Bolt promotion expiry is assumed. The owner checks the account entitlement. Milestones use relative weeks and release gates.

## Open decisions and owners

| ID | Question | Owner / deadline |
|---|---|---|
| O-01 | Legal operating entity, trademark/domain clearance and distribution countries | Owner + counsel, before public branding/spend |
| O-02 | Age/guardian-assurance provider and evidence retention | Privacy lead, before real child records |
| O-03 | Reviewed native crypto library, recovery format and key-enrollment protocol | Security engineer, HP-003 |
| O-04 | Family conflicts, parent-authored material and daughter access rights | Counsel + safeguarding, before parent-led beta |
| O-05 | Staffed moderation/support routes and coverage | Owner, before community beta |
| O-06 | Actual cloud regions, subprocessors, retention and DPAs | Engineering + privacy, before cloud personal data |
| O-07 | Who pays and which age cohort returns | Product research, before full growth build |
| O-08 | Repository/software license and contributor IP terms | Owner + counsel, before external contributions |
| O-09 | App-store audience/category strategy for the lifelong product | Product + store-policy review, before store submission |
| O-10 | Community membership policy, inclusive treatment and appeal safeguards | Owner + safeguarding + counsel, before community |

Resolve decisions through ADRs and evidence, not hidden prompt changes. Sources are in `../07-reference/SOURCES.md`.
