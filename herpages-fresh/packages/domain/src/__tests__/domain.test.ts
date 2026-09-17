import { describe, it, expect } from "vitest";
import {
  resolveStageForAge,
  nextRelationshipState,
  nextAdulthoodTransitionState,
} from "../index.js";

const stages = [
  { id: "first_pages" as const, minAge: 0, maxAge: 5 },
  { id: "wonder" as const, minAge: 6, maxAge: 9 },
  { id: "bloom" as const, minAge: 10, maxAge: 12 },
  { id: "aura" as const, minAge: 13, maxAge: 15 },
  { id: "horizon" as const, minAge: 16, maxAge: 18 },
  { id: "rise" as const, minAge: 19, maxAge: 24 },
  { id: "momentum" as const, minAge: 25, maxAge: 35 },
  { id: "rooted" as const, minAge: 36, maxAge: 49 },
  { id: "flourish" as const, minAge: 50, maxAge: 64 },
  { id: "evergreen" as const, minAge: 65, maxAge: null },
];

describe("resolveStageForAge", () => {
  it("returns first_pages for age 3", () => {
    expect(resolveStageForAge(3, stages)).toBe("first_pages");
  });

  it("returns horizon for age 18", () => {
    expect(resolveStageForAge(18, stages)).toBe("horizon");
  });

  it("returns horizon for age 17 (age-17/18 share visual chapter)", () => {
    expect(resolveStageForAge(17, stages)).toBe("horizon");
  });

  it("returns evergreen for age 90", () => {
    expect(resolveStageForAge(90, stages)).toBe("evergreen");
  });

  it("returns null for negative age", () => {
    expect(resolveStageForAge(-1, stages)).toBeNull();
  });

  it("handles boundary at age 0", () => {
    expect(resolveStageForAge(0, stages)).toBe("first_pages");
  });
});

describe("relationship state machine", () => {
  it("proposed -> assurance_pending -> active -> suspended -> active -> revoked", () => {
    expect(nextRelationshipState("proposed", "assurance_pending")).toBe("assurance_pending");
    expect(nextRelationshipState("assurance_pending", "active")).toBe("active");
    expect(nextRelationshipState("active", "suspended")).toBe("suspended");
    expect(nextRelationshipState("suspended", "active")).toBe("active");
    expect(nextRelationshipState("active", "revoked")).toBe("revoked");
  });

  it("rejects self-approval (proposed -> active)", () => {
    expect(() => nextRelationshipState("proposed", "active")).toThrow();
  });

  it("revoked is terminal", () => {
    expect(() => nextRelationshipState("revoked", "active")).toThrow();
  });
});

describe("adulthood transition state machine", () => {
  it("walks the happy path to adult_independent", () => {
    expect(nextAdulthoodTransitionState("minor_active", "transition_due")).toBe("transition_due");
    expect(nextAdulthoodTransitionState("transition_due", "independent_identity_pending")).toBe(
      "independent_identity_pending",
    );
    expect(nextAdulthoodTransitionState("independent_identity_pending", "key_transfer_pending")).toBe(
      "key_transfer_pending",
    );
    expect(nextAdulthoodTransitionState("key_transfer_pending", "adult_independent")).toBe(
      "adult_independent",
    );
  });

  it("supports disputed and blocked side states", () => {
    expect(nextAdulthoodTransitionState("minor_active", "disputed")).toBe("disputed");
    expect(nextAdulthoodTransitionState("disputed", "blocked")).toBe("blocked");
  });

  it("rejects skipping key transfer", () => {
    expect(() =>
      nextAdulthoodTransitionState("independent_identity_pending", "adult_independent"),
    ).toThrow();
  });
});
