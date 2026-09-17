import type { VaultDatabase } from "@herpages/vault-port";

/**
 * TEST DOUBLE — not for production.
 *
 * In-memory database for Vitest tests where expo-sqlite/SQLCipher
 * is not available. Clearly labeled; must never be enabled
 * silently in a production build.
 */

interface Row {
  [key: string]: unknown;
}

export class InMemoryDatabase implements VaultDatabase {
  private tables = new Map<string, Row[]>();
  private openState = false;
  private keyApplied = false;
  private failOnOpen = false;

  setFailOnOpen(fail: boolean): void {
    this.failOnOpen = fail;
  }

  async open(dbKey: Uint8Array): Promise<void> {
    if (this.failOnOpen) {
      throw new Error("Simulated SQLCipher unavailable (test double)");
    }
    if (dbKey.length === 0) throw new Error("Empty database key");
    this.keyApplied = true;
    this.openState = true;
  }

  async close(): Promise<void> {
    this.openState = false;
    this.keyApplied = false;
    this.tables.clear();
  }

  isOpen(): boolean {
    return this.openState && this.keyApplied;
  }

  async execute(sql: string, params?: unknown[]): Promise<void> {
    if (!this.isOpen()) throw new Error("Database not open");
    // Minimal SQL execution for test purposes: CREATE TABLE and INSERT
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith("CREATE TABLE")) {
      const tableName = extractTableName(sql);
      if (!this.tables.has(tableName)) this.tables.set(tableName, []);
    } else if (trimmed.startsWith("INSERT INTO")) {
      const tableName = extractTableName(sql);
      const rows = this.tables.get(tableName) ?? [];
      if (params) {
        const row: Row = {};
        params.forEach((v, i) => (row[`col${i}`] = v));
        rows.push(row);
        this.tables.set(tableName, rows);
      }
    } else if (trimmed.startsWith("DELETE FROM")) {
      const tableName = extractTableName(sql);
      this.tables.set(tableName, []);
    }
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    if (!this.isOpen()) throw new Error("Database not open");
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith("SELECT")) {
      const tableName = extractTableName(sql);
      return (this.tables.get(tableName) ?? []) as T[];
    }
    return [];
  }
}

function extractTableName(sql: string): string {
  const match = sql.match(/(?:FROM|INTO|TABLE)\s+(\w+)/i);
  return match ? match[1] : "unknown";
}
