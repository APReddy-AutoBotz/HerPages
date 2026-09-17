import { NONCE_LENGTH } from "./aead.js";
import type { AeadProvider } from "./aead.js";

/**
 * Nonce generation using the provider's CSPRNG.
 *
 * AES-GCM uses 96-bit (12-byte) nonces. Each nonce MUST be unique
 * per key. We generate fresh random nonces for each encryption.
 *
 * With a 96-bit random nonce and a single key, the birthday-bound
 * collision probability becomes significant at ~2^48 encryptions.
 * For this spike's scope (local vault, single device) this is
 * astronomically unlikely. A production profile may use a
 * counter-based scheme if key reuse across sessions is a concern.
 *
 * This module also provides a uniqueness tracker for testing.
 */

export class NonceGenerator {
  private seenNonces = new Set<string>();
  private keyId: string;

  constructor(keyId: string) {
    this.keyId = keyId;
  }

  async generate(provider: AeadProvider): Promise<Uint8Array> {
    let nonce: Uint8Array;
    let attempts = 0;
    do {
      nonce = await provider.randomBytes(NONCE_LENGTH);
      attempts++;
      if (attempts > 1000) {
        throw new Error("Nonce generation: unable to generate unique nonce after 1000 attempts");
      }
    } while (this.seenNonces.has(nonceKey(this.keyId, nonce)));

    this.seenNonces.add(nonceKey(this.keyId, nonce));
    return nonce;
  }

  hasSeen(nonce: Uint8Array): boolean {
    return this.seenNonces.has(nonceKey(this.keyId, nonce));
  }

  reset(): void {
    this.seenNonces.clear();
  }
}

function nonceKey(keyId: string, nonce: Uint8Array): string {
  return `${keyId}:${Array.from(nonce).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
