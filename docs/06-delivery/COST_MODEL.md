# Cost model and budget controls

This document contains formulas and planning assumptions, not current vendor quotes. Recheck official pricing, taxes, regions and contractual terms before purchasing. No paid service is provisioned by the documentation.

## Main cost drivers

Cloud database/auth, encrypted object storage and retrieval/egress, backup versions, API/worker hosting, notifications/SMS if introduced, assurance checks, app-store/payment fees, AI requests, editorial verification, support/moderation, security/legal review and native test devices/builds. Free builder usage does not pay these recurring costs.

## Worksheet formulas

```text
monthly_stored_GB = backed_up_users * average_live_GB_per_user * retained_version_multiplier
monthly_egress_GB = restores * average_restore_GB + catalog_delivery_GB + other_authorized_downloads_GB
monthly_AI_cost = requests * ((avg_input_tokens * input_price_per_million + avg_output_tokens * output_price_per_million) / 1000000)
monthly_variable_cost = storage_GB * storage_unit_price + egress_GB * egress_unit_price + AI_cost + assurance_checks * price_per_check + notification_cost
net_subscription_revenue = collected_revenue - taxes - store/payment_fees - refunds
contribution = net_subscription_revenue - variable_cost - allocated_support_editorial_moderation
```

All vendor unit prices are inputs to be verified, not hardcoded assumptions. Include retained backups rather than counting only current photos. Currency conversion must use the purchase-date rate and be recorded.

## Illustrative storage stress cases — not growth forecasts

| Scenario | Backed-up users | Average live vault | Version multiplier | Modeled stored data |
|---|---:|---:|---:|---:|
| Small adult test | 100 | 0.2 GB | 1.5 | 30 GB |
| Bounded beta | 1,000 | 0.5 GB | 2 | 1,000 GB |
| Larger media-heavy cohort | 10,000 | 2 GB | 2 | 40,000 GB |

These calculations show why 'unlimited lifetime photos' is not a sensible default promise. Encryption does not eliminate storage/egress costs, and lawful deletion may not instantly remove every service-backup byte.

## Controls

Set object/file-size limits, per-account quotas, upload grants, rate limits, model budgets and worker retry ceilings. Notify before quota exhaustion. Cost kill switches stop expensive connected operations, not private local capture/export or official help access. Enforce server-side; a UI limit alone is bypassable.

## Commercial release gate

Approve a monthly operating ceiling and alert thresholds, actual vendor pricing, support/editorial staffing, per-cohort contribution model and downgrade/export behavior. Do not infer profitability from low hosting cost while ignoring people, assurance and security. Subscription research prices in the product docs are hypotheses only.
