import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryDatabase } from "../database/in-memory-db.js";
import { MemoryKeyStore } from "../keystore/memory-keystore.js";

describe("Fail-closed behavior — FR-008", () => {
  let db: InMemoryDatabase;
  let keystore: MemoryKeyStore;

  beforeEach(() => {
    db = new InMemoryDatabase();
    keystore = new MemoryKeyStore();
  });

  it("database refuses to open without a key", async () => {
    await expect(db.open(new Uint8Array(0))).rejects.toThrow("Empty database key");
    expect(db.isOpen()).toBe(false);
  });

  it("database refuses operations when not open", async () => {
    await expect(db.execute("CREATE TABLE test (id INTEGER)")).rejects.toThrow("not open");
    await expect(db.query("SELECT * FROM test")).rejects.toThrow("not open");
  });

  it("database fails closed when SQLCipher is unavailable (simulated)", async () => {
    db.setFailOnOpen(true);
    const key = new Uint8Array(32).fill(0xab);

    await expect(db.open(key)).rejects.toThrow("Simulated SQLCipher unavailable");
    expect(db.isOpen()).toBe(false);
    // No plaintext fallback — the database is simply not open.
  });

  it("keystore refuses to store when secure storage unavailable", async () => {
    keystore.setAvailable(false);
    const secret = new Uint8Array(32).fill(0xcd);

    await expect(keystore.store("bootstrap", secret)).rejects.toThrow("SecureStore unavailable");
  });

  it("keystore returns null when unavailable on retrieve", async () => {
    keystore.setAvailable(false);
    const result = await keystore.retrieve("bootstrap");
    expect(result).toBeNull();
  });

  it("does not claim hardware backing", async () => {
    expect(await keystore.isHardwareBacked()).toBe(false);
  });

  it("full fail-closed flow: unavailable storage → blocked state, no fallback", async () => {
    // Simulate: secure storage unavailable, database unavailable
    keystore.setAvailable(false);
    db.setFailOnOpen(true);

    const key = new Uint8Array(32).fill(0xef);

    // Keystore fails
    await expect(keystore.store("bootstrap", key)).rejects.toThrow();

    // Database fails
    await expect(db.open(key)).rejects.toThrow();

    // Neither is open/available — the app must show a blocked state,
    // NOT fall back to localStorage, AsyncStorage, or plain SQLite.
    expect(await keystore.retrieve("bootstrap")).toBeNull();
    expect(db.isOpen()).toBe(false);
  });
});
