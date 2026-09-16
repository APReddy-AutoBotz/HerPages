# AI system design

## AI is an optional assistant, not the product's authority

The useful baseline does not require a model: private capture, local search, routines, explicit-interest filtering and source-verified opportunity discovery work without cloud AI. The model cannot grant permissions, establish age/guardianship, decide legal obligations, diagnose, guarantee safety or automatically apply for a program.

**Required companion specification:** [Input provenance and enforcement limits](INPUT_PROVENANCE_AND_LIMITS.md). The draft API is not permission to enable unrestricted private-text upload. Before G6, commands need reviewed subject/context provenance; known child context must be blocked even when the caller is an adult. Arbitrary pasted text cannot be perfectly classified by subject.

## Three processing modes

| Mode | Input | Output | Release posture |
|---|---|---|---|
| Deterministic local | Chosen interests, reviewed catalog, user rules | Filtered opportunities and explainable suggestions | Baseline after policy review |
| On-device AI | Explicitly selected local content | Optional local drafting/explanation | Future capability/device spike; not promised on every phone |
| Cloud assistance | Adult's explicitly selected, purpose-bounded material | Source-grounded draft or explanation | Off until provider/privacy/security/evaluation gates pass |

Do not silently fall back from on-device to cloud processing. If a local model is unavailable, explain the limitation and offer a non-AI path. Local processing is not a blanket child-law exemption.

## Request flow

`choose purpose → resolve subject/context → select exact inputs → preview disclosure → fresh capability/consent check → minimize/redact → provider adapter → schema and safety checks → show answer with sources/limitations → store only if user chooses`.

For cloud requests the API and provider may see selected plaintext. E2EE backup claims do not cover that processing. The UI names the provider and applicable retention. Training opt-out, `store:false`, zero-data-retention eligibility and endpoint-specific logs are different concepts; verify the actual contract and feature. [S12]

Known child-personal cloud requests are blocked before forwarding. A guardian checkbox is not an unlimited exception. General reviewed parenting content is editorially prepared; a parent's request about a child's intimate records is child-data processing, not adult-only data merely because the parent submitted it. Free-form personal text remains gated due to uncertain provenance.

## Approved initial adult purposes

Explain a published opportunity; summarize a selected adult goal; suggest alternatives from a reviewed activity catalog; draft a reflection the adult can edit. No unrestricted companion persona, engagement-maximizing emotional dependency, romantic behavior or claims of understanding hidden personality.

An opportunity answer references catalog IDs/source URLs and distinguishes eligible, possibly eligible and unknown. The model must not invent a scholarship, deadline, course, price, police number or mentor credential. A no-result answer is acceptable.

## Architecture

The gateway owns provider selection, subject/policy checks, quotas, timeout, redaction and response validation. The model receives no database service-role key, vault master key, arbitrary browser, user directory or outbound messaging credential. Treat source documents as untrusted data. Instructions inside them cannot change policy or request extra data.

Store template/version, model identifier, purpose, approximate usage and redacted outcome codes. Do not retain raw prompts/responses by default. Voluntary diagnostic disclosure is separate, consented and retention-limited, never required to keep using the vault.

## Safety boundaries

Health, legal, financial and safeguarding topics receive bounded general information and appropriate qualified/official resources; no prescription, diagnosis, investment decision or professional replacement. Do not assess whether a girl is attractive, feminine, intelligent enough or destined for a career. Avoid shame, coercion and assumed family roles.

Urgent danger prompts present verified official help without waiting for a long generated answer. The LLM is not the emergency routing engine. Never falsely confirm authorities were notified.

## Reliability, evaluation and cost

Use structured outputs with bounded lengths and authorized references. Rate-limit per account/purpose; reject oversized input; enforce token/cost ceilings. Retry only safe idempotent requests. Explain provider outage and preserve local operation. No unbounded 'unlimited AI' promise.

Use the held-out and adversarial suite in `EVALUATION_PLAN.md`, testing gateway/UI as well as prompts. Any privacy exfiltration, known-minor gate bypass, fabricated emergency confirmation or unauthorized action blocks release. A classifier's imperfect detection of misdeclared text must remain an explicit residual risk, never hidden by a safety score.
