import type { VaultDatabase } from "@herpages/vault-port";

/**
 * expo-sqlite + SQLCipher adapter.
 *
 * Configuration:
 * - app.json includes the expo-sqlite config plugin with { "useSQLCipher": true }
 * - SQLCipher requires a native development build (prebuild); Expo Go is not valid.
 * - The database key is applied via PRAGMA key BEFORE any schema or data access.
 *
 * Fail-closed design:
 * - If SQLCipher is unavailable or PRAGMA key fails, the adapter does NOT
 *   open or create a plaintext fallback database. It throws and sets a blocked state.
 * - The caller must handle the blocked state by showing a blocked UI,
 *   never by falling back to AsyncStorage, localStorage, or plain SQLite.
 *
 * SQLCipher active verification (native test item):
 * - After applying PRAGMA key, verify encryption is active by:
 *   1. Checking PRAGMA cipher_version returns a non-empty result
 *   2. Attempting to open the DB file without the key (should fail)
 * - These verifications require a native build and are NOT run in Bolt.
 */

export class SqlCipherAdapter implements VaultDatabase {
  private db: unknown = null;
  private openState: "closed" | "opening" | "open" | "blocked" = "closed";
  private keyApplied = false;

  async open(dbKey: Uint8Array): Promise<void> {
    if (this.openState === "open") throw new Error("Database already open");
    this.openState = "opening";

    try {
      const mod = await import("expo-sqlite");
      // expo-sqlite with SQLCipher: open the database, then apply PRAGMA key
      // before any schema or data access.
      const dbName = "herpages_vault.db";
      this.db = await mod.openDatabaseAsync(dbName);

      // Apply the SQLCipher key before any other operation.
      // The key must be a hex string for PRAGMA key.
      const keyHex = bytesToHex(dbKey);
      await this.execute(`PRAGMA key = '${keyHex}';`);

      // Verify SQLCipher is active (not merely configured).
      // PRAGMA cipher_version should return a version string.
      // This is a runtime check that SQLCipher is actually encrypting.
      const cipherVersion = await this.query<{ cipher_version: string }>(
        "PRAGMA cipher_version;"
      );
      if (!cipherVersion || cipherVersion.length === 0 || !cipherVersion[0].cipher_version) {
        // SQLCipher not active — fail closed.
        this.openState = "blocked";
        await this.close();
        throw new SqlCipherUnavailableError(
          "SQLCipher is not active despite configuration. Refusing plaintext fallback."
        );
      }

      this.keyApplied = true;
      this.openState = "open";
    } catch (err) {
      this.openState = "blocked";
      this.db = null;
      this.keyApplied = false;
      if (err instanceof SqlCipherUnavailableError) throw err;
      throw new SqlCipherUnavailableError(
        `Failed to open SQLCipher database: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  async close(): Promise<void> {
    if (this.db && typeof (this.db as any).closeAsync === "function") {
      await (this.db as any).closeAsync();
    }
    this.db = null;
    this.openState = "closed";
    this.keyApplied = false;
  }

  isOpen(): boolean {
    return this.openState === "open" && this.keyApplied;
  }

  isBlocked(): boolean {
    return this.openState === "blocked";
  }

  async execute(sql: string, params?: unknown[]): Promise<void> {
    if (!this.isOpen()) throw new Error("Database not open or key not applied");
    await (this.db as any).execAsync(sql, params ?? []);
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    if (!this.isOpen()) throw new Error("Database not open or key not applied");
    const result = await (this.db as any).getAllAsync(sql, params ?? []);
    return result as T[];
  }
}

export class SqlCipherUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SqlCipherUnavailableError";
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
