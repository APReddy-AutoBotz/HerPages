import type { RecoveryProvider } from "@herpages/vault-port";
import type { VaultEnvelope } from "@herpages/contracts";
import type { AeadProvider } from "../crypto/aead.js";
import { buildEnvelope, parseEnvelope, verifyEnvelopeDigest, verifyEnvelopeAad } from "../crypto/envelope.js";
import { encodeAad, bytesToHex, hexToBytes, KEY_LENGTH, FORMAT_VERSION } from "../crypto/aead.js";
import { NonceGenerator } from "../crypto/nonce.js";

const RECOVERY_PURPOSE = "vault_recovery_v1";

/**
 * The recovery package is safe to store separately from the user-held recovery
 * secret. The secret MUST NEVER be embedded in, logged with, or uploaded beside
 * this package as a convenience field.
 */
export interface RecoveryPackage {
  envelope: VaultEnvelope;
}

export class RecoveryProviderImpl implements RecoveryProvider {
  private readonly nonceGen: NonceGenerator;
  private storedPackage: RecoveryPackage | null = null;
  private recoveredRootKey: Uint8Array | null = null;

  constructor(private readonly provider: AeadProvider, private readonly vaultId: string) {
    this.nonceGen = new NonceGenerator(`recovery:${vaultId}`);
  }

  async generateRecoveryKey(): Promise<string> {
    return bytesToHex(await this.provider.randomBytes(KEY_LENGTH));
  }

  async createPackage(
    vaultRootKey: Uint8Array,
    recoverySecret: Uint8Array,
    keyEpoch: number,
    objectId: string,
  ): Promise<RecoveryPackage> {
    if (vaultRootKey.length !== KEY_LENGTH) throw new Error("Vault root key must be 32 bytes");
    if (recoverySecret.length !== KEY_LENGTH) throw new Error("Recovery secret must be 32 bytes");

    const aad = encodeAad({
      vaultId: this.vaultId,
      objectId,
      keyEpoch,
      formatVersion: FORMAT_VERSION,
      purpose: RECOVERY_PURPOSE,
    });
    const nonce = await this.nonceGen.generate(this.provider);
    const result = await this.provider.encrypt(recoverySecret, vaultRootKey, aad, nonce);
    const envelope = await buildEnvelope(
      { vaultId: this.vaultId, objectId, keyEpoch, purpose: RECOVERY_PURPOSE },
      result,
      this.provider,
    );
    const pkg: RecoveryPackage = { envelope };
    this.storedPackage = pkg;
    return pkg;
  }

  async verifyRecoveryKey(key: string): Promise<boolean> {
    if (!this.storedPackage) return false;
    let plaintext: Uint8Array | null = null;
    try {
      const secret = decodeRecoverySecret(key);
      const parsed = parseEnvelope(this.storedPackage.envelope);
      plaintext = await this.provider.decrypt(secret, parsed.ciphertext, parsed.nonce, parsed.aad, parsed.tag);
      const aadOk = verifyEnvelopeAad(this.storedPackage.envelope, RECOVERY_PURPOSE);
      const digestOk = await verifyEnvelopeDigest(this.storedPackage.envelope, this.provider);
      return aadOk && digestOk && plaintext.length === KEY_LENGTH;
    } catch {
      return false;
    } finally {
      plaintext?.fill(0);
    }
  }

  async restoreFromRecovery(key: string): Promise<void> {
    if (!this.storedPackage) throw new Error("No recovery package available");
    const secret = decodeRecoverySecret(key);
    const parsed = parseEnvelope(this.storedPackage.envelope);
    if (!(await verifyEnvelopeDigest(this.storedPackage.envelope, this.provider))) {
      throw new Error("Recovery package integrity check failed");
    }
    if (!verifyEnvelopeAad(this.storedPackage.envelope, RECOVERY_PURPOSE)) {
      throw new Error("Recovery package AAD verification failed");
    }
    const plaintext = await this.provider.decrypt(secret, parsed.ciphertext, parsed.nonce, parsed.aad, parsed.tag);
    if (plaintext.length !== KEY_LENGTH) {
      plaintext.fill(0);
      throw new Error("Recovered key has unexpected length");
    }
    this.recoveredRootKey?.fill(0);
    this.recoveredRootKey = new Uint8Array(plaintext);
    plaintext.fill(0);
  }

  getRecoveredRootKey(): Uint8Array | null {
    return this.recoveredRootKey ? new Uint8Array(this.recoveredRootKey) : null;
  }

  setStoredPackage(pkg: RecoveryPackage): void {
    this.storedPackage = { envelope: { ...pkg.envelope } };
  }
}

function decodeRecoverySecret(hex: string): Uint8Array {
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("Recovery key must contain exactly 64 hexadecimal characters");
  }
  return hexToBytes(hex);
}
