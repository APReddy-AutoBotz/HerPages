# Encryption and key-management specification

**Status: design for a security spike, not an audited protocol.** Do not implement custom primitives from this document or advertise E2EE before review and device tests pass. The final native library, algorithms, parameter profiles and test vectors must be recorded in HP-003 and a security-reviewed ADR.

## Security goal and limits

A storage/server compromise should not reveal private-vault plaintext without an authorized device or user-held recovery material. Protect local files when the device is locked and reduce accidental disclosure through backups, logs and caches.

This does not protect against every unlocked-device compromise, coercion, malicious keyboard, screenshot, compromised trusted recipient or malicious signed client update. An authorized app must render plaintext and may hold working key material in process memory. Keychain/SecureStore is not a claim that an arbitrary SQLCipher key permanently resides inside a Secure Enclave. Hardware support varies by device. [S03–S06]

## Key hierarchy

Use cryptographically secure random generation and reviewed native cryptographic libraries. Proposed hierarchy:

- Device bootstrap/wrapping secret protected by OS access controls.
- Independent device identity/key-agreement keys where required for enrollment, never reused as data keys.
- Per-vault root secret and versioned per-collection keys, with separate collections for child history, parent-private material, family sharing and the daughter's personal records.
- Per-file or per-object data-encryption keys for attachments and backup objects, wrapped under the relevant collection/epoch key.
- Separate user-held recovery wrapping material; not the account password or a short PIN.

Every key has a purpose, version, scope and rotation behavior. Do not reuse one family key forever or put raw secret keys in the same database they protect. Do not log derived keys, nonce material, recovery words or debug decrypted payloads.

## Local database and media

SQLCipher configuration is verified in native release builds on both platforms. Apply the key before database access, validate encryption state and refuse plaintext fallback. Test database/WAL/temp files and migration backups. Parameterized SQL and transactional writes remain required; encryption does not prevent SQL injection or application authorization mistakes.

Attachments, thumbnails, voice-note files and temporary import files require their own reviewed encryption path. If media cannot be securely persisted, stop the import instead of saving a plaintext fallback. Use bounded memory and streaming where supported. Delete plaintext intermediates promptly, recognizing that flash secure deletion cannot be guaranteed by overwriting a file.

## Backup encryption envelope

`../../contracts/vault-envelope.schema.json` defines transport metadata, not a completed cryptographic protocol. Use authenticated encryption with unique nonces for the chosen algorithm and strict size/format validation. Bind vault ID, object ID, epoch, format version and purpose as authenticated associated data using a specified canonical encoding. Authenticate before parsing decrypted content.

A candidate implementation may use standard AES-256-GCM or another reviewed AEAD supported by the selected library; choosing between these requires the spike. No algorithm negotiation from an untrusted server, no insecure fallback, no hardcoded key and no home-grown encryption. Define nonce generation/collision prevention and test tamper, truncation, reordering and replay.

Encrypted manifests include the plaintext schema version, object references and integrity metadata inside the encrypted boundary. Server-visible metadata is minimized: opaque IDs, ciphertext length/digest, sequence, epoch and timestamps. Do not expose Page titles, filenames, birthdays or content hashes of guessable plaintext as convenience indexes.

## Enrollment and sharing

A new device must prove control of its account and be authorized through an existing trusted device or valid recovery flow. A server-provided public key alone is not enough: a malicious or compromised server could substitute a key. Use an authenticated device-to-device verification flow, such as a reviewed QR/fingerprint confirmation or equivalent secure protocol. Record approved device fingerprint and key epoch. Do not silently replace a device key after password reset.

Sharing grants are for a collection and recipient device, not all account data. Sender encrypts/wraps only the authorized collection key. Recipient understands it can retain content. Exclude key material from generic push messages and deep links.

## Revocation and rotation

Revocation stops new service grants immediately according to tested policy propagation. Rotate keys for future content and re-encrypt retained shared content where the reviewed design requires it. Old recipients may retain old keys and old ciphertext/plaintext. Do not claim remote erasure of their copies or an offline device.

Trigger review on device loss, suspected compromise, guardian-role change, adulthood transition and cryptographic deprecation. Rotation must be resumable with explicit migration state; never delete the only old key before confirming successful re-encryption and recovery.

## Recovery

Offer a user-held high-entropy recovery method or approval from an existing trusted device. Require a proof-of-possession exercise before enabling cloud backup. The service stores only ciphertext/wrapped material and verification metadata that does not expose the recovery secret. A short PIN may unlock an OS-protected local key but is not sufficient entropy for an offline-attackable cloud recovery archive.

Do not email the recovery key, store it in analytics, auto-upload a screenshot, or derive it solely from login credentials. Explain that loss of all keys/devices can make data permanently unrecoverable. Support must not pretend to have a master key. Biometric changes and reinstall behavior are explicitly tested. [S04]

## Update and build security

Separate release signing credentials from ordinary development. Review native and OTA update policies, enforce code review and protect release branches. Signed code from a compromised publisher can still exfiltrate future unlocked data; E2EE does not remove supply-chain risk. Maintain dependency provenance, vulnerability review and a versioned crypto migration plan.

## Required evidence before real data

A reviewer must inspect the exact implementation and native release binaries, not only this design. Evidence includes threat model; algorithm/library versions; key lifecycle; nonce tests; known-answer tests; tampered archive rejection; new-device recovery; biometric change; lost-device revocation; unsupported hardware behavior; plaintext network/filesystem inspection; key rotation interruption; old-format restore; and documented residual risks. None is marked passed by this baseline.
