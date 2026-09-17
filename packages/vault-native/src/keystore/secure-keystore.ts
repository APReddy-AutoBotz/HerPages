import type { SecureKeyStore } from "@herpages/vault-port";

const BOOTSTRAP_KEY = "herpages_vault_bootstrap";

/**
 * expo-secure-store adapter for small bootstrap/wrapping secrets.
 * Uses a device-only, unlocked accessibility class on iOS. It does not claim
 * Secure Enclave/StrongBox isolation and does not silently treat an unavailable
 * secure store as an absent key.
 */
export class SecureStoreAdapter implements SecureKeyStore {
  private storeAvailable: boolean | null = null;

  async isAvailable(): Promise<boolean> {
    if (this.storeAvailable !== null) return this.storeAvailable;
    try {
      const { isAvailableAsync } = await import("expo-secure-store");
      this.storeAvailable = await isAvailableAsync();
      return this.storeAvailable;
    } catch {
      this.storeAvailable = false;
      return false;
    }
  }

  async store(key: string, value: Uint8Array): Promise<void> {
    await this.requireAvailable();
    const { setItemAsync, WHEN_UNLOCKED_THIS_DEVICE_ONLY } = await import("expo-secure-store");
    await setItemAsync(key, bytesToBase64(value), {
      keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      requireAuthentication: false,
    });
  }

  async retrieve(key: string): Promise<Uint8Array | null> {
    await this.requireAvailable();
    const { getItemAsync } = await import("expo-secure-store");
    const b64 = await getItemAsync(key);
    return b64 === null ? null : base64ToBytes(b64);
  }

  async delete(key: string): Promise<void> {
    await this.requireAvailable();
    const { deleteItemAsync } = await import("expo-secure-store");
    await deleteItemAsync(key);
  }

  async isHardwareBacked(): Promise<boolean> {
    return false;
  }

  async storeBootstrap(value: Uint8Array): Promise<void> {
    await this.store(BOOTSTRAP_KEY, value);
  }

  async retrieveBootstrap(): Promise<Uint8Array | null> {
    return this.retrieve(BOOTSTRAP_KEY);
  }

  async deleteBootstrap(): Promise<void> {
    await this.delete(BOOTSTRAP_KEY);
  }

  private async requireAvailable(): Promise<void> {
    if (!(await this.isAvailable())) {
      throw new SecureStoreUnavailableError("expo-secure-store is not available on this device");
    }
  }
}

export class SecureStoreUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecureStoreUnavailableError";
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
