/**
 * AEAD primitive boundary.
 *
 * Production: expo-crypto AES-256-GCM with AAD (ExpoCryptoAeadProvider).
 * Tests/reference: Node.js crypto AES-256-GCM (NodeAeadProvider).
 *
 * The interface is identical; only the platform binding swaps.
 * No custom cryptography — both use standard AES-256-GCM.
 */

export interface AeadResult {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  aad: Uint8Array;
  tag: Uint8Array;
}

export interface AeadProvider {
  /**
   * Encrypt with AES-256-GCM. `nonce` is optional: when omitted a fresh
   * 96-bit nonce is generated from the platform CSPRNG. A fixed nonce is
   * only used for deterministic known-answer test vectors.
   */
  encrypt(key: Uint8Array, plaintext: Uint8Array, aad: Uint8Array, nonce?: Uint8Array): Promise<AeadResult>;
  decrypt(key: Uint8Array, ciphertext: Uint8Array, nonce: Uint8Array, aad: Uint8Array, tag: Uint8Array): Promise<Uint8Array>;
  randomBytes(length: number): Promise<Uint8Array>;
  /** SHA-256 digest of the supplied bytes, used for envelope integrity metadata. */
  sha256(data: Uint8Array): Promise<Uint8Array>;
}

/**
 * Canonical AAD encoding for authenticated binding.
 * Layout: vault_id(16) | object_id(16) | key_epoch(4) | format_version(n) | purpose(n)
 * All fields length-prefixed with a 2-byte big-endian length for unambiguous parsing.
 */
export function encodeAad(params: {
  vaultId: string;
  objectId: string;
  keyEpoch: number;
  formatVersion: string;
  purpose: string;
}): Uint8Array {
  const vaultIdBytes = uuidToBytes(params.vaultId);
  const objectIdBytes = uuidToBytes(params.objectId);
  const epochBytes = new Uint8Array(4);
  new DataView(epochBytes.buffer).setUint32(0, params.keyEpoch, false);
  const versionBytes = new TextEncoder().encode(params.formatVersion);
  const purposeBytes = new TextEncoder().encode(params.purpose);

  const parts = [vaultIdBytes, objectIdBytes, epochBytes, versionBytes, purposeBytes];
  let totalLen = 0;
  for (const p of parts) totalLen += 2 + p.length;

  const out = new Uint8Array(totalLen);
  let off = 0;
  for (const p of parts) {
    out[off] = (p.length >> 8) & 0xff;
    out[off + 1] = p.length & 0xff;
    off += 2;
    out.set(p, off);
    off += p.length;
  }
  return out;
}

function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, "");
  if (hex.length !== 32) throw new Error(`Invalid UUID: ${uuid}`);
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Hex string must have even length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export const CRYPTO_PROFILE = "REQUIRES_REVIEWED_NATIVE_PROFILE";
export const FORMAT_VERSION = "1.0-draft";
export const NONCE_LENGTH = 12;
export const KEY_LENGTH = 32;
