import { z } from "zod";

export const OpportunityCategory = z.enum([
  "learning",
  "scholarship",
  "career",
  "event",
  "volunteering",
  "mentoring",
]);
export type OpportunityCategory = z.infer<typeof OpportunityCategory>;

export const OpportunityMode = z.enum(["remote", "onsite", "hybrid"]);
export type OpportunityMode = z.infer<typeof OpportunityMode>;

export const OpportunityStatus = z.enum([
  "draft",
  "under_review",
  "published",
  "suspended",
  "expired",
  "archived",
]);
export type OpportunityStatus = z.infer<typeof OpportunityStatus>;

export const Eligibility = z.object({
  min_age: z.number().int().min(0).nullable(),
  max_age: z.number().int().min(0).nullable(),
  description: z.string(),
});
export type Eligibility = z.infer<typeof Eligibility>;

export const Opportunity = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(180),
  organizer: z.string().min(1),
  source_url: z.string().url(),
  application_url: z.string().url(),
  category: OpportunityCategory,
  countries: z.array(z.string().regex(/^[A-Z]{2}$/)).min(1),
  mode: OpportunityMode,
  eligibility: Eligibility,
  cost_status: z.enum(["free", "paid", "unknown"]),
  deadline: z.string().datetime().nullable(),
  timezone: z.string().min(1),
  status: OpportunityStatus,
  verified_at: z.string().datetime().nullable(),
  is_demo: z.boolean(),
});
export type Opportunity = z.infer<typeof Opportunity>;
