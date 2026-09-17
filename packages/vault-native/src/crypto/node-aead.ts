import type { AeadProvider, AeadResult } from "./aead.js";

/**
 * Node.js AEAD provider using the built-in crypto module.
 *
 * TEST DOUBLE for Vitest — uses the same AES-256-GCM algorithm
 * as expo-crypto, but via Node.js crypto. This is NOT a custom
 * cryptographic primitive; it is the standard Node.js AEAD.
 *
 * In production, the expo-crypto provider replaces this.
 * Both use AES-256-GCM with 96-bit nonces and AAD.
 */

export class NodeAeadProvider implements AeadProvider {
  async encrypt(key: Uint8Array, plaintext: Uint8Array, aad: Uint8Array): Promise<AeadResult> {
    const crypto = await import("node:crypto");
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), nonce, {
      authTagLength: 16,
    });
    cipher.setAAD(Buffer.from(aad));
    const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      ciphertext: new Uint8Array(ciphertext),
      nonce: new Uint8Array(nonce),
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

  randomBytes(length: number): Uint8Array {
    // Synchronous in Node — this is the CSPRNG.
    // For the spike's test environment this is acceptable.
    // Production uses expo-crypto's async randomBytes.
    const crypto = require("node:crypto");
    return new Uint8Array(crypto.randomBytes(length));
  }
}
