import type { VaultDatabase } from "@herpages/vault-port";

interface SqliteDbLike {
  execAsync(sql: string): Promise<unknown>;
  getAllAsync<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  runAsync?(sql: string, params?: unknown[]): Promise<unknown>;
  closeAsync?(): Promise<void>;
}

interface SqliteModuleLike {
  openDatabaseAsync(name: string): Promise<SqliteDbLike>;
}

type SqliteLoader = () => Promise<SqliteModuleLike>;

const defaultLoader: SqliteLoader = async () => (await import("expo-sqlite")) as unknown as SqliteModuleLike;

/** expo-sqlite + SQLCipher adapter. Native verification remains required. */
export class SqlCipherAdapter implements VaultDatabase {
  private db: SqliteDbLike | null = null;
  private openState: "closed" | "opening" | "open" | "blocked" = "closed";
  private keyApplied = false;

  constructor(private readonly loadSqlite: SqliteLoader = defaultLoader) {}

  async open(dbKey: Uint8Array): Promise<void> {
    if (dbKey.length !== 32) throw new SqlCipherUnavailableError("SQLCipher raw key must be exactly 32 bytes");
    if (this.openState !== "closed") throw new SqlCipherUnavailableError(`Database cannot open from state ${this.openState}`);
    this.openState = "opening";
    let opened: SqliteDbLike | null = null;

    try {
      const mod = await this.loadSqlite();
      opened = await mod.openDatabaseAsync("herpages_vault.db");
      this.db = opened;

      const keyHex = bytesToHex(dbKey);
      // SQLCipher raw-key syntax: use the exact 32 random bytes, bypassing passphrase KDF.
      await this.rawExec(`PRAGMA key = "x'${keyHex}'";`);

      const cipherVersion = await this.rawQuery<Record<string, unknown>>("PRAGMA cipher_version;");
      const firstRow = cipherVersion[0] ?? {};
      if (cipherVersion.length === 0 || !Object.values(firstRow).some((value) => typeof value === "string" && value.length > 0)) {
        throw new SqlCipherUnavailableError("SQLCipher cipher_version is unavailable; refusing plaintext fallback");
      }

      // PRAGMA key is lazy. Touch sqlite_master to prove an existing DB can actually be read with this key.
      await this.rawQuery("SELECT count(*) AS count FROM sqlite_master;");

      this.keyApplied = true;
      this.openState = "open";
    } catch (error) {
      try {
        if (opened?.closeAsync) await opened.closeAsync();
      } catch {
        // Preserve the original failure and remain blocked.
      }
      this.db = null;
      this.keyApplied = false;
      this.openState = "blocked";
      if (error instanceof SqlCipherUnavailableError) throw error;
      throw new SqlCipherUnavailableError(
        `Failed to initialize SQLCipher database: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async close(): Promise<void> {
    if (this.db?.closeAsync) await this.db.closeAsync();
    this.db = null;
    this.keyApplied = false;
    this.openState = "closed";
  }

  isOpen(): boolean {
    return this.openState === "open" && this.keyApplied && this.db !== null;
  }

  isBlocked(): boolean {
    return this.openState === "blocked";
  }

  async execute(sql: string, params?: unknown[]): Promise<void> {
    this.requireOpen();
    if (params && params.length > 0) {
      if (!this.db!.runAsync) throw new Error("Parameterized execution is unavailable");
      await this.db!.runAsync(sql, params);
      return;
    }
    await this.db!.execAsync(sql);
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    this.requireOpen();
    return this.db!.getAllAsync<T>(sql, params);
  }

  private requireOpen(): void {
    if (!this.isOpen()) throw new Error("Database not open or key not applied");
  }

  private async rawExec(sql: string): Promise<void> {
    if (!this.db) throw new Error("Database handle unavailable during initialization");
    await this.db.execAsync(sql);
  }

  private async rawQuery<T = unknown>(sql: string): Promise<T[]> {
    if (!this.db) throw new Error("Database handle unavailable during initialization");
    return this.db.getAllAsync<T>(sql);
  }
}

export class SqlCipherUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SqlCipherUnavailableError";
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
