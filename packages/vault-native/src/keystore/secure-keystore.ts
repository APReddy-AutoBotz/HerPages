import type { SecureKeyStore } from "@herpages/vault-port";

/**
 * expo-secure-store adapter for the bootstrap/wrapping secret.
 *
 * Stores a small secret using the platform Keychain (iOS) / Keystore (Android)
 * abstraction provided by expo-secure-store.
 *
 * The secret is protected using the platform Keychain/Keystore abstraction,
 * subject to the platform and device capabilities. When the app reads the
 * secret, working key material may exist in app process memory.
 *
 * This adapter does NOT claim:
 * - That keys never leave hardware (Secure Enclave/StrongBox)
 * - Hardware-backed key isolation (expo-secure-store does not expose isHardwareBacked)
 *
 * It uses expo-secure-store's actual APIs: isAvailableAsync, setItemAsync,
 * getItemAsync, deleteItemAsync, and accessibility constants.
 */

const BOOTSTRAP_KEY = "herpages_vault_bootstrap";

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
    if (!(await this.isAvailable())) {
      throw new SecureStoreUnavailableError("expo-secure-store is not available on this device");
    }
    const { setItemAsync, AFTER_FIRST_UNLOCK } = await import("expo-secure-store");
    const b64 = bytesToBase64(value);
    await setItemAsync(key, b64, {
      keychainAccessible: AFTER_FIRST_UNLOCK,
      requireAuthentication: false,
    });
  }

  async retrieve(key: string): Promise<Uint8Array | null> {
    if (!(await this.isAvailable())) return null;
    const { getItemAsync } = await import("expo-secure-store");
    const b64 = await getItemAsync(key);
    if (b64 === null) return null;
    return base64ToBytes(b64);
  }

  async delete(key: string): Promise<void> {
    if (!(await this.isAvailable())) return;
    const { deleteItemAsync } = await import("expo-secure-store");
    await deleteItemAsync(key);
  }

  async isHardwareBacked(): Promise<boolean> {
    // expo-secure-store does not expose an isHardwareBacked API.
    // We do not claim hardware backing. Return false to avoid
    // implying a guarantee the abstraction does not provide.
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
}

export class SecureStoreUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecureStoreUnavailableError";
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(b64, "base64"));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
