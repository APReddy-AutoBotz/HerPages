import { z } from "zod";

export const EventType = z.enum([
  "consent.withdrawn",
  "relationship.suspended",
  "device.revoked",
  "snapshot.created",
  "snapshot.finalized",
  "snapshot.failed",
  "catalog.review_due",
  "opportunity.expired",
  "deletion.requested",
  "deletion.completed",
  "organization.member_revoked",
  "moderation.case_opened",
  "entitlement.changed",
]);
export type EventType = z.infer<typeof EventType>;

export const DomainEvent = z.object({
  event_id: z.string().uuid(),
  event_type: EventType,
  schema_version: z.literal("1.0"),
  occurred_at: z.string().datetime(),
  resource_ref: z.string().min(1),
  policy_version: z.string().min(1),
  idempotency_key: z.string().min(8).max(128),
});
export type DomainEvent = z.infer<typeof DomainEvent>;
