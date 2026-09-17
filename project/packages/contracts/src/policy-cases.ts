import { z } from "zod";

export const PolicyCaseExpectation = z.enum([
  "deny",
  "eligible_subject_to_fresh_checks",
  "eligible_subject_to_gate",
  "deny_without_specific_key_and_grant",
]);
export type PolicyCaseExpectation = z.infer<typeof PolicyCaseExpectation>;

export const GoldenPolicyCase = z.object({
  id: z.string(),
  age: z.number().int().nullable(),
  theme: z.string(),
  assurance: z.enum(["adult", "minor", "unknown"]),
  capability: z.string(),
  expected: PolicyCaseExpectation,
  relationship: z.string().optional(),
  payer: z.boolean().optional(),
});
export type GoldenPolicyCase = z.infer<typeof GoldenPolicyCase>;
