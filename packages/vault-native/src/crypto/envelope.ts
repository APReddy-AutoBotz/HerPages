import { VaultEnvelope } from "@herpages/contracts";
import type { AeadProvider, AeadResult } from "./aead.js";
import { encodeAad, bytesToBase64, bytesToHex, CRYPTO_PROFILE, FORMAT_VERSION } from "./aead.js";
import { base64ToBytes } from "./aead.js";

/**
 * Envelope construction and validation.
 *
 * Builds a VaultEnvelope from AEAD result + metadata, binding
 * vault_id, object_id, key_epoch, format_version, and purpose
 * as authenticated associated data (AAD).
 *
 * The envelope schema is defined in contracts/vault-envelope.schema.json
 * and validated via the Zod schema in @herpages/contracts.
 */

export interface EnvelopeParams {
  vaultId: string;
  objectId: string;
  keyEpoch: number;
  purpose: string;
}

export async function buildEnvelope(
  params: EnvelopeParams,
  aeadResult: AeadResult,
): Promise<VaultEnvelope> {
  const aad = encodeAad({
    vaultId: params.vaultId,
    objectId: params.objectId,
    keyEpoch: params.keyEpoch,
    formatVersion: FORMAT_VERSION,
    purpose: params.purpose,
  });

  // Verify the AAD used in encryption matches what we expect
  if (!aadEquals(aad, aeadResult.aad)) {
    throw new Error("AAD mismatch: envelope AAD does not match encryption AAD");
  }

  // Combine ciphertext + tag for the envelope (GCM tag is appended to ciphertext)
  const ciphertextWithTag = new Uint8Array(aeadResult.ciphertext.length + aeadResult.tag.length);
  ciphertextWithTag.set(aeadResult.ciphertext, 0);
  ciphertextWithTag.set(aeadResult.tag, aeadResult.ciphertext.length);

  const ciphertextSha256 = await sha256Of(ciphertextWithTag);

  const envelope: VaultEnvelope = {
    format_version: FORMAT_VERSION,
    vault_id: params.vaultId,
    object_id: params.objectId,
    key_epoch: params.keyEpoch,
    crypto_profile: CRYPTO_PROFILE,
    nonce_b64: bytesToBase64(aeadResult.nonce),
    aad_b64: bytesToBase64(aad),
    ciphertext_b64: bytesToBase64(ciphertextWithTag),
    ciphertext_sha256: ciphertextSha256,
  };

  // Validate against Zod schema
  const parsed = VaultEnvelope.parse(envelope);
  return parsed;
}

export interface ParsedEnvelope {
  nonce: Uint8Array;
  aad: Uint8Array;
  ciphertext: Uint8Array;
  tag: Uint8Array;
  vaultId: string;
  objectId: string;
  keyEpoch: number;
  formatVersion: string;
}

export function parseEnvelope(envelope: VaultEnvelope): ParsedEnvelope {
  // Validate via Zod first
  const parsed = VaultEnvelope.parse(envelope);

  const ciphertextWithTag = base64ToBytes(parsed.ciphertext_b64);
  if (ciphertextWithTag.length < 16) {
    throw new Error("Envelope ciphertext too short to contain GCM tag");
  }

  const ciphertext = ciphertextWithTag.slice(0, ciphertextWithTag.length - 16);
  const tag = ciphertextWithTag.slice(ciphertextWithTag.length - 16);
  const nonce = base64ToBytes(parsed.nonce_b64);
  const aad = base64ToBytes(parsed.aad_b64);

  return {
    nonce,
    aad,
    ciphertext,
    tag,
    vaultId: parsed.vault_id,
    objectId: parsed.object_id,
    keyEpoch: parsed.key_epoch,
    formatVersion: parsed.format_version,
  };
}

/**
 * Verify the ciphertext_sha256 digest matches the actual ciphertext.
 */
export async function verifyEnvelopeDigest(envelope: VaultEnvelope): Promise<boolean> {
  const ciphertextWithTag = base64ToBytes(envelope.ciphertext_b64);
  const computed = await sha256Of(ciphertextWithTag);
  return computed === envelope.ciphertext_sha256;
}

/**
 * Reconstruct the expected AAD from envelope metadata and compare
 * with the AAD stored in the envelope. Detects tampering with
 * vault_id, object_id, key_epoch, format_version, or purpose.
 */
export function verifyEnvelopeAad(envelope: VaultEnvelope, expectedPurpose: string): boolean {
  const expectedAad = encodeAad({
    vaultId: envelope.vault_id,
    objectId: envelope.object_id,
    keyEpoch: envelope.key_epoch,
    formatVersion: envelope.format_version,
    purpose: expectedPurpose,
  });
  const storedAad = base64ToBytes(envelope.aad_b64);
  return aadEquals(expectedAad, storedAad);
}

function aadEquals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function sha256Of(data: Uint8Array): Promise<string> {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const hash = await globalThis.crypto.subtle.digest("SHA-256", data as BufferSource);
    return bytesToHex(new Uint8Array(hash));
  }
  throw new Error("SHA-256 not available");
}
