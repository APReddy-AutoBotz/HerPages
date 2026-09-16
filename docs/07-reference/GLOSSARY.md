# Glossary

| Term | Meaning in HerPages |
|---|---|
| Local-first | Core personal work is performed and persisted on the device; connectivity is optional for those functions |
| E2EE | Content is encrypted before leaving an authorized device and intended recipients hold decryption keys; does not hide all metadata |
| Encryption at rest | Stored data is encrypted, but the service may still possess the key; not equivalent to E2EE |
| Vault | Encrypted local collection of intimate personal records and media |
| Collection | Separately scoped content grouping, such as personal, child-history or family-shared |
| Ciphertext | Encrypted bytes, not readable plaintext |
| AEAD | Authenticated encryption that detects tampering as well as encrypting content |
| AAD | Authenticated associated metadata bound to an encrypted object |
| Key epoch | Version identifying which key generation protects content |
| Recovery | Restoring access with authorized keys/material, not simply resetting an account password |
| RLS | PostgreSQL Row Level Security; constrains row access but does not replace client encryption |
| Capability | A specific permission evaluated for an actor, resource, purpose and current policy |
| Assurance | Evidence-supported status, such as adult or guardian verification; not a visual profile field |
| Assent | Age-appropriate agreement by a child, distinct from legally required guardian consent |
| Visual chapter | Optional life-stage presentation; not an authorization rule |
| Outbox | Durable event record committed with a business transaction for reliable asynchronous processing |
| Idempotency | Repeating a request does not repeat its side effect |
| CAS | Compare-and-swap: update only if the expected previous version/head still matches |
| Tombstone | Record of deletion/revocation used to prevent restoration from resurrecting access |
| Modular monolith | One deployable codebase with clear internal boundaries rather than many independent services |
| DPA | Data processing agreement covering a processor's responsibilities |
| RPO/RTO | Recovery point/time objectives; service recovery is different from the user's last vault backup |
| Release gate | Evidence and specialist approval needed before a defined feature/data use is enabled |
| Specified / implemented / tested / reviewed / released | Different states that must not be conflated |
