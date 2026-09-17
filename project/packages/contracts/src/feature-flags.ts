import { z } from "zod";

const FeatureGate = z.object({
  enabled: z.boolean(),
  gate: z.string(),
  note: z.string().optional(),
});

export const FeatureFlagsContract = z.object({
  schemaVersion: z.literal("1.0"),
  environment: z.string(),
  flags: z.record(z.string(), FeatureGate),
  policy: z.string(),
});
export type FeatureFlagsContract = z.infer<typeof FeatureFlagsContract>;

export type FeatureFlagName =
  | "synthetic_demo"
  | "real_personal_vault"
  | "cloud_vault_backup"
  | "real_child_processing"
  | "minor_participation"
  | "published_catalog"
  | "partner_applications"
  | "adult_community"
  | "mentor_programs"
  | "cloud_ai_adult_selected"
  | "cloud_ai_minor_personal"
  | "adult_safety_sessions"
  | "minor_live_location"
  | "adult_minor_dm"
  | "public_minor_profiles"
  | "police_dispatch_integration"
  | "subscriptions";
