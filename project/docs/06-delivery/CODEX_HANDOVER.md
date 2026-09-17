# Codex continuation and handover

## Source of truth

GitHub holds requirements, decisions, code, contracts, tests and status. No implementation-critical knowledge may live only in Bolt chat history. Codex must inspect the actual repository before estimating progress or continuing.

## Starting prompt

```text
Continue HerPages from the current GitHub default branch. Read AGENTS.md and the documentation index, then STATUS.md, BACKLOG.md and RELEASE_GATES.md. Verify the exact commit and working tree. Do not assume any planned feature is implemented. Identify the earliest unblocked task on the critical path, inspect its requirements/tests, and propose a bounded implementation tranche.

Preserve local-first privacy, native encryption, independent age/permission policy and explicit release flags. Use synthetic fixtures only. Do not make a web fallback for the private vault. Do not deploy or connect production personal data. Run available checks and report not-run native/security/legal reviews honestly. Update task status, architecture decisions and handover evidence before finishing.
```

## Clean-room checklist

Fresh clone on a second environment; no hidden files or builder state; documented supported OS/toolchain; exact dependency lockfile; reproducible native development build; tests and lint; environment-variable names with no secrets; migrations from empty service database; synthetic seed; offline vault proof; encrypted restore; catalog errors; roles/feature flags; release manifest; rollback notes.

The baseline currently contains documentation and validation tools only. Application setup commands are added when scaffolding actually exists. Do not claim a native app can run from this documentation baseline alone.

## Handover manifest

Record branch/commit, completed tasks, partially implemented tasks, requirement/test coverage, active flags, mock adapters, providers not connected, migrations, actual test commands/results, known defects, screenshots using synthetic data and next task. Never include user private material or API keys. A temporary preview URL is not the artifact of record.

## Subagent strategy

Assign independent scopes: UX/components, catalog/contracts, test fixtures, documentation review. A single integrator owns auth/age/consent, encryption, migrations, dependencies and release configuration. Crypto and child safety require specialist review beyond AI subagent consensus. Merge only after cross-module negative tests pass.

## Completion reporting

Report 'specified', 'implemented', 'tested', 'reviewed' and 'released' separately. Do not state a percentage unless it is derived from an agreed weighted backlog with evidence. A generated file, mock screen or passing unit test does not imply production readiness.
