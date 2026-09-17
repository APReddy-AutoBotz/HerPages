# Engineering standards

## Structure and contracts

Use the documented modular boundaries. Pure domain code has no direct provider SDK dependency. API and storage adapters enforce schemas and permissions. No generic endpoint accepting a table name and arbitrary JSON. Generate types from reviewed contracts where useful, but server runtime validation remains mandatory.

## Code quality

TypeScript strict mode; explicit null/unknown states; no unchecked `any` across trust boundaries; parameterized SQL; bounded inputs; UTC timestamps and explicit civil dates; cancellation/timeouts; idempotency for external effects; clear error taxonomy. Avoid broad exception swallowing and silent insecure fallbacks.

## Dependencies

Select compatible stable versions using official docs, pin lockfiles, check licenses/provenance and record native dependencies. Do not add a package solely because an AI generator suggested it. Keep dependencies few and reviewed, especially crypto, auth, analytics and native plugins.

## Database changes

Logical models are not migrations. Create actual migrations using the supported toolchain, test from an empty isolated database and a previous release snapshot, include RLS/grants/indexes and run security advisors. No production schema change through an undocumented dashboard click. Never use elevated functions to hide a broken access model.

## Secrets and environments

Never commit secrets. Public client configuration may include a reviewed publishable service key, never a service-role/private key. Use separate secrets per environment, least privilege and rotation. Do not print `.env` contents in CI. Example files contain names and descriptions only, not real-looking tokens.

## Web security

Sensitive pages are non-publicly cached. Validate sessions on server routes, apply CSRF/origin controls for cookie-based mutations, sanitize output, enforce CSP/security headers where appropriate and avoid arbitrary URL-fetching. Community uploads use validated types/size and isolated rendering. Signed storage URLs are bounded bearer capabilities, not public assets.

## Native security

Test release builds, OS backup paths, biometrics, process death and locked-screen previews. Do not persist secrets in AsyncStorage or global UI stores. Accessibility and keyboard/dictation behavior are part of the privacy review. No debug bypass reaches a production build.

## PR and release discipline

Link HP/FR/TST IDs, show actual commands/results, document changes to data flow and screenshots with synthetic fixtures. Protect default/release branches, pin CI actions, review dependency updates and separate release signing. Branch protections and private security reporting are configuration tasks; this documentation does not claim they were enabled.

## Implementation manifest

For each integration record `mock`, `sandbox` or `production`; each feature records `specified`, `implemented`, `tested`, `reviewed`, `released`. No screen, README badge or marketing copy may imply a later state without evidence.
