# Legal, regulatory and platform-policy register

**Checked:** 2026-09-16. **Status:** engineering research and review checklist, not legal advice or a declaration of compliance. A qualified reviewer must assess the operating entity, actual processing, jurisdiction, notices, contracts and current amendments before launch.

## India: phased commencement matters

The official Act commencement notification separates immediate, one-year and eighteen-month provisions. Core processing duties, including sections 7–10, are in the eighteen-month tranche. The Rules notification likewise separates commencement dates; major operational rules are not all already in force in September 2026. Use the official publication-based schedule rather than claiming the entire DPDP regime is fully operational. [S02, S25]

The architecture nevertheless adopts conservative child-privacy and security controls now. Future commencement is not a reason to collect data recklessly, and other existing obligations may apply.

| ID | Regime / primary reference | Product implication | Required gate |
|---|---|---|---|
| L-01 | DPDP Act 2023 and commencement notification [S01, S25] | Purpose, lawful processing, child protections, rights and organizational responsibilities need mapping | Counsel verifies applicability/effective sections and notices |
| L-02 | DPDP Rules 2025 [S02] | Assurance, security, breach handling and retention provisions need implementation planning with phase dates | Review official rule text and any later amendments |
| L-03 | CERT-In directions [S13] | Applicable entities may have incident-reporting and log-retention duties | Determine entity applicability, listed incidents, 6-hour reporting process and relevant 180-day logs; do not log diaries by default |
| L-04 | Child safeguarding/reporting law | Abuse reports and potential child exploitation require jurisdiction-specific procedures | Qualified counsel verifies POCSO/IT-law duties, authorities, evidence handling and timelines; not determined by an LLM |
| L-05 | Consumer, contract, subscription and tax rules | Honest claims, refunds, renewals, grievance route and billing | Entity-specific legal/accounting review |
| L-06 | Identity/verification integrations | No blanket right to retain identity documents or use government identity services | Approved provider, lawful purpose, minimization and contract |
| L-07 | Official emergency resources [S10] | Directory/dialer is not police dispatch integration | Verify source and wording; formal agreement for any later actual integration |
| L-08 | Intellectual property and branding | Public GitHub is not trademark or licensing clearance | Name/domain/trademark, content licenses and contributor rights |

## Other countries — not enabled automatically

US expansion requires COPPA applicability and updated-rule review, including audience design and parental-consent issues. [S14] UK expansion requires children’s-code/data-protection review. [S15] EU/other markets require separate country analysis, including consent ages, platform rules and cross-border processing. Do not apply an India-only age threshold globally or assume changing a locale string authorizes distribution.

## App-store gates

Apple's review guidelines include user-generated-content, child/family, privacy and payment requirements. [S09] Google Play Families and child-safety policy pages must be revalidated; retrieval was rate-limited during this documentation research and is not recorded as completed. [S21, S22] Audience declarations, age ratings, content moderation, SDKs, privacy labels, deletion and subscriptions must match actual behavior. A lifelong app spanning children and adults needs deliberate store-category strategy.

Age-assurance APIs, including store signals, may help implement a policy but do not automatically prove legal guardianship or satisfy all consent requirements. [S23]

## Claims requiring evidence

Do not publish 'DPDP compliant', 'zero knowledge', '100% secure', 'verified women only', 'police in minutes', 'all data never leaves your phone', 'zero retention' or 'safe for all ages' without a precise defensible scope and review. Avoid paid opportunity guarantees and medical/financial advice claims.

## Retention and incident worksheet

For every record class specify: purpose; lawful basis/consent reference; current applicable rule; effective date; minimum/maximum retention; storage location; processor; deletion/hold process; rights response; incident notification decision owner. Reconcile privacy minimization with security and safeguarding evidence requirements. Do not infer that a single deletion timer fits every record.

## Mandatory prelaunch decisions

Name the legal operating entity and monitored grievance/privacy contacts; approve consent and notices; select country/store audience; confirm processor contracts and regions; establish child reporting and incident runbooks; approve retention and identity-evidence handling; verify user rights workflows; clear brand/content rights. These are unresolved launch gates, not missing placeholders to be filled with invented details.
