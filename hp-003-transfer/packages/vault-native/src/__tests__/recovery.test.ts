import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { RecoveryProviderImpl } from "../recovery/recovery-provider.js";
import { KEY_LENGTH } from "../crypto/aead.js";

const VAULT_ID = "c3c3c3c3-c3c3-4c3c-8c3c-c3c3c3c3c3c3";
const OBJECT_ID = "d4d4d4d4-d4d4-4d4d-9d4d-d4d4d4d4d4d4";

describe("RecoveryProvider — high-entropy recovery secret", () => {
  let provider: NodeAeadProvider;
  let recovery: RecoveryProviderImpl;
  let vaultRootKey: Uint8Array;

  beforeEach(async () => {
    provider = new NodeAeadProvider();
    recovery = new RecoveryProviderImpl(provider, VAULT_ID);
    vaultRootKey = await provider.randomBytes(KEY_LENGTH);
  });

  it("generates a 256-bit (64 hex char) recovery secret", async () => {
    const secret = await recovery.generateRecoveryKey();
    expect(secret).toMatch(/^[a-f0-9]{64}$/);
    expect(secret.length).toBe(64);
  });

  it("creates and verifies a recovery package", async () => {
    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    const pkg = await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);
    expect(pkg.envelope.vault_id).toBe(VAULT_ID);
    expect(pkg.envelope.key_epoch).toBe(1);
    expect(pkg.recoveryCode).toBe(recoverySecretHex);

    const verified = await recovery.verifyRecoveryKey(recoverySecretHex);
    expect(verified).toBe(true);
  });

  it("rejects wrong recovery secret", async () => {
    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);

    const wrongSecret = "0".repeat(64);
    const verified = await recovery.verifyRecoveryKey(wrongSecret);
    expect(verified).toBe(false);
  });

  it("restores vault root key from recovery package", async () => {
    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);

    await recovery.restoreFromRecovery(recoverySecretHex);

    const recovered = recovery.getRecoveredRootKey();
    expect(recovered).not.toBeNull();
    expect(recovered!.length).toBe(KEY_LENGTH);
    expect(Array.from(recovered!)).toEqual(Array.from(vaultRootKey));
  });

  it("fails restore with wrong recovery secret", async () => {
    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);

    const wrongSecret = "f".repeat(64);
    await expect(recovery.restoreFromRecovery(wrongSecret)).rejects.toThrow();
  });

  it("fails restore with tampered recovery package", async () => {
    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    const pkg = await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);

    // Tamper with ciphertext
    const tampered = {
      ...pkg,
      envelope: {
        ...pkg.envelope,
        ciphertext_b64: pkg.envelope.ciphertext_b64.slice(0, -4) + "AAAA",
      },
    };
    recovery.setStoredPackage(tampered);

    await expect(recovery.restoreFromRecovery(recoverySecretHex)).rejects.toThrow();
  });

  it("proves account reset ≠ vault recovery (password reset cannot decrypt)", async () => {
    // The recovery secret is independent of any account password.
    // Simulate: account password is "MyAccountPassword123"
    const accountPassword = "MyAccountPassword123";

    const recoverySecretHex = await recovery.generateRecoveryKey();
    const recoverySecret = hexToBytes(recoverySecretHex);

    await recovery.createPackage(vaultRootKey, recoverySecret, 1, OBJECT_ID);

    // The account password is NOT the recovery secret.
    expect(accountPassword).not.toBe(recoverySecretHex);
    expect(accountPassword.length).not.toBe(64);

    // Using the account password as a recovery key must fail.
    const verified = await recovery.verifyRecoveryKey(accountPassword);
    expect(verified).toBe(false);
  });
});

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
