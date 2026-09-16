# Security policy — pre-release

HerPages is currently a documentation baseline. There is no production application or published security certification.

## Reporting a concern

Do not put vulnerabilities, exploit details, tokens, account identifiers, private Pages, children's data or identity documents into public GitHub issues. Use GitHub's private vulnerability-reporting channel **only if it is enabled**, or an already-established private channel with the repository owner. A dedicated monitored security contact and private reporting configuration must be established before any beta; neither is claimed to be active here.

If no private route is available, open a content-free issue asking for a private reporting contact. Do not post the vulnerability itself. Do not test against people or infrastructure without authorization.

## Supported versions

No released versions yet. Every future release must publish its support window, minimum safe client version and vulnerability-handling process.

## Critical security objectives

Private vault data is encrypted on device. Optional cloud backups contain client-encrypted objects, not readable Pages. This is an implementation objective, not an implemented guarantee. Account authentication and vault-key recovery are separate. Logs, notifications, analytics and support tools must not disclose vault content.

All exposed service tables and storage paths require authorization. Parent relationships, adulthood transitions, partner tenancy and moderator privileges must have explicit negative tests. Girls'/women's eligibility is not inferred from appearance. Community content is a different trust boundary from the private vault and can be reviewed by authorized moderation staff.

## Release requirements

Before personal-data beta: threat-model review, dependency/secret scans, auth and RLS tests, mobile storage inspection, consent review, deletion/export tests, verified key recovery and an incident-response drill. Before community or safety release: additional abuse testing, trained operational coverage, store-policy review and delivery-failure testing.

See `docs/04-trust/THREAT_MODEL.md`, `docs/04-trust/ENCRYPTION_KEY_MANAGEMENT.md` and `docs/06-delivery/RELEASE_GATES.md`. A security badge may not be displayed on the basis of documentation alone.
