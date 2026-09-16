# Source register

**Research date:** 16 September 2026. Sources below support specific background/legal/technical claims, not product-market validation or a production compliance certificate. Provider feature pages are first-party descriptions, not independent quality audits. Recheck current text, amendments and contracts at implementation/release. Source IDs used throughout the pack refer here.

| ID | Primary source and URL | What was used / limitation |
|---|---|---|
| S01 | [MeitY — Digital Personal Data Protection Act 2023](https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf) | Statutory text, including child-data provisions. Read alongside commencement notification, not as if all sections already apply. |
| S02 | [MeitY — DPDP Rules 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) | Official notification has immediate, one-year and eighteen-month rule tranches. English notification inspected. Child assurance, security, retention and breach provisions need precise release review. |
| S03 | [Expo SQLite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Native SQLCipher configuration/support and Expo Go limitation. Select actual compatible versions at the spike. |
| S04 | [Expo SecureStore documentation](https://docs.expo.dev/versions/latest/sdk/securestore/) | OS-backed storage, biometric/reinstall/backup caveats. It is not a whole-vault recovery mechanism. |
| S05 | [Android Keystore](https://developer.android.com/privacy-and-security/keystore) | Key protection and device-dependent hardware support; not a guarantee against every compromised-device threat. |
| S06 | [Apple — protecting keys with Secure Enclave](https://developer.apple.com/documentation/security/protecting-keys-with-the-secure-enclave) | Primary platform reference. Page rendering was limited; detailed native capabilities must be rechecked before selecting key operations. No claim arbitrary SQLCipher keys always remain inside the enclave. |
| S07 | [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [changelog](https://supabase.com/changelog) | Row authorization, policy and elevated-role caveats. RLS is not end-to-end encryption. HTML changelog accessed; markdown endpoint unavailable during research. |
| S08 | [Bolt GitHub integration](https://support.bolt.new/integrations/git) | Repository integration reference. Exact promotion entitlement, expiry and current workflow behavior are not assumed. |
| S09 | [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | UGC, children/privacy and digital-purchase review requirements. Apply to actual storefront/category; no blanket payment exemption. |
| S10 | [India ERSS 112](https://112.gov.in/) and [MHA ERSS](https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss) | Official emergency-resource existence. Does not provide HerPages an authorized dispatch integration or guaranteed response time. |
| S11 | [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility criteria, including text/non-text contrast and interaction requirements. Native testing is additional; 48-unit touch target is a HerPages design target. |
| S12 | [OpenAI API data controls](https://developers.openai.com/api/docs/guides/your-data) | Training, retention and endpoint-specific behavior must be distinguished; approved zero-retention configurations are not universal defaults. No API key or service was provisioned. |
| S13 | [CERT-In directions, 28 April 2022](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) | Applicable-entity incident reporting and log-retention requirements; counsel must assess actual scope and record classes. No blanket diary logging. |
| S14 | [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) | US expansion reference; current amended rule and applicability require review. India policy cannot simply be reused globally. |
| S15 | [ICO Children's Code resources](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/) | UK expansion design/privacy review reference. Not proof HerPages complies. |
| S16 | [Day One E2EE](https://dayoneapp.com/features/end-to-end-encryption/) and [recovery-key guidance](https://dayoneapp.com/guides/tips-and-tutorials/keeping-your-day-one-encryption-key-safe/) | Existing private-journaling and key-recovery product category. Marketing claims are not adopted as independent guarantees. |
| S17 | [FamilyAlbum privacy](https://family-album.com/privacy) and [product explanation](https://help.family-album.com/hc/en-us/articles/360038267214-What-is-FamilyAlbum) | Existing private-family-memory use case. No claim that HerPages invents family albums. |
| S18 | [HerKey about](https://www.herkey.com/about-us) | Existing women's career, learning and community offering. No user-count or superiority claim used. |
| S19 | [UNICEF India adolescent development](https://www.unicef.org/india/what-we-do/adolescent-development-participation) | Participation/life-skills context. Social need does not prove subscription willingness to pay. |
| S20 | [Generation Unlimited Youth Hub](https://www.generationunlimited.org/youth-hub) | Existing youth skilling/opportunity ecosystem; evaluate partnership/linking rather than assuming a vacant market. |
| S21 | [Google Play Families policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) | **Revalidation required:** page retrieval was rate-limited. Listed as a mandatory launch check, not a completed detailed review. |
| S22 | [Google Play child-safety standards](https://support.google.com/googleplay/android-developer/answer/14747720?hl=en) | **Revalidation required:** page retrieval was rate-limited. Current requirements must be read before community/store release. |
| S23 | [Android Developers — Play Age Signals](https://android-developers.googleblog.com/2026/07/google-play-age-signals-api-safer-experiences.html) | Possible age-assurance integration direction; no assumption that a platform signal proves guardianship or all legal consent. Revalidate availability/country scope at implementation. |
| S24 | [Next.js App Router docs](https://nextjs.org/docs/app) | Selected web framework reference. Detailed page retrieval was unavailable in this research session; implementation must verify current supported APIs/versions. |
| S25 | [MeitY — Act commencement, G.S.R. 843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf) | Official notification dated 13 November 2025; immediate, one-year and eighteen-month section tranches. English page inspected. Core duties are not all already operative in September 2026. |
| S26 | [actions/checkout v4.2.2 reference](https://api.github.com/repos/actions/checkout/git/ref/tags/v4.2.2) | Verified immutable commit `11bd71901bbe5b1630ceea73d27597364c9af683` used for the documentation-only CI checkout. Not a claim it is the newest major. |

## Evidence handling

Do not copy complete licensed standards, competitor interfaces or private research into this public repository. Record small relevant summaries and links. If a source cannot be retrieved, mark it as such rather than reconstructing its current rules from memory.

## Recheck triggers

Before provisioning: platform versions, regions, subprocessors, contracts and pricing. Before real child data: statutory commencement/amendments, guardian process and rights/retention. Before store release: audience, SDK, UGC, billing and deletion requirements. Before safety: official resources and any integration agreement. Before model changes: actual data controls and evaluation results.
