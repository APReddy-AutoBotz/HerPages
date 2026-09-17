import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { RecoveryProviderImpl } from "../recovery/recovery-provider.js";
import { KEY_LENGTH, hexToBytes } from "../crypto/aead.js";

const VAULT_ID = "c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3";
const OBJECT_ID = "d4d4d4d4-d4d4-4d4d-9d4d-d4d4d4d4d4d4";

describe("RecoveryProvider — high-entropy user-held secret", () => {
  let provider: NodeAeadProvider;
  let recovery: RecoveryProviderImpl;
  let vaultRootKey: Uint8Array;

  beforeEach(async () => {
    provider = new NodeAeadProvider();
    recovery = new RecoveryProviderImpl(provider, VAULT_ID);
    vaultRootKey = await provider.randomBytes(KEY_LENGTH);
  });

  it("generates a 256-bit recovery secret", async () => {
    const secret = await recovery.generateRecoveryKey();
    expect(secret).toMatch(/^[a-f0-9]{64}$/);
  });

  it("creates a recovery package that does not contain its decryption secret", async () => {
    const secretHex = await recovery.generateRecoveryKey();
    const pkg = await recovery.createPackage(vaultRootKey, hexToBytes(secretHex), 1, OBJECT_ID);
    expect(pkg.envelope.vault_id).toBe(VAULT_ID);
    expect(JSON.stringify(pkg)).not.toContain(secretHex);
    expect("recoveryCode" in (pkg as unknown as Record<string, unknown>)).toBe(false);
    expect(await recovery.verifyRecoveryKey(secretHex)).toBe(true);
  });

  it("rejects malformed and wrong recovery secrets", async () => {
    const secretHex = await recovery.generateRecoveryKey();
    await recovery.createPackage(vaultRootKey, hexToBytes(secretHex), 1, OBJECT_ID);
    expect(await recovery.verifyRecoveryKey("not-hex")).toBe(false);
    expect(await recovery.verifyRecoveryKey("0".repeat(64))).toBe(false);
  });

  it("restores the vault root key", async () => {
    const secretHex = await recovery.generateRecoveryKey();
    await recovery.createPackage(vaultRootKey, hexToBytes(secretHex), 1, OBJECT_ID);
    await recovery.restoreFromRecovery(secretHex);
    expect(Array.from(recovery.getRecoveredRootKey()!)).toEqual(Array.from(vaultRootKey));
  });

  it("fails restore with wrong key or tampered package", async () => {
    const secretHex = await recovery.generateRecoveryKey();
    const pkg = await recovery.createPackage(vaultRootKey, hexToBytes(secretHex), 1, OBJECT_ID);
    await expect(recovery.restoreFromRecovery("f".repeat(64))).rejects.toThrow();
    recovery.setStoredPackage({ envelope: { ...pkg.envelope, ciphertext_b64: pkg.envelope.ciphertext_b64.slice(0, -4) + "AAAA" } });
    await expect(recovery.restoreFromRecovery(secretHex)).rejects.toThrow();
  });

  it("keeps account authentication separate from vault recovery", async () => {
    const secretHex = await recovery.generateRecoveryKey();
    await recovery.createPackage(vaultRootKey, hexToBytes(secretHex), 1, OBJECT_ID);
    expect(await recovery.verifyRecoveryKey("MyAccountPassword123")).toBe(false);
  });
});
