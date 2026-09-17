import type { SecureKeyStore } from "@herpages/vault-port";

/** TEST DOUBLE — not for production. */
export class MemoryKeyStore implements SecureKeyStore {
  private entries = new Map<string, Uint8Array>();
  private available = true;

  setAvailable(available: boolean): void {
    this.available = available;
  }

  async store(key: string, value: Uint8Array): Promise<void> {
    this.requireAvailable();
    this.entries.set(key, new Uint8Array(value));
  }

  async retrieve(key: string): Promise<Uint8Array | null> {
    this.requireAvailable();
    const value = this.entries.get(key);
    return value ? new Uint8Array(value) : null;
  }

  async delete(key: string): Promise<void> {
    this.requireAvailable();
    this.entries.delete(key);
  }

  async isHardwareBacked(): Promise<boolean> {
    return false;
  }

  private requireAvailable(): void {
    if (!this.available) throw new Error("SecureStore unavailable (test double)");
  }
}
