# HP-002 repository repair note

On 2026-09-17, manual transfer of the Bolt workspace accidentally placed the complete HerPages repository tree under a top-level `/project/` directory and included transfer-only artifacts plus a stale npm `package-lock.json` alongside the intended pnpm lockfile.

Repair actions:

1. Used the committed `/project/` tree as the authoritative HP-002 content snapshot.
2. Flattened that tree back to repository root.
3. Restored the repository `.gitignore` from the pre-transfer baseline.
4. Removed `package-lock.json`; pnpm is the selected package manager and `pnpm-lock.yaml` remains authoritative.
5. Removed `hp-002-foundation.patch` and `hp-002-foundation.bundle` from the live repository because they were transfer artifacts, not product source.
6. Removed the transfer-only root `.gitkeep`.
7. Updated STATUS to distinguish Bolt-reported tests from fresh GitHub verification.

No HP-003 encryption functionality was introduced by the repair. The next step is a fresh repository checkout/CI verification of HP-002 before HP-003 begins.

Relevant history remains preserved in Git and can be recovered from prior commits if needed. The repair intentionally avoids rewriting existing history.
