import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { encodeAad, bytesToBase64, base64ToBytes, hexToBytes, KEY_LENGTH, NONCE_LENGTH } from "../crypto/aead.js";
import { buildEnvelope, parseEnvelope, verifyEnvelopeDigest, verifyEnvelopeAad } from "../crypto/envelope.js";

const VAULT_ID = "a1a1a1a1-a1a1-4a1a-8a1a-a1a1a1a1a1a1";
const OBJECT_ID = "b2b2b2b2-b2b2-4b2b-9b2b-b2b2b2b2b2b2";
const KEY_EPOCH = 1;
const PURPOSE = "vault_page_v1";

describe("AEAD — AES-256-GCM", () => {
  let provider: NodeAeadProvider;
  let key: Uint8Array;

  beforeEach(async () => {
    provider = new NodeAeadProvider();
    key = await provider.randomBytes(KEY_LENGTH);
  });

  it("encrypts and decrypts a round-trip with matching key and AAD", async () => {
    const plaintext = new TextEncoder().encode("This is a synthetic private Page entry.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });

    const result = await provider.encrypt(key, plaintext, aad);
    expect(result.ciphertext.length).toBe(plaintext.length);
    expect(result.nonce.length).toBe(NONCE_LENGTH);
    expect(result.tag.length).toBe(16);

    const decrypted = await provider.decrypt(key, result.ciphertext, result.nonce, result.aad, result.tag);
    expect(new TextDecoder().decode(decrypted)).toBe("This is a synthetic private Page entry.");
  });

  it("matches the deterministic known-answer vector (NIST-style fixed key/nonce)", async () => {
    const keyVec = hexToBytes("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f");
    const nonceVec = hexToBytes("000102030405060708090a0b");
    const plaintext = new TextEncoder().encode("Known-answer test vector for HerPages AES-256-GCM.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });

    const result = await provider.encrypt(keyVec, plaintext, aad, nonceVec);

    const expectedCiphertext = "0c6cb96cabc8a375fe36f2f9919d1d1ef7f6f151930f300e18018af73d2165c05171c999dce153dd27894dd8beaa6f7ba377";
    const expectedTag = "2d2f73d7d2aa3b28ae7e4314701018b2";

    expect(Buffer.from(result.ciphertext).toString("hex")).toBe(expectedCiphertext);
    expect(Buffer.from(result.tag).toString("hex")).toBe(expectedTag);

    // Decrypt back to plaintext
    const decrypted = await provider.decrypt(keyVec, result.ciphertext, result.nonce, result.aad, result.tag);
    expect(new TextDecoder().decode(decrypted)).toBe("Known-answer test vector for HerPages AES-256-GCM.");
  });

  it("rejects modified ciphertext", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const modified = new Uint8Array(result.ciphertext);
    modified[0] ^= 0xff;

    await expect(
      provider.decrypt(key, modified, result.nonce, result.aad, result.tag),
    ).rejects.toThrow();
  });

  it("rejects modified authentication tag", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const modifiedTag = new Uint8Array(result.tag);
    modifiedTag[0] ^= 0xff;

    await expect(
      provider.decrypt(key, result.ciphertext, result.nonce, result.aad, modifiedTag),
    ).rejects.toThrow();
  });

  it("rejects modified nonce", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const modifiedNonce = new Uint8Array(result.nonce);
    modifiedNonce[0] ^= 0xff;

    await expect(
      provider.decrypt(key, result.ciphertext, modifiedNonce, result.aad, result.tag),
    ).rejects.toThrow();
  });

  it("rejects modified AAD", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const modifiedAad = new Uint8Array(aad);
    modifiedAad[modifiedAad.length - 1] ^= 0xff;

    await expect(
      provider.decrypt(key, result.ciphertext, result.nonce, modifiedAad, result.tag),
    ).rejects.toThrow();
  });

  it("rejects wrong key", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const wrongKey = await provider.randomBytes(KEY_LENGTH);

    await expect(
      provider.decrypt(wrongKey, result.ciphertext, result.nonce, result.aad, result.tag),
    ).rejects.toThrow();
  });

  it("rejects wrong key epoch via AAD mismatch", async () => {
    const plaintext = new TextEncoder().encode("Secret vault content");
    const aadEpoch1 = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: 1, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aadEpoch1);

    // Try to decrypt with epoch 2 AAD — should fail
    const aadEpoch2 = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: 2, formatVersion: "1.0-draft", purpose: PURPOSE });

    await expect(
      provider.decrypt(key, result.ciphertext, result.nonce, aadEpoch2, result.tag),
    ).rejects.toThrow();
  });
});

describe("Envelope — VaultEnvelope construction and validation", () => {
  let provider: NodeAeadProvider;
  let key: Uint8Array;

  beforeEach(async () => {
    provider = new NodeAeadProvider();
    key = await provider.randomBytes(KEY_LENGTH);
  });

  it("builds and parses a valid envelope", async () => {
    const plaintext = new TextEncoder().encode("Synthetic journal entry for testing.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const envelope = await buildEnvelope(
      { vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, purpose: PURPOSE },
      result,
      provider,
    );

    expect(envelope.format_version).toBe("1.0-draft");
    expect(envelope.vault_id).toBe(VAULT_ID);
    expect(envelope.object_id).toBe(OBJECT_ID);
    expect(envelope.key_epoch).toBe(KEY_EPOCH);
    expect(envelope.crypto_profile).toBe("REQUIRES_REVIEWED_NATIVE_PROFILE");
    expect(envelope.ciphertext_sha256).toMatch(/^[a-f0-9]{64}$/);

    const parsed = parseEnvelope(envelope);
    expect(parsed.vaultId).toBe(VAULT_ID);
    expect(parsed.keyEpoch).toBe(KEY_EPOCH);

    const decrypted = await provider.decrypt(key, parsed.ciphertext, parsed.nonce, parsed.aad, parsed.tag);
    expect(new TextDecoder().decode(decrypted)).toBe("Synthetic journal entry for testing.");
  });

  it("verifies envelope digest", async () => {
    const plaintext = new TextEncoder().encode("Test content for digest verification.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const envelope = await buildEnvelope(
      { vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, purpose: PURPOSE },
      result,
      provider,
    );

    expect(await verifyEnvelopeDigest(envelope, provider)).toBe(true);
  });

  it("rejects truncated envelope ciphertext", async () => {
    const plaintext = new TextEncoder().encode("Content for truncation test.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const envelope = await buildEnvelope(
      { vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, purpose: PURPOSE },
      result,
      provider,
    );

    // Truncate ciphertext — remove enough to drop below the 16-byte GCM tag minimum
    const rawBytes = base64ToBytes(envelope.ciphertext_b64);
    const truncatedBytes = rawBytes.slice(0, 8);
    const truncated = {
      ...envelope,
      ciphertext_b64: bytesToBase64(truncatedBytes),
    };

    expect(() => parseEnvelope(truncated)).toThrow();
  });

  it("verifies AAD binding with correct purpose", async () => {
    const plaintext = new TextEncoder().encode("Content for AAD verification.");
    const aad = encodeAad({ vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, formatVersion: "1.0-draft", purpose: PURPOSE });
    const result = await provider.encrypt(key, plaintext, aad);

    const envelope = await buildEnvelope(
      { vaultId: VAULT_ID, objectId: OBJECT_ID, keyEpoch: KEY_EPOCH, purpose: PURPOSE },
      result,
      provider,
    );

    expect(verifyEnvelopeAad(envelope, PURPOSE)).toBe(true);
    expect(verifyEnvelopeAad(envelope, "wrong_purpose")).toBe(false);
  });
});
