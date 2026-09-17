import { z } from "zod";

export const AssuranceLevel = z.enum(["adult", "minor", "unknown", "disputed"]);
export type AssuranceLevel = z.infer<typeof AssuranceLevel>;

export const RelationshipState = z.enum([
  "proposed",
  "assurance_pending",
  "active",
  "suspended",
  "revoked",
]);
export type RelationshipState = z.infer<typeof RelationshipState>;

export const AdulthoodTransitionState = z.enum([
  "minor_active",
  "transition_due",
  "independent_identity_pending",
  "key_transfer_pending",
  "adult_independent",
  "disputed",
  "blocked",
]);
export type AdulthoodTransitionState = z.infer<typeof AdulthoodTransitionState>;

export const CapabilityName = z.enum([
  "adult_community",
  "independent_adult_setup",
  "adult_ai_selected",
  "adult_safety_sessions",
  "mentor_programs",
  "child_history_access",
  "beneficiary_private_vault",
  "personal_vault",
  "adult_minor_dm",
  "minor_live_location",
  "public_minor_profiles",
  "police_dispatch_integration",
]);
export type CapabilityName = z.infer<typeof CapabilityName>;

export const PolicyDecision = z.object({
  allowed: z.boolean(),
  reason: z.string(),
});
export type PolicyDecision = z.infer<typeof PolicyDecision>;

export const PolicySubject = z.object({
  age: z.number().int().nullable(),
  assurance: AssuranceLevel,
  jurisdiction: z.string(),
  relationship: RelationshipState.optional(),
  transition: AdulthoodTransitionState.optional(),
});
export type PolicySubject = z.infer<typeof PolicySubject>;
