import type { AeadProvider } from "../crypto/aead.js";
import { KEY_LENGTH } from "../crypto/aead.js";

export type RotationState = "idle" | "rotating" | "done" | "failed";

export interface KeyEpoch {
  epoch: number;
  rootKey: Uint8Array;
  createdAt: number;
}

/** Status intentionally contains epoch identifiers only, never raw keys. */
export interface RotationStatus {
  state: RotationState;
  currentEpoch: number;
  pendingEpoch: number | null;
  previousEpoch: number | null;
  reencryptedCount: number;
  totalCount: number;
}

/**
 * Logical key-rotation state machine. A failed logical rotation retains the same
 * pending key and progress so resume does not orphan objects already encrypted
 * under that pending epoch. Process-death persistence of keys/checkpoints is a
 * separate native verification item and remains NOT RUN for G2.
 */
export class KeyRotationStateMachine {
  private current: KeyEpoch;
  private pending: KeyEpoch | null = null;
  private previous: KeyEpoch | null = null;
  private state: RotationState = "idle";
  private reencryptedCount = 0;
  private totalCount = 0;

  constructor(private readonly provider: AeadProvider, initialEpoch: KeyEpoch) {
    this.current = cloneEpoch(initialEpoch);
  }

  async beginRotation(totalObjects: number): Promise<void> {
    if (this.state !== "idle") throw new Error(`Rotation cannot begin from state ${this.state}`);
    if (!Number.isInteger(totalObjects) || totalObjects < 0) throw new Error("totalObjects must be a non-negative integer");
    this.previous = cloneEpoch(this.current);
    this.pending = {
      epoch: this.current.epoch + 1,
      rootKey: await this.provider.randomBytes(KEY_LENGTH),
      createdAt: Date.now(),
    };
    this.reencryptedCount = 0;
    this.totalCount = totalObjects;
    this.state = "rotating";
  }

  markReencrypted(): void {
    if (this.state !== "rotating") throw new Error("Not in rotating state");
    if (this.reencryptedCount >= this.totalCount) throw new Error("Re-encrypted count exceeds total object count");
    this.reencryptedCount += 1;
  }

  finalize(): void {
    if (this.state !== "rotating" || !this.pending) throw new Error("No active rotation to finalize");
    if (this.reencryptedCount !== this.totalCount) {
      throw new Error(`Cannot finalize: ${this.reencryptedCount}/${this.totalCount} objects re-encrypted`);
    }
    this.current = cloneEpoch(this.pending);
    this.pending = null;
    this.state = "done";
  }

  fail(): void {
    if (this.state !== "rotating") return;
    // Keep current (old) and pending (new) keys plus progress intact.
    this.state = "failed";
  }

  async resume(): Promise<void> {
    if (this.state !== "failed" || !this.pending) throw new Error("No failed rotation is available to resume");
    this.state = "rotating";
  }

  reset(): void {
    if (this.state === "rotating") throw new Error("Cannot reset an active rotation");
    this.pending?.rootKey.fill(0);
    this.previous?.rootKey.fill(0);
    this.pending = null;
    this.previous = null;
    this.reencryptedCount = 0;
    this.totalCount = 0;
    this.state = "idle";
  }

  getCurrentEpoch(): KeyEpoch {
    return cloneEpoch(this.current);
  }

  /** Sensitive accessor for the migration worker; never log or serialize this object. */
  getPendingEpochForMigration(): KeyEpoch | null {
    return this.pending ? cloneEpoch(this.pending) : null;
  }

  getStatus(): RotationStatus {
    return {
      state: this.state,
      currentEpoch: this.current.epoch,
      pendingEpoch: this.pending?.epoch ?? null,
      previousEpoch: this.previous?.epoch ?? null,
      reencryptedCount: this.reencryptedCount,
      totalCount: this.totalCount,
    };
  }
}

function cloneEpoch(epoch: KeyEpoch): KeyEpoch {
  return { epoch: epoch.epoch, rootKey: new Uint8Array(epoch.rootKey), createdAt: epoch.createdAt };
}
