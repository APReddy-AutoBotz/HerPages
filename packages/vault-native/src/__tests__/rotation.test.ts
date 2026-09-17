import { describe, it, expect, beforeEach } from "vitest";
import { NodeAeadProvider } from "../crypto/node-aead.js";
import { KeyRotationStateMachine } from "../rotation/key-rotation.js";
import type { KeyEpoch } from "../rotation/key-rotation.js";
import { KEY_LENGTH } from "../crypto/aead.js";

describe("KeyRotationStateMachine — FR-014", () => {
  let provider: NodeAeadProvider;
  let initialEpoch: KeyEpoch;

  beforeEach(() => {
    provider = new NodeAeadProvider();
    initialEpoch = {
      epoch: 1,
      rootKey: provider.randomBytes(KEY_LENGTH),
      createdAt: Date.now(),
    };
  });

  it("begins rotation and creates a new epoch", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(10);

    const status = sm.getStatus();
    expect(status.state).toBe("rotating");
    expect(status.currentEpoch).toBe(1);
    expect(status.pendingEpoch).toBe(2);
    expect(status.totalCount).toBe(10);
  });

  it("finalizes rotation after all objects re-encrypted", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(3);

    sm.markReencrypted();
    sm.markReencrypted();
    sm.markReencrypted();

    sm.finalize();

    const status = sm.getStatus();
    expect(status.state).toBe("done");
    expect(status.currentEpoch).toBe(2);
    expect(status.pendingEpoch).toBeNull();
  });

  it("refuses to finalize before all objects are re-encrypted", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(5);

    sm.markReencrypted();
    sm.markReencrypted();

    expect(() => sm.finalize()).toThrow("Cannot finalize");
  });

  it("recovers from interrupted rotation — previous epoch key intact", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(10);
    sm.markReencrypted();
    sm.markReencrypted();

    // Simulate crash/interruption
    sm.fail();

    const status = sm.getStatus();
    expect(status.state).toBe("failed");
    expect(status.currentEpoch).toBe(1);
    expect(status.previousEpochKey).not.toBeNull();
  });

  it("resumes rotation after failure", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(5);
    sm.markReencrypted();
    sm.markReencrypted();
    sm.fail();

    sm.resume();

    const status = sm.getStatus();
    expect(status.state).toBe("rotating");
    expect(status.pendingEpoch).toBe(2);
  });

  it("old key cannot decrypt new-epoch data", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    expect(sm.canOldKeyDecryptNewEpoch()).toBe(false);
  });

  it("refuses double rotation", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(3);

    expect(() => sm.beginRotation(3)).toThrow("already in progress");
  });

  it("reset returns to idle state", () => {
    const sm = new KeyRotationStateMachine(provider, initialEpoch);
    sm.beginRotation(3);
    sm.markReencrypted();
    sm.markReencrypted();
    sm.markReencrypted();
    sm.finalize();
    sm.reset();

    const status = sm.getStatus();
    expect(status.state).toBe("idle");
    expect(status.pendingEpoch).toBeNull();
    expect(status.reencryptedCount).toBe(0);
  });
});
