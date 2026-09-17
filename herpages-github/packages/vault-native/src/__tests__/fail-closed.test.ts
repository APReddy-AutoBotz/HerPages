import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryDatabase } from "../database/in-memory-db.js";
import { MemoryKeyStore } from "../keystore/memory-keystore.js";
import { SqlCipherAdapter } from "../database/sqlcipher-adapter.js";

describe("Fail-closed behavior — FR-008", () => {
  let db: InMemoryDatabase;
  let keystore: MemoryKeyStore;

  beforeEach(() => {
    db = new InMemoryDatabase();
    keystore = new MemoryKeyStore();
  });

  it("database refuses to open without a key", async () => {
    await expect(db.open(new Uint8Array(0))).rejects.toThrow("Empty database key");
  });

  it("keystore distinguishes unavailable storage from a missing item", async () => {
    keystore.setAvailable(false);
    await expect(keystore.store("bootstrap", new Uint8Array(32))).rejects.toThrow("unavailable");
    await expect(keystore.retrieve("bootstrap")).rejects.toThrow("unavailable");
    await expect(keystore.delete("bootstrap")).rejects.toThrow("unavailable");
  });

  it("SQLCipher initialization applies raw key before any read and reaches open state", async () => {
    const calls: string[] = [];
    const fakeDb = {
      async execAsync(sql: string) { calls.push(sql); },
      async getAllAsync<T>(sql: string): Promise<T[]> {
        calls.push(sql);
        if (sql.includes("cipher_version")) return [{ cipher_version: "4.x" }] as T[];
        return [{ count: 0 }] as T[];
      },
      async closeAsync() { calls.push("close"); },
    };
    const adapter = new SqlCipherAdapter(async () => ({ openDatabaseAsync: async () => fakeDb }));
    await adapter.open(new Uint8Array(32).fill(0xab));
    expect(adapter.isOpen()).toBe(true);
    expect(calls[0]).toMatch(/^PRAGMA key = "x'[0-9a-f]{64}'";$/);
    expect(calls[1]).toContain("cipher_version");
    expect(calls[2]).toContain("sqlite_master");
  });

  it("SQLCipher blocks when cipher support is missing and never falls back", async () => {
    let closed = false;
    const fakeDb = {
      async execAsync() {},
      async getAllAsync<T>(): Promise<T[]> { return [] as T[]; },
      async closeAsync() { closed = true; },
    };
    const adapter = new SqlCipherAdapter(async () => ({ openDatabaseAsync: async () => fakeDb }));
    await expect(adapter.open(new Uint8Array(32).fill(1))).rejects.toThrow("cipher_version");
    expect(adapter.isBlocked()).toBe(true);
    expect(adapter.isOpen()).toBe(false);
    expect(closed).toBe(true);
  });

  it("SQLCipher rejects a non-256-bit raw key before loading native SQLite", async () => {
    let loaded = false;
    const adapter = new SqlCipherAdapter(async () => { loaded = true; throw new Error("should not load"); });
    await expect(adapter.open(new Uint8Array(16))).rejects.toThrow("32 bytes");
    expect(loaded).toBe(false);
  });
});
