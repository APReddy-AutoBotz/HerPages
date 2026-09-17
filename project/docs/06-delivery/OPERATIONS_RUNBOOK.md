# Operations and incident runbook

## Prelaunch ownership

Name product, engineering, privacy, safeguarding, editorial, support and security incident owners. These roles are not staffed merely because this file lists them. A founder working remotely can coordinate operations, but an unstaffed safety/moderation function is a launch blocker.

## Environments

Development: synthetic data and mock integrations. Staging: isolated accounts/keys/buckets, test processors and no real child data without approved protocol. Production: explicit approvals, least privilege, region/processor inventory, signed release and monitoring. No builder preview uses production credentials.

## Daily/weekly operations

Review failed backups, deletion jobs, queue age, revoked access anomalies, catalog recheck/expiry, billing errors and support cases. Weekly review source freshness, cost budgets, access grants, dependencies and incidents. Operational dashboards show redacted counts, not journals or exact interests.

## Incident procedure

1. Triage and contain: disable the affected connected feature, revoke compromised credentials, preserve lawful minimal evidence. Preserve local vault/export/help access where safe.
2. Determine scope using redacted logs and authorized investigation; do not demand users upload entire vaults.
3. Privacy/security lead and counsel assess notification/reporting obligations and deadlines. Applicable CERT-In directions can require rapid reporting; the runbook must be verified for the entity and incident. [S13]
4. Communicate known facts, uncertainty and user actions; no 'no data affected' claim before evidence.
5. Fix and verify against the exact affected builds, rotate relevant keys/credentials, and reconcile deletion/revocation on restored systems.
6. Review causes and publish an appropriate sanitized incident summary.

## Specific runbooks

**Lost key:** explain available trusted-device/recovery options. Account reset cannot decrypt. Do not create an employee bypass.

**Backup outage:** keep local writes, show pending/failed status, pause destructive retention, resume safely and verify complete snapshots.

**Cross-tenant exposure:** disable relevant route/export, revoke grants, preserve evidence, assess affected records and notify under the approved process.

**Unsafe opportunity:** suspend listing, review destination/source, notify affected applicants through minimal approved channels and record correction.

**Moderation overload:** limit/pause publishing and mentoring, show actual coverage, prioritize urgent reports and keep official resources available.

**Provider/AI change:** disable gateway if contract/privacy behavior changes; do not automatically reroute private input to a different processor.

**Bad client release:** stop rollout/OTA as applicable, publish minimum safe version and preserve local export; signing does not guarantee code was benign.

## Backup and disaster recovery

Service database backups protect service records, not user-held encryption keys. Test RPO/RTO separately from last user snapshot. Restore to isolated environment, apply deletion/revocation tombstones, verify access policies and only then restore traffic. Rehearse key rotation and interrupted migrations.

## Support privacy

Use case-scoped diagnostics and explicit user-selected screenshots/text. No screen-sharing request that exposes a child's whole history. Verify identity before service changes but do not retain unnecessary proof. Support cannot recover an absent vault key or override adulthood ownership through a relative's request.
