# Release gates and definition of readiness

A release is approved by evidence for its scope, not by all features being drawn. Every gate requires a named qualified reviewer, exact commit/build, evidence date, residual risks and decision. Roles below are required responsibilities, not people already hired.

| Gate | Scope | Required evidence | Reviewer |
|---|---|---|---|
| G0 | Documentation baseline | Link/JSON/traceability checks; assumptions and source limitations; no false app claims | Owner + architecture reviewer |
| G1 | Synthetic native prototype | Compatible locked toolchain, actual native builds, offline capture, secure-storage failure, lifecycle/large-text tests | Engineering |
| G2 | Real private data / backup | Independent crypto/security review, key/recovery tests, leakage inspection, restore/rotation/migration, private report channel | Security + engineering |
| G3 | Real child processing / participation | Current legal review, verified guardian process, notices/assent, age policy, custody/abuse cases, rights and retention | Counsel/privacy + safeguarding |
| G4 | Connected foundation beta | Auth/RLS negative tests, reviewed catalog, processor/region inventory, editorial/support staffing, store/billing review, pilot plan | Product + engineering + privacy |
| G5 | Community/mentoring | Eligibility rules, trained moderation coverage, report/block/appeals, abuse simulations, event/mentor checks | Safeguarding + operations + counsel |
| G6 | Cloud AI | Approved adult purposes/providers, explicit disclosure, retention/DPA, held-out evals, budget and rollback, minor input blocked | AI lead + privacy/security |
| G7 | Live safety sessions | Adult-only necessity/consent design, real-device delivery failures, coercion review, expiry, official integration evidence if claimed | Safety + engineering + counsel |
| G8 | Public production/handover | Exact release manifest, no mock dependencies, CI/device tests, backup/incident drills, signed artifacts, store notices, support and rollback | Owner + required gate reviewers |

## Non-waivable product stop conditions

Unauthorized personal-data access; plaintext-vault leakage; crypto downgrade; unrecoverable migration loss; adult-minor contact bypass; forged guardian authority; false rescue/dispatch confirmation; unstaffed moderation presented as active; or missing legal basis for enabled child processing. Fix or disable the affected feature. A business deadline does not turn a failed gate into a passed one.

## Feature manifest

Every release identifies enabled flags, countries, audience/age capabilities, actual processors, model versions if any, native storage mode, recovery support, known limitations and outstanding risks. Server gates take precedence over UI flags. Demo integrations display DEMO and cannot silently run in production.

## Public launch minimum

Published truthful privacy/terms and monitored contacts; tested account/export/deletion/recovery; least-privilege administration; current store declarations; initial editorial catalog with owners; accessible UX; incident response; budget controls; legal entity and licensing decisions. Do not show compliance seals or safety badges derived only from documentation.

## Evidence template

```text
Gate / release / commit:
Scope and feature flags:
Reviewer and qualification/role:
Tests run and artifacts:
Not-run tests and reasons:
Source/legal versions checked:
Residual risks and mitigations:
Decision: approve / reject / limited synthetic-only
Expiry or re-review trigger:
```
