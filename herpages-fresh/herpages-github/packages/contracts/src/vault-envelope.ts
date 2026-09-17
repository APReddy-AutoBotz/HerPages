import { z } from "zod";

export const VaultEnvelope = z.object({
  format_version: z.literal("1.0-draft"),
  vault_id: z.string().uuid(),
  object_id: z.string().uuid(),
  key_epoch: z.number().int().min(1),
  crypto_profile: z.literal("REQUIRES_REVIEWED_NATIVE_PROFILE"),
  nonce_b64: z.string().min(1),
  aad_b64: z.string().min(1),
  ciphertext_b64: z.string().min(1),
  ciphertext_sha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type VaultEnvelope = z.infer<typeof VaultEnvelope>;
