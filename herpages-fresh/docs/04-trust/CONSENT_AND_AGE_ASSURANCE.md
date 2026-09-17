# Consent, age assurance and guardianship

**Status:** conservative product policy plus implementation requirements; qualified legal review is mandatory before real child processing. Sources: S01, S02, S25 and jurisdiction/store entries in the legal register.

## India baseline

Treat under-18 connected users as minors for product-policy purposes. This is independent of visual chapters and does not assert that every DPDP provision is already in force. The notification phases substantive Act and Rules provisions; maintain current effective-date review.

Local styling may use a user-selected stage without identity proof. Connected restricted capabilities require an approved assurance state. Unknown, inconsistent or disputed age is restrictive. Do not unlock adult features from a client date, device clock, profile dropdown or editable JWT metadata.

## Purpose-specific consent

Separate purposes: account/service processing, child-history processing, optional encrypted backup, reviewed minor participation, organization application, community participation, cloud AI and future location sessions. Acceptance of broad terms is not a substitute for an applicable purpose-specific consent process. No preselected optional boxes or consent bundled with a safety-resource screen.

A receipt records actor, subject, purpose, notice version, policy version, assurance reference, time, scope and withdrawal state. Avoid raw identity documents unless legally necessary and approved. Receipts must be understandable and retrievable by the relevant person. The machine schema is in `../../contracts/consent-receipt.schema.json`.

## Guardian verification

A claimed parent is not automatically authorized. Verify adult status and legal relationship through an approved process with proportional evidence and a failure/appeal route. The service must not infer parental authority from surname, shared IP, possession of a child's phone or payment card. A guardian of any gender is allowed authorized guardian functions, not automatic community membership.

Prefer an assurance provider that returns bounded evidence/attestation and supports consent, deletion, security and jurisdiction requirements. Vendor selection is unresolved. Do not treat a government ID image, biometric gender inference or a face-age estimate as a complete safe/legal solution.

## Child participation and assent

Children need an understandable explanation of who can see each collection and how to ask for help. Age-appropriate assent supports agency but does not replace required guardian consent. No misleading 'secret diary' promise if the actual key or permission model lets a guardian read it. Design parent-visible history and separately protected later private collections deliberately, with specialist review of rights and safeguarding.

No cloud-personal AI, open minor social profile, adult-minor DM or live minor location in the baseline. Explicit interest selection does not automatically exempt recommendation processing from child-data restrictions. Bounded local matching still needs product/legal review.

## Withdrawal and policy changes

When consent is withdrawn, prevent new dependent processing and queued disclosures. Reevaluate grants on sensitive requests; do not rely solely on a long-lived token. Record withdrawal without rewriting the historical receipt. Explain remaining local data, lawfully retained records and recipient copies. A material purpose/provider change triggers new notice and, where required, new consent rather than an invisible settings update.

## Age change and independence

Store server-controlled assurance state and next review/transition date with minimum required underlying evidence. At adulthood, guardian authorization does not become continuing adult consent. Require an independently controlled account and key-transfer workflow. Offer support for missing guardian, disagreement and corrected birth date without exposing private data to resolve the dispute. Theme choice remains independent.

## Shared devices and coercion

Session switching must not reveal another profile. Require reauthentication for sensitive sharing/recovery. Allow quiet, clear reporting and access review, but do not invent a fake vault/duress PIN feature without safety analysis. An abusive guardian may be a risk actor; reports must not automatically notify that guardian.

## Test cases

Reject unknown age for adult community; reject an altered age field; suspend relationship on dispute; refuse a guardian inviting themselves as the child; deny partner access after consent withdrawal; prevent stale-token writes; preserve age-18 adult rights despite Horizon styling; require fresh purpose consent for AI; do not enroll a new key by resetting an email password. Test denied, unavailable and inaccessible verification-provider flows.
