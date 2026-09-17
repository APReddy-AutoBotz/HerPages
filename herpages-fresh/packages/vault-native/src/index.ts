/**
 * @herpages/vault-native — PROVISIONAL native vault implementation.
 * Independent review and real-device verification remain required before G2.
 */

export type { AeadProvider, AeadResult } from "./crypto/aead.js";
export { encodeAad, bytesToHex, hexToBytes, bytesToBase64, base64ToBytes, CRYPTO_PROFILE, FORMAT_VERSION, NONCE_LENGTH, KEY_LENGTH } from "./crypto/aead.js";
export { ExpoCryptoAeadProvider } from "./crypto/expo-crypto-aead.js";
export { NonceGenerator } from "./crypto/nonce.js";
export { buildEnvelope, parseEnvelope, verifyEnvelopeDigest, verifyEnvelopeAad } from "./crypto/envelope.js";
export type { EnvelopeParams, ParsedEnvelope } from "./crypto/envelope.js";
export { SecureStoreAdapter, SecureStoreUnavailableError } from "./keystore/secure-keystore.js";
export { SqlCipherAdapter, SqlCipherUnavailableError } from "./database/sqlcipher-adapter.js";
export { RecoveryProviderImpl } from "./recovery/recovery-provider.js";
export type { RecoveryPackage } from "./recovery/recovery-provider.js";
export { KeyRotationStateMachine } from "./rotation/key-rotation.js";
export type { KeyEpoch, RotationState, RotationStatus } from "./rotation/key-rotation.js";

// Test doubles are deliberately NOT exported from the package root. Tests import
// their internal paths directly so production code cannot select them accidentally.
