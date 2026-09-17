import type { VaultEnvelope } from "@herpages/contracts";

/**
 * HP-003 will provide a native implementation.
 * No fallback to localStorage, AsyncStorage or plain SQLite.
 */

export interface CryptoProvider {
  encrypt(plaintext: Uint8Array, aad: Uint8Array): Promise<VaultEnvelope>;
  decrypt(envelope: VaultEnvelope): Promise<Uint8Array>;
  isAvailable(): Promise<boolean>;
}

export interface RecoveryProvider {
  generateRecoveryKey(): Promise<string>;
  verifyRecoveryKey(key: string): Promise<boolean>;
  restoreFromRecovery(key: string): Promise<void>;
}

export interface SecureKeyStore {
  store(key: string, value: Uint8Array): Promise<void>;
  retrieve(key: string): Promise<Uint8Array | null>;
  delete(key: string): Promise<void>;
  isHardwareBacked(): Promise<boolean>;
}

export interface VaultDatabase {
  open(dbKey: Uint8Array): Promise<void>;
  close(): Promise<void>;
  isOpen(): boolean;
  execute(sql: string, params?: unknown[]): Promise<void>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
}

export interface VaultPort {
  crypto: CryptoProvider;
  recovery: RecoveryProvider;
  keyStore: SecureKeyStore;
  database: VaultDatabase;
}
