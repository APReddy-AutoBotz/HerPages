import { z } from "zod";

export const ConsentPurpose = z.enum([
  "service_account",
  "child_history",
  "encrypted_backup",
  "minor_participation",
  "program_application",
  "adult_community",
  "adult_ai_selected",
  "adult_safety_session",
]);
export type ConsentPurpose = z.infer<typeof ConsentPurpose>;

export const ConsentState = z.enum(["active", "withdrawn", "superseded"]);
export type ConsentState = z.infer<typeof ConsentState>;

export const ConsentReceipt = z.object({
  receipt_id: z.string().uuid(),
  actor_id: z.string().uuid(),
  subject_id: z.string().uuid(),
  purpose: ConsentPurpose,
  notice_version: z.string().min(1),
  policy_version: z.string().min(1),
  assurance_reference: z.string().min(1),
  granted_at: z.string().datetime(),
  withdrawn_at: z.string().datetime().nullable(),
  state: ConsentState,
});
export type ConsentReceipt = z.infer<typeof ConsentReceipt>;
