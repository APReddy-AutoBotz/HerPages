import { z } from "zod";

export const LifecycleStageId = z.enum([
  "first_pages",
  "wonder",
  "bloom",
  "aura",
  "horizon",
  "rise",
  "momentum",
  "rooted",
  "flourish",
  "evergreen",
]);
export type LifecycleStageId = z.infer<typeof LifecycleStageId>;

export const LifecycleStage = z.object({
  id: LifecycleStageId,
  label: z.string(),
  minAge: z.number().int().min(0),
  maxAge: z.number().int().min(0).nullable(),
});
export type LifecycleStage = z.infer<typeof LifecycleStage>;

export const Jurisdiction = z.object({
  adultAge: z.number().int(),
  assuranceRequiredForConnectedAdultCapabilities: z.boolean(),
  unknownAgePolicy: z.enum(["deny_restricted"]),
  childProcessingRequiresReleaseGate: z.string(),
});
export type Jurisdiction = z.infer<typeof Jurisdiction>;

export const LifecycleContract = z.object({
  schemaVersion: z.literal("1.0"),
  stages: z.array(LifecycleStage),
  visualPolicy: z.object({
    themeChange: z.literal("opt_in"),
    userOverride: z.boolean(),
    authoritySource: z.literal(false),
    unknownTheme: z.literal("neutral"),
  }),
  jurisdictions: z.record(z.string(), Jurisdiction),
  serverAuthorityFields: z.array(z.string()),
  neverAuthorityFields: z.array(z.string()),
});
export type LifecycleContract = z.infer<typeof LifecycleContract>;
