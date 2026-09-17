# AI input provenance and enforcement limits

This note is a mandatory elaboration of FR-046–048 before G6. The draft OpenAPI `selected_text` field is a transport sketch, not permission to enable an unrestricted text-upload API.

## Known child context must be blocked

Before cloud AI is enabled, the command must carry a purpose-bound context reference that the service resolves to the actual policy subject and consent. A guardian requesting assistance on a known child-history collection is still processing the child's information, even though the guardian is an adult. Check the subject, not only the caller. The mobile selector must preserve collection provenance and must not offer child-history/private-minor material to adult AI tools. Unknown context fails closed.

Extend the draft request schema with the reviewed context/subject contract during HP-017; retain a regression case where an adult actor selects a known minor subject. Do not rely on a client-provided boolean such as `contains_child_data:false` as authorization.

## What cannot be guaranteed

A system cannot reliably prove that arbitrary text pasted by an adult contains no information about a child or another person. Content classifiers and redaction can reduce risk but do not make perfect provenance detection possible. Do not market a guarantee that every misdeclared third-party detail will be detected.

Therefore the first AI release should prefer approved catalog explanations and constrained adult self-selected tasks, prohibit unauthorized third-party personal input, explain the boundary and minimize retained content. Free-form private-text upload remains disabled until its additional data-risk review passes. These limits supplement, rather than weaken, the baseline prohibition on cloud processing of known minor personal records.

## Required tests

Known child subject with adult caller → block before provider. Unknown subject/context → block. Adult personal context without current consent → block. Published catalog with valid purpose → allowed only after G6. Deliberately misdeclared pasted text → document residual risk, exercise filters and reporting, and do not claim complete detection. No prompt can replace these gateway decisions.
