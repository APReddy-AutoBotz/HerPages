import type { RecoveryProvider } from "@herpages/vault-port";
import type { AeadProvider } from "../crypto/aead.js";
import { buildEnvelope, parseEnvelope, verifyEnvelopeDigest, verifyEnvelopeAad } from "../crypto/envelope.js";
import { encodeAad, bytesToHex, KEY_LENGTH } from "../crypto/aead.js";
import { NonceGenerator } from "../crypto/nonce.js";
import type { VaultEnvelope } from "@herpages/contracts";

/**
 * Recovery provider using a generated high-entropy recovery secret.
 *
 * The recovery secret is:
 * - Cryptographically random (32 bytes / 256 bits via expo-crypto)
 * - NOT the account password
 * - NOT a short PIN
 * - NOT a user-chosen password
 * - NOT derived from login credentials
 *
 * No KDF (PBKDF2/Argon2) is applied — the secret is already high-entropy.
 *
 * Conceptual separation (FR-009):
 *   Account authentication ≠ Vault encryption key ≠ Recovery secret
 *   Password reset alone can NEVER decrypt the vault.
 *
 * The recovery package contains only what is necessary to recover
 * the vault root key and metadata, encrypted/authenticated using
 * the reviewed envelope design (AES-256-GCM + AAD).
 */

const RECOVERY_PURPOSE = "vault_recovery_v1";

export interface RecoveryPackage {
  envelope: VaultEnvelope;
  recoveryCode: string;
}

export class RecoveryProviderImpl implements RecoveryProvider {
  private provider: AeadProvider;
  private nonceGen: NonceGenerator;
  private vaultId: string;
  private storedPackage: RecoveryPackage | null = null;
  private recoveredRootKey: Uint8Array | null = null;

  constructor(provider: AeadProvider, vaultId: string) {
    this.provider = provider;
    this.vaultId = vaultId;
    this.nonceGen = new NonceGenerator(`recovery:${vaultId}`);
  }

  async generateRecoveryKey(): Promise<string> {
    const rawBytes = await this.provider.randomBytes(KEY_LENGTH);
    return bytesToHex(rawBytes);
  }

  async createPackage(
    vaultRootKey: Uint8Array,
    recoverySecret: Uint8Array,
    keyEpoch: number,
    objectId: string,
  ): Promise<RecoveryPackage> {
    const aad = encodeAad({
      vaultId: this.vaultId,
      objectId,
      keyEpoch,
      formatVersion: "1.0-draft",
      purpose: RECOVERY_PURPOSE,
    });

    const nonce = await this.nonceGen.generate(this.provider);
    const result = await this.provider.encrypt(recoverySecret, vaultRootKey, aad, nonce);

    const envelope = await buildEnvelope(
      { vaultId: this.vaultId, objectId, keyEpoch, purpose: RECOVERY_PURPOSE },
      result,
      this.provider,
    );

    const pkg: RecoveryPackage = { envelope, recoveryCode: bytesToHex(recoverySecret) };
    this.storedPackage = pkg;
    return pkg;
  }

  async verifyRecoveryKey(key: string): Promise<boolean> {
    if (!this.storedPackage) return false;
    try {
      const recoverySecret = hexToBytes(key);
      const parsed = parseEnvelope(this.storedPackage.envelope);
      const plaintext = await this.provider.decrypt(
        recoverySecret,
        parsed.ciphertext,
        parsed.nonce,
        parsed.aad,
        parsed.tag,
      );
      const aadOk = verifyEnvelopeAad(this.storedPackage.envelope, RECOVERY_PURPOSE);
      const digestOk = await verifyEnvelopeDigest(this.storedPackage.envelope, this.provider);
      return aadOk && digestOk && plaintext.length > 0;
    } catch {
      return false;
    }
  }

  async restoreFromRecovery(key: string): Promise<void> {
    if (!this.storedPackage) throw new Error("No recovery package available");
    const recoverySecret = hexToBytes(key);
    const parsed = parseEnvelope(this.storedPackage.envelope);

    const digestOk = await verifyEnvelopeDigest(this.storedPackage.envelope, this.provider);
    if (!digestOk) throw new Error("Recovery package integrity check failed");

    const aadOk = verifyEnvelopeAad(this.storedPackage.envelope, RECOVERY_PURPOSE);
    if (!aadOk) throw new Error("Recovery package AAD verification failed");

    const plaintext = await this.provider.decrypt(
      recoverySecret,
      parsed.ciphertext,
      parsed.nonce,
      parsed.aad,
      parsed.tag,
    );

    if (plaintext.length !== KEY_LENGTH) {
      throw new Error("Recovered key has unexpected length");
    }
    this.recoveredRootKey = plaintext;
  }

  getRecoveredRootKey(): Uint8Array | null {
    return this.recoveredRootKey;
  }

  setStoredPackage(pkg: RecoveryPackage): void {
    this.storedPackage = pkg;
  }
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length !== 64) {
    throw new Error(`Invalid recovery key length: expected 64 hex chars, got ${hex.length}`);
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
