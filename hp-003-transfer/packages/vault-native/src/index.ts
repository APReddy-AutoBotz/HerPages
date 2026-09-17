/**
 * @herpages/vault-native — HP-003 spike implementation.
 *
 * Implements the vault-port interfaces using:
 * - expo-crypto for AES-256-GCM AEAD (production)
 * - expo-secure-store for bootstrap/wrapping secret (production)
 * - expo-sqlite with SQLCipher for encrypted local database (production)
 *
 * Test doubles (NodeAeadProvider, MemoryKeyStore, InMemoryDatabase)
 * are clearly labeled and must never be enabled in production.
 *
 * PROVISIONAL — independent security review required before G2.
 * Native verification (SQLCipher, SecureStore, clean-device recovery)
 * requires real Android/iOS builds and is NOT verified in Bolt.
 */

export type { AeadProvider, AeadResult } from "./crypto/aead.js";
export { encodeAad, bytesToHex, hexToBytes, bytesToBase64, base64ToBytes, CRYPTO_PROFILE, FORMAT_VERSION, NONCE_LENGTH, KEY_LENGTH } from "./crypto/aead.js";
export { ExpoCryptoAeadProvider } from "./crypto/expo-crypto-aead.js";
export { NodeAeadProvider } from "./crypto/node-aead.js";
export { NonceGenerator } from "./crypto/nonce.js";
export { buildEnvelope, parseEnvelope, verifyEnvelopeDigest, verifyEnvelopeAad } from "./crypto/envelope.js";
export type { EnvelopeParams, ParsedEnvelope } from "./crypto/envelope.js";

export { SecureStoreAdapter, SecureStoreUnavailableError } from "./keystore/secure-keystore.js";
export { MemoryKeyStore } from "./keystore/memory-keystore.js";

export { SqlCipherAdapter, SqlCipherUnavailableError } from "./database/sqlcipher-adapter.js";
export { InMemoryDatabase } from "./database/in-memory-db.js";

export { RecoveryProviderImpl } from "./recovery/recovery-provider.js";
export type { RecoveryPackage } from "./recovery/recovery-provider.js";

export { KeyRotationStateMachine } from "./rotation/key-rotation.js";
export type { KeyEpoch, RotationState, RotationStatus } from "./rotation/key-rotation.js";
