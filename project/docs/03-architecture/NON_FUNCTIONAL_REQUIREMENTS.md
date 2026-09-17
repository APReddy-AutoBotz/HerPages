# Non-functional requirements and measurable targets

All numbers are proposed acceptance targets, not measured production performance or vendor guarantees. Record test hardware, OS, build, dataset and network before claiming a pass.

| ID | Requirement | Acceptance target / proof |
|---|---|---|
| NFR-01 | Offline core | Create/edit/search a text Page in airplane mode; no cloud account required for adult personal local mode |
| NFR-02 | Local durability | Kill app during save/media import; no committed Page corruption or plaintext orphan file |
| NFR-03 | Local performance | On agreed mid-range Android reference device, p95 text save under 250 ms excluding user interaction; local search under 500 ms at 10,000 text Pages |
| NFR-04 | Startup | Usable locked/start screen under 3 seconds p95 on agreed reference hardware; vault unlock latency measured separately |
| NFR-05 | Service latency | p95 simple authorized metadata requests under 750 ms within selected region at beta load; AI/uploads excluded |
| NFR-06 | Availability | Target 99.5% monthly for beta connected core; private local features remain usable during outages; not an emergency SLA |
| NFR-07 | Backup integrity | Corrupted, reordered, duplicate and incomplete objects never replace a valid local vault; 100% of release recovery fixtures pass |
| NFR-08 | Service recovery | Proposed service RPO 24 h/RTO 8 h in beta, verified by drill; vault recovery point is last successful user backup, not the database RPO |
| NFR-09 | Authorization | Zero unauthorized reads/writes across role/tenant/device/consent negative test suite |
| NFR-10 | Private-data leakage | Zero plaintext vault content/key material in inspected network traces, logs, crash payloads, backups and exported telemetry for tested paths |
| NFR-11 | Accessibility | Web WCAG 2.2 AA target plus native VoiceOver/TalkBack, large-text, keyboard and reduced-motion passes [S11] |
| NFR-12 | Localization | All product copy externalized; English complete, Telugu pilot-critical flows human-reviewed before enablement |
| NFR-13 | Battery/data | No idle polling loop or default background location; measure daily idle impact and upload bytes on reference devices |
| NFR-14 | Storage limits | Configurable quotas, chunked encrypted media, low-space warnings and deletion cleanup; no unbounded media preload |
| NFR-15 | Privacy withdrawal | Revoke server access and cancel unsent disclosures promptly; target under 60 s propagation in test, recheck on every sensitive operation |
| NFR-16 | Deletion | Explain and test class-specific schedules, backup tombstones and lawful holds; no unqualified immediate-erasure promise |
| NFR-17 | Auditability | Privileged changes record actor, action, scope, time, policy and result without sensitive payloads |
| NFR-18 | Supply chain | Pin dependencies/lockfile, scan licenses/secrets/vulnerabilities, generate release SBOM, review signed update pipeline |
| NFR-19 | Observability | Request/queue health metrics; alerts and runbooks; no raw prompts or Pages in traces |
| NFR-20 | Cost control | Enforce per-account/object/model budgets server-side; feature disable preserves vault/export/help access |
| NFR-21 | Portability | Export with format manifest; restore across supported versions and clean devices; no Bolt-only dependency |
| NFR-22 | Safety honesty | Never show dispatched/delivered/rescued without corresponding verified evidence; all known failure states tested |
| NFR-23 | Policy isolation | Theme, client clock, JWT stale roles and organization IDs cannot unlock a restricted capability |
| NFR-24 | Upgrade safety | Migrations have preflight, encrypted recovery checkpoint, validation and documented forward-fix/rollback; schema compatibility matrix |

Security-critical tests are gates, not percentage averages: a high overall test pass rate does not excuse a cross-tenant leak. Load-test fixture content is synthetic. Native performance and backup feasibility must be measured before the targets are adopted as product commitments.
