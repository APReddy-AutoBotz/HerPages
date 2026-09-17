import { describe, it, expect } from "vitest";
import { resolveStageForAge } from "../index.js";

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
