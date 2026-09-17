# HP-003 security review — corrective pass

**Date:** 2026-09-17  
**Review scope:** committed portable HP-003 source on `main`; native device behavior remains unverified.  
**Release impact:** G2 remains **NOT PASSED**.

## Blocking findings found in review

1. **SQLCipher initialization could never succeed.** `open()` called guarded `execute()`/`query()` before `keyApplied/open` were true. Corrected with initialization-only raw database methods, a 32-byte key requirement, SQLCipher raw-key syntax, `cipher_version` check, and a `sqlite_master` read to force key validation.
2. **Recovery package contained its own recovery secret.** `RecoveryPackage` previously included `recoveryCode`, defeating separation if the package were stored or uploaded. The package now contains ciphertext/envelope only; the high-entropy recovery secret remains user-held.
3. **Rotation resume generated a new pending key.** A failed rotation discarded the key that partially re-encrypted objects used. Resume now retains the exact pending key and progress. Status no longer exposes raw previous key material.
4. **Fail-closed keystore reads were ambiguous.** Unavailable secure storage returned `null`, indistinguishable from 'key absent'. Unavailability now throws; `null` means the secure store is available and the item is missing/invalidated.
5. **Test doubles were exported from the production package root.** They are no longer root exports; tests import them explicitly by internal path.
6. **Input canonicalization was too permissive.** UUID/hex/key/nonce validation is now explicit before cryptographic use.

## Additional hardening

- iOS keychain accessibility changed from `AFTER_FIRST_UNLOCK` to `WHEN_UNLOCKED_THIS_DEVICE_ONLY` for the bootstrap secret. This is a conservative baseline and still requires real-device usability/security validation.
- SQLCipher uses the documented raw-key form `PRAGMA key = "x'<64 hex chars>'"` for the already high-entropy 32-byte database key.
- Portable SQLCipher initialization tests now exercise operation order and fail-closed behavior using an injected SQLite test boundary instead of only testing an unrelated in-memory database.
- Rotation's 'old key cannot decrypt new data' test now performs an actual AES-GCM authentication failure instead of returning a hard-coded boolean.

## Still NOT proven

Native SQLCipher encryption; DB/WAL/temp plaintext inspection; Expo SecureStore behavior; Android uninstall and iOS Keychain persistence; native Expo Crypto known-answer parity; clean-device recovery; process-death rotation checkpoint/key persistence; native development/release builds; independent professional cryptographic review.

Do not start storing real personal data or mark G2 passed on the basis of this corrective review.
