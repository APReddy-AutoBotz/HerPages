import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { NonceGenerator } from "../crypto/nonce.js";
import { NONCE_LENGTH } from "../crypto/aead.js";

describe("NonceGenerator", () => {
  let provider: NodeAeadProvider;

  beforeEach(() => {
    provider = new NodeAeadProvider();
  });

  it("generates 96-bit (12-byte) nonces", async () => {
    const gen = new NonceGenerator("test-key");
    const nonce = await gen.generate(provider);
    expect(nonce.length).toBe(NONCE_LENGTH);
  });

  it("generates unique nonces", async () => {
    const gen = new NonceGenerator("test-key");
    const seen = new Set<string>();

    for (let i = 0; i < 1000; i++) {
      const nonce = await gen.generate(provider);
      const hex = Array.from(nonce).map((b) => b.toString(16).padStart(2, "0")).join("");
      expect(seen.has(hex)).toBe(false);
      seen.add(hex);
    }

    expect(seen.size).toBe(1000);
  });

  it("tracks seen nonces", async () => {
    const gen = new NonceGenerator("test-key");
    const nonce = await gen.generate(provider);
    expect(gen.hasSeen(nonce)).toBe(true);

    // A different nonce should not be seen
    const otherNonce = provider.randomBytes(NONCE_LENGTH);
    expect(gen.hasSeen(otherNonce)).toBe(false);
  });

  it("resets tracked nonces", async () => {
    const gen = new NonceGenerator("test-key");
    const nonce = await gen.generate(provider);
    expect(gen.hasSeen(nonce)).toBe(true);

    gen.reset();
    expect(gen.hasSeen(nonce)).toBe(false);
  });
});
