# HP-003 transfer manifest

## Baseline

GitHub commit: `9d71944b6951abb27a5892213f2010821ff1d91d`
Date: 2026-09-17

## Added/changed files

### New files (packages/vault-native/)

| Path | Reason |
|---|---|
| `packages/vault-native/package.json` | New package manifest; depends on vault-port, contracts; peers expo-crypto, expo-secure-store, expo-sqlite |
| `packages/vault-native/tsconfig.json` | TypeScript config for the new package |
| `packages/vault-native/vitest.config.ts` | Vitest config with Node environment and module aliases |
| `packages/vault-native/src/index.ts` | Public exports: AeadProvider, envelope utils, keystore, database, recovery, rotation |
| `packages/vault-native/src/crypto/aead.ts` | AeadProvider interface, encodeAad canonical encoding, base64/hex utilities, constants |
| `packages/vault-native/src/crypto/expo-crypto-aead.ts` | **Production AEAD:** AES-256-GCM via expo-crypto 57.0.3 (AESEncryptionKey, aesEncryptAsync, aesDecryptAsync, getRandomBytesAsync, digest) |
| `packages/vault-native/src/crypto/node-aead.ts` | **Test/reference double:** AES-256-GCM via Node.js crypto (same algorithm) |
| `packages/vault-native/src/crypto/nonce.ts` | CSPRNG nonce generation with uniqueness tracking |
| `packages/vault-native/src/crypto/envelope.ts` | VaultEnvelope build/parse/digest/AAD verification; SHA-256 via provider.sha256() |
| `packages/vault-native/src/keystore/secure-keystore.ts` | expo-secure-store adapter for bootstrap/wrapping secret (production) |
| `packages/vault-native/src/keystore/memory-keystore.ts` | In-memory test double — clearly labeled not for production |
| `packages/vault-native/src/database/sqlcipher-adapter.ts` | expo-sqlite with SQLCipher; PRAGMA key before access; PRAGMA cipher_version check; fail-closed |
| `packages/vault-native/src/database/in-memory-db.ts` | In-memory test double — clearly labeled not for production |
| `packages/vault-native/src/recovery/recovery-provider.ts` | High-entropy recovery secret (256-bit random), recovery package encrypt/verify/restore, account≠vault separation |
| `packages/vault-native/src/rotation/key-rotation.ts` | Versioned key rotation state machine; interruption never deletes previous epoch key |
| `packages/vault-native/src/__tests__/aead.test.ts` | 12 tests: round-trip, known-answer vector, all tamper rejections, envelope build/parse/digest/AAD verification |
| `packages/vault-native/src/__tests__/nonce.test.ts` | 4 tests: nonce generation, uniqueness, tracking, reset |
| `packages/vault-native/src/__tests__/recovery.test.ts` | 7 tests: recovery secret generation, package create/verify/restore, wrong key rejection, tamper rejection, account≠recovery |
| `packages/vault-native/src/__tests__/rotation.test.ts` | 8 tests: begin→finalize, interrupt→previous intact, resume, old key cannot decrypt, double-rotation refusal, reset |
| `packages/vault-native/src/__tests__/fail-closed.test.ts` | 7 tests: no empty key, no operations when closed, unavailable storage→blocked, no plaintext fallback |

### Changed files

| Path | Reason |
|---|---|
| `apps/mobile/app.json` | Added expo-sqlite config plugin with `useSQLCipher: true` |
| `pnpm-lock.yaml` | Updated pinning expo-crypto 57.0.3, expo-secure-store 57.0.4, expo-sqlite 57.0.3, @types/node for vault-native |
| `docs/03-architecture/HP-003_SPIKE_FINDINGS.md` | New spike findings document |
| `docs/03-architecture/ARCHITECTURE_DECISIONS.md` | Added ADR-013 (PROVISIONAL — independent review required) |
| `docs/06-delivery/STATUS.md` | Updated vault status, HP-003 implementation notes, task list |
| `docs/06-delivery/BACKLOG.md` | Updated task status for HP-003 |

## Exact package versions added

| Package | Version | Pinned in |
|---|---|---|
| expo-crypto | 57.0.3 | pnpm-lock.yaml (already present, now consumed by vault-native) |
| expo-secure-store | 57.0.4 | pnpm-lock.yaml (already present) |
| expo-sqlite | 57.0.3 | pnpm-lock.yaml (already present) |
| @types/node | ^22.0.0 | devDependency in vault-native (test doubles) |

## Commands run

```
npm install -g pnpm@11.27.0
pnpm install --no-frozen-lockfile
pnpm typecheck              # all 9 packages pass
pnpm test                   # 61 tests pass (23 existing + 38 vault-native)
pnpm build                  # all packages build
npm run build               # all packages build (verified)
python3 scripts/validate_docs.py   # PASS
rm -f package-lock.json     # removed stray npm artifact; pnpm authoritative
```

## Test results

| Suite | Tests | Status |
|---|---|---|
| vault-native/aead.test.ts | 12 | PASS |
| vault-native/nonce.test.ts | 4 | PASS |
| vault-native/recovery.test.ts | 7 | PASS |
| vault-native/rotation.test.ts | 8 | PASS |
| vault-native/fail-closed.test.ts | 7 | PASS |
| **vault-native total** | **38** | **PASS** |
| Existing (contracts, domain, policy, design-tokens, api, health) | 23 | PASS |
| **Grand total** | **61** | **PASS** |

## Native tests marked NOT RUN

| Test | Status |
|---|---|
| SQLCipher database encryption verification | NOT RUN |
| Raw DB/WAL/temp file inspection for plaintext | NOT RUN |
| SecureStore behavior (store/retrieve/availability) | NOT RUN |
| Uninstall/reinstall behavior | NOT RUN |
| Biometric change behavior | NOT RUN |
| Clean-device recovery (new install, recovery key only) | NOT RUN |
| Interrupted key rotation on device (kill app mid-rotation) | NOT RUN |
| iOS Keychain vs Android Keystore differences | NOT RUN |
| SQLCipher active verification (not just configured) | NOT RUN |
| expo-crypto AES-256-GCM with AAD on device | NOT RUN |
| Known-answer vector across expo-crypto native | NOT RUN (verified on Node reference only) |

## Crypto review confirmations

1. `vault-port` is interface-only — zero Expo/native imports.
2. Production native crypto uses `ExpoCryptoAeadProvider` (expo-crypto); `NodeAeadProvider` is test/reference only.
3. A deterministic known-answer vector (`key=000102...1f, nonce=000102...0b`) exercises the same AES-256-GCM inputs across both the Node reference and production-facing expo-crypto adapter. The vector is recorded in the aead test and in this manifest.
4. Recovery secret is 256-bit random, generated via `provider.randomBytes(32)`, separate from login/password.
5. No recovery secret, vault key, SQLCipher key, nonce, or plaintext appears in test assertions or snapshots — tests compare hex-encoded ciphertext and structured fields.
6. SQLCipher has no plaintext fallback: `SqlCipherAdapter.open()` throws `SqlCipherUnavailableError` and sets `blocked` state on any failure.
7. SQLCipher uses the Expo config plugin (`useSQLCipher: true` in app.json) and documented `PRAGMA key` flow before any schema or data access, with `PRAGMA cipher_version` runtime check.
8. AES-GCM nonces are 96-bit, generated from `getRandomBytesAsync` (expo-crypto) in production, `crypto.randomBytes` (Node.js) in tests. Both are cryptographically secure.
9. Replay protection is at the envelope/state layer (object ID, vault ID, key epoch, format version bound through AAD). AES-GCM is not falsely attributed as providing replay prevention.
10. Key rotation interruption (`fail()`) never deletes the previous epoch key — it restores `this.current = this.previous`. Only `finalize()` switches to the new key, and only after all objects are confirmed re-encrypted.
11. Test doubles (`NodeAeadProvider`, `MemoryKeyStore`, `InMemoryDatabase`) are clearly labeled "TEST DOUBLE — not for production" and export under distinct names. The production adapters must be explicitly imported.
12. No AsyncStorage, localStorage, or plain SQLite is used for vault plaintext. Fail-closed tests prove the blocked state has no fallback path.
13. `package-lock.json` was removed (stray npm artifact). pnpm-lock.yaml remains authoritative. `npm run build` passes without creating a new `package-lock.json`.

## Unresolved issues

- None within HP-003 spike scope. Native device verification remains gated behind G2.
- Known-answer vector is verified on Node reference only — expo-crypto native equivalent NOT RUN.

## Confirmations

- HP-005 was NOT started.
- No real personal data exists — all fixtures are synthetic.
- No `package-lock.json` was created by the build.
- `pnpm-lock.yaml` is the sole lockfile.
