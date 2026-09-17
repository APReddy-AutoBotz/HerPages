# Source register

**Research date:** 16 September 2026. Sources support specific background/legal/technical claims, not product-market validation or a production compliance certificate. Provider pages are first-party descriptions, not independent quality audits. Recheck current text, amendments and contracts at implementation/release.

| ID | Primary source and URL | What was used / limitation |
|---|---|---|
| S01 | [MeitY — DPDP Act 2023](https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf) | Statutory text, including child-data provisions. Read with commencement notification. |
| S02 | [MeitY — DPDP Rules 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) | Official immediate, one-year and eighteen-month tranches. English notification inspected; operational details need precise release review. |
| S03 | [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Native SQLCipher configuration and Expo Go limitation; exact compatible versions selected during spike. |
| S04 | [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) | OS storage, biometrics, reinstall and backup caveats; not whole-vault recovery. |
| S05 | [Android Keystore](https://developer.android.com/privacy-and-security/keystore) | Device-dependent key protection; not a universal compromised-device guarantee. |
| S06 | [Apple Secure Enclave keys](https://developer.apple.com/documentation/security/protecting-keys-with-the-secure-enclave) | Page rendering limited; native key capabilities must be rechecked. No assumption arbitrary database keys always stay inside the enclave. |
| S07 | [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [changelog](https://supabase.com/changelog) | Row policy and elevated-role caveats. RLS is not E2EE. HTML changelog accessed; markdown endpoint unavailable. |
| S08 | [Bolt GitHub integration](https://support.bolt.new/integrations/git) | Integration reference; exact promotion entitlement/expiry and current behavior not assumed. |
| S09 | [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | UGC, child/privacy and purchases need review for actual audience/storefront. |
| S10 | [India112](https://112.gov.in/) and [MHA ERSS](https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss) | Official resource, not authorization for HerPages dispatch or a response-time promise. |
| S11 | [W3C WCAG2.2](https://www.w3.org/TR/WCAG22/) | Accessibility criteria; native tests additional. 48-unit mobile target is a product design choice. |
| S12 | [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) | Training, retention and endpoint behavior differ; zero retention is not a universal default. No API service provisioned. |
| S13 | [CERT-In directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) | Applicable-entity incident/log requirements; counsel determines scope and record classes, not blanket diary logging. |
| S14 | [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) | US expansion reference; amended rules and applicability require current review. |
| S15 | [ICO Children's Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/) | UK expansion review reference, not proof of compliance. |
| S16 | [Day One E2EE](https://dayoneapp.com/features/end-to-end-encryption/) and [recovery guidance](https://dayoneapp.com/guides/tips-and-tutorials/keeping-your-day-one-encryption-key-safe/) | Existing journal/recovery category; marketing guarantees not adopted. |
| S17 | [FamilyAlbum privacy](https://family-album.com/privacy) and [product](https://help.family-album.com/hc/en-us/articles/360038267214-What-is-FamilyAlbum) | Existing private family-memory use case. |
| S18 | [HerKey about](https://www.herkey.com/about-us) | Existing women's careers/learning/community offering; no superiority or user-count claim. |
| S19 | [UNICEF India adolescent development](https://www.unicef.org/india/what-we-do/adolescent-development-participation) | Life-skills and participation context; not subscription validation. |
| S20 | [Generation Unlimited Youth Hub](https://www.generationunlimited.org/youth-hub) | Existing youth opportunity/skilling ecosystem. |
| S21 | [Google Play Families](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) | **Revalidation required:** retrieval rate-limited; detailed review not completed. |
| S22 | [Google Play child-safety standards](https://support.google.com/googleplay/android-developer/answer/14747720?hl=en) | **Revalidation required:** retrieval rate-limited; must read before store/community release. |
| S23 | [Android Developers — Age Signals](https://android-developers.googleblog.com/2026/07/google-play-age-signals-api-safer-experiences.html) | Possible assurance direction; not proof of guardianship/complete consent. Revalidate country/version scope. |
| S24 | [Next.js App Router](https://nextjs.org/docs/app) | Framework reference; detailed page retrieval unavailable. Verify current API/version at implementation. |
| S25 | [MeitY — Act commencement G.S.R.843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf) | Official notification dated13 November2025. English page inspected; core duties phase in rather than all being operative in September2026. |
| S26 | [Checkout v4.2.2 reference](https://api.github.com/repos/actions/checkout/git/ref/tags/v4.2.2) | Initial verified pin `11bd71901bbe5b1630ceea73d27597364c9af683`; superseded after CI runtime warning. |
| S27 | [Checkout v6 reference](https://api.github.com/repos/actions/checkout/git/ref/tags/v6) | Verified current v6 ref resolved on2026-09-16 to immutable commit `d23441a48e516b6c34aea4fa41551a30e30af803`; final documentation CI pin. |

## Evidence handling

Do not copy complete licensed standards, competitor interfaces or private research into this public repository. Record relevant summaries and links. Retrieval failures are marked, not replaced by invented current rules.

## Recheck triggers

Before provisioning: versions, regions, processors, contracts and prices. Before real child data: commencement/amendments, assurance and rights/retention. Before store release: audience, SDK, UGC, billing and deletion. Before safety: official resources and integration agreements. Before AI changes: actual data controls, input provenance and evaluation.
