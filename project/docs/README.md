# HerPages documentation index

**Baseline 1.0 — 16 September 2026.** This is an implementation-oriented product architecture pack, not a functioning application, legal opinion, security certificate or completed market study.

## Read by responsibility

Owner/product: charter → research → PRD → lifecycle → roadmap → open decisions. Designer: lifecycle → design system/tokens → screens → user journeys. Engineer: root AGENTS → architecture/stack → data/API → trust → requirements/backlog/tests. Specialist reviewer: legal/privacy/crypto/child-safety documents → threat model → release gates. Builder handover: STATUS → task → Bolt/Codex playbook → exact contracts and tests.

## 01 — Product

- [Product charter](01-product/PRODUCT_CHARTER.md): purpose, user value and business boundaries.
- [PRD](01-product/PRD.md): personas, complete journeys, phased scope and acceptance.
- [Decisions and assumptions](01-product/DECISIONS_AND_ASSUMPTIONS.md): confirmed direction, proposed choices, corrections and open decisions.
- [Lifecycle and access](01-product/LIFECYCLE_AND_ACCESS.md): all ten stages, consent/authority and adulthood transfer.
- [Feature catalog](01-product/FEATURE_CATALOG.md): complete module behavior and exclusions.
- [User journeys](01-product/USER_JOURNEYS.md): end-to-end successes and failures, including 50+/65+ entry.
- [Market and validation](01-product/MARKET_AND_VALIDATION.md): primary-source adjacent products and ethical demand research.
- [Monetization and metrics](01-product/MONETIZATION_AND_METRICS.md): hypotheses, unit economics and privacy-compatible measurement.
- [Content and opportunity operations](01-product/CONTENT_AND_OPPORTUNITY_OPS.md): source verification, review and partner boundaries.
- [Functional requirement register](01-product/requirements.json): 64 FR requirements with acceptance/test/task links.

## 02 — Design

- [Design system](02-design/DESIGN_SYSTEM.md): brand, accessibility, states, palettes and themes.
- [Machine-readable tokens](02-design/tokens.json): semantic light/dark colors and ten stage palettes.
- [Screen specifications](02-design/SCREEN_SPECIFICATIONS.md): 28 screens with data boundaries and alternate states.

## 03 — Architecture

- [System architecture](03-architecture/ARCHITECTURE.md): native/cloud boundaries and deployment proposal.
- [Technology stack](03-architecture/TECH_STACK.md): choices, alternatives, version policy and native spikes.
- [Data model](03-architecture/DATA_MODEL.md): local/service/catalog entities, invariants and RLS intent.
- [API semantics](03-architecture/API_CONTRACTS.md) and [OpenAPI draft](03-architecture/openapi.json): core connected contracts, not a deployed API.
- [Async and notifications](03-architecture/ASYNC_AND_NOTIFICATIONS.md): durable jobs, revocation and delivery truth.
- [Integrations](03-architecture/INTEGRATIONS.md): adapters, fields, vendor gates and non-assumed access.
- [Non-functional requirements](03-architecture/NON_FUNCTIONAL_REQUIREMENTS.md): 24 measurable proposed targets.
- [Architecture decisions](03-architecture/ARCHITECTURE_DECISIONS.md): 12 ADRs with rationale and tradeoffs.

## 04 — Trust

- [Privacy and data lifecycle](04-trust/PRIVACY_AND_DATA_LIFECYCLE.md).
- [Encryption and key management](04-trust/ENCRYPTION_KEY_MANAGEMENT.md).
- [Sync and recovery](04-trust/SYNC_AND_RECOVERY.md).
- [Consent and age assurance](04-trust/CONSENT_AND_AGE_ASSURANCE.md).
- [Child safety and community](04-trust/CHILD_SAFETY_AND_COMMUNITY.md).
- [Safety assistance](04-trust/SAFETY_ASSISTANCE.md).
- [Threat model](04-trust/THREAT_MODEL.md): 24 concrete threats and validation expectations.
- [Legal register](04-trust/LEGAL_REGISTER.md): phased DPDP commencement and review obligations.
- [User policy drafts](04-trust/USER_POLICY_DRAFTS.md): clearly unapproved publication templates, not invented legal contacts.

## 05 — AI

- [AI system design](05-ai/AI_SYSTEM_DESIGN.md): local rules first; adult selected-data cloud assistance gated.
- [Prompt contracts](05-ai/PROMPT_CONTRACTS.md): bounded tasks and code-enforced authority.
- [Evaluation plan](05-ai/EVALUATION_PLAN.md): adversarial/grounding/privacy cases and release thresholds.

## 06 — Delivery

- [Roadmap](06-delivery/ROADMAP.md) and [backlog](06-delivery/BACKLOG.md): 26 tasks with dependencies and gates.
- [Bolt build playbook](06-delivery/BOLT_BUILD_PLAYBOOK.md) and [Codex handover](06-delivery/CODEX_HANDOVER.md).
- [Engineering standards](06-delivery/ENGINEERING_STANDARDS.md).
- [Test strategy](06-delivery/TEST_STRATEGY.md) and [64 acceptance cases](06-delivery/test-cases.json).
- [Release gates](06-delivery/RELEASE_GATES.md): G0–G8 and specialist evidence.
- [Operations runbook](06-delivery/OPERATIONS_RUNBOOK.md).
- [Cost model](06-delivery/COST_MODEL.md) and [risk register](06-delivery/RISK_REGISTER.md).
- [Current status](06-delivery/STATUS.md) and [baseline verification report](06-delivery/BASELINE_VERIFICATION.md).

## 07 — Reference

- [Primary sources and limitations](07-reference/SOURCES.md).
- [Ownership and licensing](07-reference/OWNERSHIP_AND_LICENSING.md).
- [Glossary](07-reference/GLOSSARY.md).

## Machine-readable contracts and fixtures

[Lifecycle](../contracts/lifecycle.json), [feature flags](../contracts/feature-flags.json), [golden policy cases](../contracts/golden-policy-cases.json), [vault envelope draft](../contracts/vault-envelope.schema.json), [consent receipt](../contracts/consent-receipt.schema.json), [opportunity](../contracts/opportunity.schema.json), [event envelope](../contracts/events.schema.json), [synthetic personas](fixtures/synthetic-personas.json), [synthetic opportunities](fixtures/sample-opportunities.json).

## Repository operation

[Agent instructions](../AGENTS.md), [contributing](../CONTRIBUTING.md), [security](../SECURITY.md), [changelog](../CHANGELOG.md), [validator](../scripts/validate_docs.py), [validator tests](../scripts/test_validate_docs.py), [CI workflow](../.github/workflows/docs-validation.yml).

Run `python3 scripts/validate_docs.py` and `python3 -m unittest discover -s scripts -p 'test_*.py' -v`. These verify the documentation baseline, not application correctness, encryption or legal compliance.
