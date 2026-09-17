# HP-003 — Native encryption/key/recovery feasibility spike findings

**Status:** PROVISIONAL — implemented spike + portable tests complete; native verification pending.  
**Baseline commit:** `9d71944b6951abb27a5892213f2010821ff1d91d`  
**Date:** 2026-09-17  
**Requirements:** FR-008, FR-009, FR-014  
**Tests:** TST-008, TST-009, TST-014  
**Gate:** G1 (synthetic native prototype) — portable evidence only. G2 NOT passed.

## Scope

This spike proves the feasibility of the documented encryption/key/recovery model on Expo SDK 57 + React Native 0.86. It implements the `vault-port` interfaces in a new `packages/vault-native` package and tests them with synthetic data. It does NOT verify native behavior on a real device.

## Requirements covered

| FR | Statement | Spike scope |
|---|---|---|
| FR-008 | Fail closed when secure native vault storage cannot initialize | Fail-closed design + test: no plaintext fallback |
| FR-009 | Separate account reset from vault recovery | Recovery primitive proven: high-entropy recovery secret, recovery package encrypt/decrypt, account password ≠ recovery key |
| FR-014 | Versioned key rotation with recoverable interruption | Rotation state machine: begin → re-encrypt → finalize, with failure/resume and old-key-cannot-decrypt-new-epoch |

## Package structure

```
packages/vault-port/          # UNCHANGED — interfaces/types only
packages/vault-native/        # NEW — mobile-only implementation
  src/
    crypto/
      aead.ts                 # AeadProvider interface, AAD encoding, base64/hex utils
      node-aead.ts            # TEST DOUBLE — Node.js AES-256-GCM for Vitest
      nonce.ts                # CSPRNG nonce generation with uniqueness tracking
      envelope.ts             # VaultEnvelope construction, parsing, digest/AAD verification
    keystore/
      secure-keystore.ts      # expo-secure-store adapter (production)
      memory-keystore.ts      # TEST DOUBLE — in-memory keystore
    database/
      sqlcipher-adapter.ts    # expo-sqlite + SQLCipher PRAGMA key (production)
      in-memory-db.ts         # TEST DOUBLE — in-memory database
    recovery/
      recovery-provider.ts    # High-entropy recovery secret, recovery package
    rotation/
      key-rotation.ts         # Versioned key epoch state machine
    index.ts                  # Public exports
    __tests__/                # 37 Vitest tests
```

`vault-port` remains platform-independent. Web/API packages never depend on `vault-native`.

## Exact package versions

| Package | Version | Role | Source |
|---|---|---|---|
| expo-sqlite | ~57.0.0 (peer dep) | SQLCipher-encrypted local DB | `npx expo install expo-sqlite` |
| expo-secure-store | ~57.0.0 (peer dep) | OS Keychain/Keystore for bootstrap secret | `npx expo install expo-secure-store` |
| expo-crypto | ~57.0.0 (peer dep) | Native AES-256-GCM, secure random | `npx expo install expo-crypto` |
| @herpages/contracts | workspace:* | VaultEnvelope Zod schema | existing |
| @herpages/vault-port | workspace:* | Interfaces | existing |
| typescript | 7.0.2 | Type checking | existing |
| vitest | 5.0.1 | Test runner | existing |
| @types/node | ^22.0.0 | Node types for test doubles | dev dep |

Peer dependencies are marked optional so the package compiles in Node/Vitest without native modules. Production builds install them via `npx expo install`.

## Crypto profile (PROVISIONAL — independent review required)

### Algorithm
- **AEAD:** AES-256-GCM
- **Nonce:** 96-bit (12 bytes), CSPRNG-generated per encryption, uniqueness tracked
- **Key:** 256-bit (32 bytes), CSPRNG-generated
- **Tag:** 128-bit (16 bytes), GCM authentication tag

### AAD (authenticated associated data)
Canonical encoding, length-prefixed:
```
vault_id(16) | object_id(16) | key_epoch(4) | format_version(n) | purpose(n)
```
Each field is prefixed with a 2-byte big-endian length for unambiguous parsing.

### Replay/rollback protection
AES-GCM does NOT prevent replay. Replay/rollback protection belongs to the higher-level protocol using:
- object ID, vault ID, key epoch, format version, sequence/version, expected previous state
- These values are authenticated through AAD where applicable

### Key hierarchy
```
1. Bootstrap/wrapping secret
   ├── Stored in expo-secure-store (OS Keychain/Keystore abstraction)
   ├── Protects the vault root key at rest
   └── Subject to platform capabilities; working key material
       may exist in app process memory when read

2. Vault root key (per-vault, versioned by epoch)
   ├── Generated via expo-crypto secure random
   ├── Wraps per-collection keys
   └── Never stored in the same database it protects

3. Per-collection keys (child-history, parent-private, shared, personal)
   ├── Wrapped under the current root key epoch
   └── A grant to one collection never unlocks others

4. Per-object data-encryption keys (DEKs)
   ├── Generated per file/object via expo-crypto
   ├── Wrapped under the relevant collection key
   └── Used for AES-256-GCM encryption of individual objects

5. Recovery secret (user-held, high-entropy)
   ├── Cryptographically random, 256-bit, generated via expo-crypto
   ├── NOT the account password, NOT a short PIN, NOT a user-chosen password
   ├── No KDF applied — direct high-entropy secret
   └── Wraps the recovery package (root key + metadata) via AES-256-GCM + AAD
```

### Conceptual separation (FR-009)
```
Account authentication ≠ Vault encryption key ≠ Recovery secret
Password reset alone can NEVER decrypt the vault.
```

## SQLCipher configuration

- `app.json` includes the `expo-sqlite` config plugin with `{ "useSQLCipher": true }`
- Database key applied via `PRAGMA key` before any schema or data access
- Fail-closed: if SQLCipher is unavailable or `PRAGMA key` fails, the adapter throws `SqlCipherUnavailableError` and does NOT open a plaintext fallback
- SQLCipher active verification: after `PRAGMA key`, check `PRAGMA cipher_version` returns a non-empty result. If not, fail closed.
- Requires a native development build (prebuild); Expo Go is not valid proof

## SecureStore claims (corrected)

- Uses `expo-secure-store` APIs: `isAvailableAsync`, `setItemAsync`, `getItemAsync`, `deleteItemAsync`
- Does NOT claim `isHardwareBacked()` — expo-secure-store does not expose this
- Does NOT claim keys never leave Secure Enclave/StrongBox
- Correct claim: "The secret is protected using the platform Keychain/Keystore abstraction, subject to the platform and device capabilities. When the app reads the secret, working key material may exist in app process memory."
- `react-native-keychain` NOT added — not needed unless spike proves SecureStore is insufficient

## Recovery design (corrected)

- Generated high-entropy recovery secret (256-bit random), NOT a human password
- No PBKDF2/Argon2 KDF — the secret is already high-entropy
- Recovery package contains only vault root key + metadata, encrypted/authenticated via AES-256-GCM + AAD
- Account password reset cannot decrypt — tested and proven in `recovery.test.ts`

## Bolt-testable evidence

| Test | Status | Method |
|---|---|---|
| AEAD encrypt/decrypt round-trip | PASS | Vitest |
| Modified ciphertext rejected | PASS | Vitest |
| Modified authentication tag rejected | PASS | Vitest |
| Modified nonce rejected | PASS | Vitest |
| Modified AAD rejected | PASS | Vitest |
| Wrong key rejected | PASS | Vitest |
| Wrong key epoch rejected (AAD mismatch) | PASS | Vitest |
| Truncated envelope rejected | PASS | Vitest |
| Envelope digest verification | PASS | Vitest |
| AAD binding verification (correct + wrong purpose) | PASS | Vitest |
| Nonce uniqueness (1000 nonces, no collision) | PASS | Vitest |
| Recovery secret generation (256-bit) | PASS | Vitest |
| Recovery package create + verify | PASS | Vitest |
| Wrong recovery secret rejected | PASS | Vitest |
| Recovery package restore (root key recovered) | PASS | Vitest |
| Tampered recovery package rejected | PASS | Vitest |
| Account reset ≠ vault recovery (password cannot decrypt) | PASS | Vitest |
| Key rotation: begin → finalize | PASS | Vitest |
| Key rotation: refuse finalize before complete | PASS | Vitest |
| Key rotation: interruption → previous epoch intact | PASS | Vitest |
| Key rotation: resume after failure | PASS | Vitest |
| Key rotation: old key cannot decrypt new epoch | PASS | Vitest |
| Fail-closed: DB refuses empty key | PASS | Vitest |
| Fail-closed: DB refuses operations when not open | PASS | Vitest |
| Fail-closed: DB fails when SQLCipher unavailable (simulated) | PASS | Vitest |
| Fail-closed: keystore refuses when unavailable | PASS | Vitest |
| Fail-closed: full flow — no plaintext fallback | PASS | Vitest |
| TypeScript compilation (all packages) | PASS | `tsc --noEmit` |
| Full workspace build | PASS | `pnpm build` |

**Total: 37 vault-native tests + 23 existing tests = 60 tests, all passing.**

## Native test matrix (requires real device — NOT Bolt)

| Test | Status | Requirement |
|---|---|---|
| SQLCipher database encryption verification | NOT RUN | Requires native Android/iOS build |
| Raw DB/WAL/temp file inspection for plaintext | NOT RUN | Requires release build on device |
| SecureStore behavior (store/retrieve/availability) | NOT RUN | Requires device |
| Uninstall/reinstall behavior | NOT RUN | Requires device |
| Biometric change behavior | NOT RUN | Requires device |
| Clean-device recovery (new install, recovery key only) | NOT RUN | Requires second device |
| Interrupted key rotation on device (kill app mid-rotation) | NOT RUN | Requires device |
| iOS Keychain vs Android Keystore differences | NOT RUN | Requires both platforms |
| SQLCipher active verification (not just configured) | NOT RUN | Requires native build |
| expo-crypto AES-256-GCM with AAD on device | NOT RUN | Requires native build |

## Go/no-go assessment

**Go (conditional):** The spike confirms that the documented encryption/key/recovery model is implementable using standard Expo SDK 57 native libraries (`expo-sqlite` with SQLCipher, `expo-secure-store`, `expo-crypto`). No custom cryptographic primitives are needed. The portable logic (AEAD, envelope, nonce, recovery, rotation, fail-closed) is implemented and tested with 37 passing tests.

**Conditions for G2:**
1. Independent crypto/security review of the crypto profile and implementation
2. All native test matrix items verified on real Android and iOS devices
3. Filesystem inspection confirming no plaintext in DB/WAL/temp/cache/backup paths
4. Clean-device recovery test on a second device
5. Interrupted key rotation test on device
6. expo-crypto AES-256-GCM with AAD verified on device (not just Node.js equivalent)

## Stop conditions checked

- expo-crypto provides AES-256-GCM with AAD in SDK 57: confirmed available (not yet tested on device)
- expo-sqlite SQLCipher config plugin available in SDK 57: confirmed (not yet tested on device)
- expo-secure-store can store/retrieve secrets: confirmed available (not yet tested on device)
- No custom crypto implementation needed: confirmed

## Residual risks

- Native behavior of expo-sqlite SQLCipher, expo-secure-store, and expo-crypto is not verified on any real device
- The Node.js AEAD test double uses the same algorithm but a different platform binding; production must use expo-crypto
- SQLCipher active verification design is implemented but not tested on a native build
- iOS Keychain persistence may make logout/login an inadequate recovery test (must test on clean device)
- Android uninstall/OS backup behavior must be exercised
- The crypto profile has not been independently reviewed

## Feature flags

No feature flags changed. `real_personal_vault` remains `enabled: false` (gate G2). This spike does not enable real personal data.

## Synthetic data only

All tests use synthetic UUIDs and synthetic plaintext. No real personal records, contact numbers, identity records, school locations, or birthdays are used.
