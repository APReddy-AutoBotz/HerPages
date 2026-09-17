/**
 * AEAD primitive boundary.
 *
 * Production: expo-crypto AES-256-GCM with AAD (ExpoCryptoAeadProvider).
 * Tests/reference: Node.js crypto AES-256-GCM (NodeAeadProvider).
 */

export interface AeadResult {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  aad: Uint8Array;
  tag: Uint8Array;
}

export interface AeadProvider {
  encrypt(key: Uint8Array, plaintext: Uint8Array, aad: Uint8Array, nonce?: Uint8Array): Promise<AeadResult>;
  decrypt(key: Uint8Array, ciphertext: Uint8Array, nonce: Uint8Array, aad: Uint8Array, tag: Uint8Array): Promise<Uint8Array>;
  randomBytes(length: number): Promise<Uint8Array>;
  sha256(data: Uint8Array): Promise<Uint8Array>;
}

export function encodeAad(params: {
  vaultId: string;
  objectId: string;
  keyEpoch: number;
  formatVersion: string;
  purpose: string;
}): Uint8Array {
  if (!Number.isInteger(params.keyEpoch) || params.keyEpoch < 0 || params.keyEpoch > 0xffffffff) {
    throw new Error("keyEpoch must be an unsigned 32-bit integer");
  }

  const vaultIdBytes = uuidToBytes(params.vaultId);
  const objectIdBytes = uuidToBytes(params.objectId);
  const epochBytes = new Uint8Array(4);
  new DataView(epochBytes.buffer).setUint32(0, params.keyEpoch, false);
  const versionBytes = new TextEncoder().encode(params.formatVersion);
  const purposeBytes = new TextEncoder().encode(params.purpose);
  const parts = [vaultIdBytes, objectIdBytes, epochBytes, versionBytes, purposeBytes];

  for (const part of parts) {
    if (part.length > 0xffff) throw new Error("AAD field exceeds 65535 bytes");
  }

  const totalLen = parts.reduce((sum, part) => sum + 2 + part.length, 0);
  const out = new Uint8Array(totalLen);
  let off = 0;
  for (const part of parts) {
    out[off] = (part.length >> 8) & 0xff;
    out[off + 1] = part.length & 0xff;
    off += 2;
    out.set(part, off);
    off += part.length;
  }
  return out;
}

function uuidToBytes(uuid: string): Uint8Array {
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)) {
    throw new Error(`Invalid UUID: ${uuid}`);
  }
  return hexToBytes(uuid.replace(/-/g, ""));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Hex string must have even length");
  if (!/^[0-9a-fA-F]*$/.test(hex)) throw new Error("Hex string contains invalid characters");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function assertAes256Key(key: Uint8Array): void {
  if (key.length !== KEY_LENGTH) throw new Error(`AES-256 key must be ${KEY_LENGTH} bytes`);
}

export function assertGcmNonce(nonce: Uint8Array): void {
  if (nonce.length !== NONCE_LENGTH) throw new Error(`AES-GCM nonce must be ${NONCE_LENGTH} bytes`);
}

export const CRYPTO_PROFILE = "REQUIRES_REVIEWED_NATIVE_PROFILE";
export const FORMAT_VERSION = "1.0-draft";
export const NONCE_LENGTH = 12;
export const KEY_LENGTH = 32;
