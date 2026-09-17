import type { AeadProvider, AeadResult } from "./aead.js";
import { assertAes256Key, assertGcmNonce, NONCE_LENGTH } from "./aead.js";

/** Production AEAD provider using expo-crypto AES-256-GCM. */
export class ExpoCryptoAeadProvider implements AeadProvider {
  async encrypt(
    key: Uint8Array,
    plaintext: Uint8Array,
    aad: Uint8Array,
    nonce?: Uint8Array,
  ): Promise<AeadResult> {
    assertAes256Key(key);
    if (nonce) assertGcmNonce(nonce);
    const { AESEncryptionKey, aesEncryptAsync } = await import("expo-crypto");
    const encryptionKey = await AESEncryptionKey.import(key);
    const options: {
      additionalData: Uint8Array;
      nonce?: { bytes: Uint8Array };
      tagLength: 16;
    } = { additionalData: aad, tagLength: 16 };
    if (nonce) options.nonce = { bytes: nonce };

    const sealed = await aesEncryptAsync(plaintext, encryptionKey, options);
    const iv = await sealed.iv("bytes");
    const ciphertext = await sealed.ciphertext({ encoding: "bytes", includeTag: false });
    const tag = await sealed.tag("bytes");
    if (iv.length !== NONCE_LENGTH || tag.length !== 16) {
      throw new Error("Unexpected AES-GCM IV or tag length from expo-crypto");
    }
    return { ciphertext, nonce: iv, aad: new Uint8Array(aad), tag };
  }

  async decrypt(
    key: Uint8Array,
    ciphertext: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    tag: Uint8Array,
  ): Promise<Uint8Array> {
    assertAes256Key(key);
    assertGcmNonce(nonce);
    if (tag.length !== 16) throw new Error("AES-GCM tag must be 16 bytes");
    const { AESEncryptionKey, AESSealedData, aesDecryptAsync } = await import("expo-crypto");
    const encryptionKey = await AESEncryptionKey.import(key);
    const sealed = AESSealedData.fromParts(nonce, ciphertext, tag);
    return aesDecryptAsync(sealed, encryptionKey, { additionalData: aad, output: "bytes" });
  }

  async randomBytes(length: number): Promise<Uint8Array> {
    if (!Number.isInteger(length) || length <= 0) throw new Error("Random byte length must be a positive integer");
    const { getRandomBytesAsync } = await import("expo-crypto");
    return getRandomBytesAsync(length);
  }

  async sha256(data: Uint8Array): Promise<Uint8Array> {
    const { digest, CryptoDigestAlgorithm } = await import("expo-crypto");
    const hash = await digest(CryptoDigestAlgorithm.SHA256, data as BufferSource);
    return new Uint8Array(hash);
  }
}
