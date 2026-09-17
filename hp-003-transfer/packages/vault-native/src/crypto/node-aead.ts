import type { AeadProvider, AeadResult } from "./aead.js";
import { NONCE_LENGTH } from "./aead.js";

/**
 * Node.js AEAD provider using the built-in crypto module.
 *
 * TEST/REFERENCE DOUBLE for Vitest — uses the same AES-256-GCM algorithm
 * as expo-crypto, but via Node.js crypto. This is NOT a custom
 * cryptographic primitive; it is the standard Node.js AEAD.
 *
 * In production, the ExpoCryptoAeadProvider replaces this.
 * Both use AES-256-GCM with 96-bit nonces and AAD.
 */

export class NodeAeadProvider implements AeadProvider {
  async encrypt(
    key: Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
    nonce?: Uint8Array,
  ): Promise<AeadResult> {
    const crypto = await import("node:crypto");
    const iv = nonce ?? crypto.randomBytes(NONCE_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv, {
      authTagLength: 16,
    });
    cipher.setAAD(Buffer.from(aad));
    const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      ciphertext: new Uint8Array(ciphertext),
      nonce: new Uint8Array(iv),
      aad: new Uint8Array(aad),
      tag: new Uint8Array(tag),
    };
  }

  async decrypt(
    key: Uint8Array,
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    tag: Uint8Array,
  ): Promise<Uint8Array> {
    const crypto = await import("node:crypto");
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(nonce), {
      authTagLength: 16,
    });
    decipher.setAAD(Buffer.from(aad));
    decipher.setAuthTag(Buffer.from(tag));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertext)),
      decipher.final(),
    ]);
    return new Uint8Array(plaintext);
  }

  async randomBytes(length: number): Promise<Uint8Array> {
    const crypto = await import("node:crypto");
    return new Uint8Array(crypto.randomBytes(length));
  }

  async sha256(data: Uint8Array): Promise<Uint8Array> {
    const crypto = await import("node:crypto");
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(data));
    return new Uint8Array(hash.digest());
  }
}
