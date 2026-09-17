# Contributing

HerPages is an owner-led product repository. Public visibility is not a blanket software license. Read `docs/07-reference/OWNERSHIP_AND_LICENSING.md` before redistributing material.

## Contributions

Use branches named `docs/<topic>`, `feat/<task>-<topic>` or `fix/<task>-<topic>`. Every change references a backlog task and requirement IDs. Discuss a material privacy, stack or lifecycle change in an ADR before implementation. Feature requests are proposals, not approval to enable a feature in production.

PRs must describe the user problem, data classes touched, implementation and tests. Never include real user information in screenshots, fixtures or logs. Use synthetic personas. Do not submit security vulnerabilities through public issues; follow `SECURITY.md`.

Keep Markdown links relative, define unfamiliar terms, use ISO dates, and distinguish facts, design decisions, hypotheses and measured results. External technical and regulatory claims must link to primary sources with a check date in the source register. Do not copy licensed standards or proprietary material into the repo.

## Review rules

A normal implementation change needs product/engineering review. Changes involving cryptography, key recovery, child access, consent, moderation, location, payments or personal-data export need the corresponding specialist gate. The project owner can prioritize but cannot replace evidence of a completed security or legal review.

CI and tests must run against the exact reviewed head. Do not force-push the protected default branch. No mass formatting unrelated to the change. No secrets in `.env`, prompts, API examples or commit messages.

## Documentation checks

```sh
python3 scripts/validate_docs.py
```

The baseline uses Python's standard library for document consistency checks. App commands will be added when real scaffolding exists. Do not add scripts that return success without testing anything.
