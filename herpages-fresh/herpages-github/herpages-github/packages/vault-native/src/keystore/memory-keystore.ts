import type { SecureKeyStore } from "@herpages/vault-port";

/**
 * TEST DOUBLE — not for production.
 *
 * In-memory keystore for Vitest tests where expo-secure-store
 * is not available. Clearly labeled; must never be enabled
 * silently in a production build.
 */

export class MemoryKeyStore implements SecureKeyStore {
  private entries = new Map<string, Uint8Array>();
  private available = true;

  setAvailable(available: boolean): void {
    this.available = available;
  }

  async store(key: string, value: Uint8Array): Promise<void> {
    if (!this.available) throw new Error("SecureStore unavailable (test double)");
    this.entries.set(key, new Uint8Array(value));
  }

  async retrieve(key: string): Promise<Uint8Array | null> {
    if (!this.available) return null;
    const v = this.entries.get(key);
    return v ? new Uint8Array(v) : null;
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }

  async isHardwareBacked(): Promise<boolean> {
    return false;
  }
}
