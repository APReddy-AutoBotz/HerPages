import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { KeyRotationStateMachine } from "../rotation/key-rotation.js";
import type { KeyEpoch } from "../rotation/key-rotation.js";
import { KEY_LENGTH } from "../crypto/aead.js";

describe("KeyRotationStateMachine — FR-014", () => {
  let provider: NodeAeadProvider;
  let initialEpoch: KeyEpoch;

  beforeEach(async () => {
    provider = new NodeAeadProvider();
    initialEpoch = { epoch: 1, rootKey: await provider.randomBytes(KEY_LENGTH), createdAt: Date.now() };
  });

  it("retains the same pending key and progress across logical failure/resume", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    await sm.beginRotation(5);
    const pendingBefore = sm.getPendingEpochForMigration()!;
    sm.markReencrypted();
    sm.markReencrypted();
    sm.fail();
    expect(sm.getStatus()).toMatchObject({ state: "failed", currentEpoch: 1, pendingEpoch: 2, reencryptedCount: 2, totalCount: 5 });
    await sm.resume();
    const pendingAfter = sm.getPendingEpochForMigration()!;
    expect(Array.from(pendingAfter.rootKey)).toEqual(Array.from(pendingBefore.rootKey));
    expect(sm.getStatus().reencryptedCount).toBe(2);
  });

  it("finalizes only after every object is re-encrypted", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    await sm.beginRotation(2);
    sm.markReencrypted();
    expect(() => sm.finalize()).toThrow("Cannot finalize");
    sm.markReencrypted();
    sm.finalize();
    expect(sm.getStatus()).toMatchObject({ state: "done", currentEpoch: 2, pendingEpoch: null });
  });

  it("actually proves an old key cannot decrypt data encrypted with the pending key", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    const oldKey = sm.getCurrentEpoch().rootKey;
    await sm.beginRotation(1);
    const newKey = sm.getPendingEpochForMigration()!.rootKey;
    const nonce = await provider.randomBytes(12);
    const aad = new TextEncoder().encode("rotation-proof");
    const plaintext = new TextEncoder().encode("synthetic new epoch data");
    const sealed = await provider.encrypt(newKey, plaintext, aad, nonce);
    await expect(provider.decrypt(oldKey, sealed.ciphertext, sealed.nonce, aad, sealed.tag)).rejects.toThrow();
  });

  it("does not expose raw keys in status", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    await sm.beginRotation(1);
    const status = sm.getStatus() as unknown as Record<string, unknown>;
    expect(status.previousEpochKey).toBeUndefined();
    expect(JSON.stringify(status)).not.toContain(Buffer.from(initialEpoch.rootKey).toString("hex"));
  });

  it("refuses extra completion marks and active reset", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    await sm.beginRotation(1);
    expect(() => sm.reset()).toThrow("active rotation");
    sm.markReencrypted();
    expect(() => sm.markReencrypted()).toThrow("exceeds");
  });

  it("reset clears failed pending state without changing the active old epoch", async () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    await sm.beginRotation(3);
    sm.markReencrypted();
    sm.fail();
    sm.reset();
    expect(sm.getStatus()).toMatchObject({ state: "idle", currentEpoch: 1, pendingEpoch: null, reencryptedCount: 0 });
  });
});
