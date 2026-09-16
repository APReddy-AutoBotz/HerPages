# AI system design

## AI is an optional assistant, not the product's authority

The useful baseline does not require a model: private capture, local search, routines, explicit-interest filtering and source-verified opportunity discovery work without cloud AI. The model cannot grant permissions, establish age/guardianship, decide legal obligations, diagnose, guarantee safety or automatically apply for a program.

## Three processing modes

| Mode | Input | Output | Release posture |
|---|---|---|---|
| Deterministic local | Chosen interests, reviewed catalog, user rules | Filtered opportunities and explainable suggestions | Baseline after policy review |
| On-device AI | Explicitly selected local content | Optional local drafting/explanation | Future capability/device spike; not promised on every phone |
| Cloud assistance | Adult's explicitly selected, purpose-bounded material | Source-grounded draft or explanation | Off until provider/privacy/security/evaluation gates pass |

Do not silently fall back from on-device to cloud processing. If a local model is unavailable, explain the limitation and offer a non-AI path. Local processing is not a blanket child-law exemption.

## Request flow

`choose purpose → select exact inputs → preview disclosure → fresh capability/consent check → minimize/redact → provider adapter → schema and safety checks → show answer with sources/limitations → store only if user chooses`.

For cloud requests the API and provider may see selected plaintext. E2EE backup claims do not cover that processing. The UI names the provider and applicable retention. Training opt-out, `store:false`, zero-data-retention eligibility and endpoint-specific logs are different concepts; verify the actual contract and feature. [S12]

Baseline child-personal cloud AI is blocked before input is forwarded. Do not turn a guardian checkbox into an unlimited exception. General reviewed parenting content is editorially prepared; a parent's request containing a child's intimate information is also child-data processing and subject to the same gate.

## Approved initial adult purposes

Explain a published opportunity; summarize a selected adult goal; suggest alternatives from a reviewed activity catalog; draft a reflection the adult can edit. No unrestricted companion persona, engagement-maximizing emotional dependency, romantic behavior or claims of understanding hidden personality.

An opportunity answer references catalog IDs/source URLs and distinguishes eligible, possibly eligible and unknown. The model must not invent a scholarship, deadline, course, price, police number or mentor credential. A no-result answer is acceptable.

## Architecture

The AI gateway owns provider selection, policy checks, quotas, timeout, redaction and response validation. The model adapter receives no database service-role key, vault master key, arbitrary browser, user search directory or outbound messaging credential. Treat catalog documents and uploaded text as untrusted data. Instructions inside them cannot change policy or request extra data.

Store prompt templates/version, model identifier, purpose, approximate usage and redacted outcome codes. Do not retain raw prompts/responses by default. A voluntary diagnostic disclosure is a separate consented workflow with retention and restricted access, never required to keep using the vault.

## Safety boundaries

Health, legal, financial and safeguarding topics receive bounded general information and appropriate qualified/official resources; no prescription, diagnosis, investment instruction or professional replacement. The assistant does not assess whether a girl is attractive, feminine, intelligent enough or destined for a career. It avoids shame, coercion and assumptions about family roles.

Urgent danger prompts should present verified official help options without waiting for a lengthy generated answer. An LLM is not the emergency routing engine. Never create a false confirmation that authorities have been notified.

## Reliability and cost

Use structured outputs with bounded lengths and allowed references. Rate-limit per account/purpose; reject oversized input; apply an explicit per-request token/cost ceiling. Retry only safe idempotent requests. Explain provider outage and preserve local operation. Do not sell 'unlimited AI' against unbounded upstream costs.

Release decisions use `EVALUATION_PLAN.md`, not a subjective demo. Any privacy exfiltration, minor gate bypass, fabricated emergency number or unsafe action is a blocking failure.
