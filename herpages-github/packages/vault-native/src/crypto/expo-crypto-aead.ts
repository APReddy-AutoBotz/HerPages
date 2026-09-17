import type { AeadProvider, AeadResult } from "./aead.js";

/**
 * Production AEAD provider using expo-crypto's native AES-256-GCM.
 *
 * Uses the documented expo-crypto API:
 * - AESEncryptionKey.import(bytes) to import a raw 256-bit key
 * - aesEncryptAsync(plaintext, key, { nonce, additionalData, tagLength })
 * - aesDecryptAsync(sealedData, key, { additionalData, output })
 * - getRandomBytesAsync for cryptographically secure random bytes
 *
 * Nonces are 96-bit and generated from the platform CSPRNG unless a
 * fixed nonce is supplied (deterministic known-answer vectors only).
 * AAD is passed via `additionalData`.
 */

export class ExpoCryptoAeadProvider implements AeadProvider {
  async encrypt(
    key: Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
    nonce?: Uint8Array,
  ): Promise<AeadResult> {
    const { AESEncryptionKey, aesEncryptAsync } = await import("expo-crypto");

    const encryptionKey = await AESEncryptionKey.import(key);

    const options: {
      additionalData: Uint8Array;
      nonce?: { bytes: Uint8Array };
      tagLength: 16;
    } = {
      additionalData: aad,
      tagLength: 16,
    };
    if (nonce) {
      options.nonce = { bytes: nonce };
    }

    const sealed = await aesEncryptAsync(plaintext, encryptionKey, options);

    const iv = await sealed.iv("bytes");
    const ciphertext = await sealed.ciphertext({ encoding: "bytes", includeTag: false });
    const tag = await sealed.tag("bytes");

    return {
      ciphertext,
      nonce: iv,
      aad: new Uint8Array(aad),
      tag,
    };
  }

  async decrypt(
    key: Uint8Array,
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    tag: Uint8Array,
  ): Promise<Uint8Array> {
    const { AESEncryptionKey, AESSealedData, aesDecryptAsync } = await import("expo-crypto");

    const encryptionKey = await AESEncryptionKey.import(key);
    const sealed = AESSealedData.fromParts(nonce, ciphertext, tag);

    const plaintext = await aesDecryptAsync(sealed, encryptionKey, {
      additionalData: aad,
      output: "bytes",
    });

    return plaintext;
  }

  async randomBytes(length: number): Promise<Uint8Array> {
    const { getRandomBytesAsync } = await import("expo-crypto");
    return getRandomBytesAsync(length);
  }

  async sha256(data: Uint8Array): Promise<Uint8Array> {
    const { digest, CryptoDigestAlgorithm } = await import("expo-crypto");
    const hash = await digest(CryptoDigestAlgorithm.SHA256, data as BufferSource);
    return new Uint8Array(hash);
  }
}
