import { describe, it, expect } from "vitest";
import { brand, semantic, stages, spacing, radii } from "../index.js";

describe("design tokens", () => {
  it("preserves brand name and tagline", () => {
    expect(brand.name).toBe("HerPages");
    expect(brand.tagline).toBe("An app that grows with her.");
  });

  it("provides all 10 lifecycle stage palettes", () => {
    const stageIds = Object.keys(stages);
    expect(stageIds).toHaveLength(10);
    expect(stageIds).toContain("first_pages");
    expect(stageIds).toContain("evergreen");
  });

  it("light and dark themes share core keys", () => {
    const lightKeys = new Set(Object.keys(semantic.light));
    const darkKeys = new Set(Object.keys(semantic.dark));
    for (const key of darkKeys) {
      expect(lightKeys.has(key)).toBe(true);
    }
  });

  it("uses 8px spacing system", () => {
    expect(spacing).toContain(8);
    expect(spacing).toContain(16);
  });

  it("defines card and control radii", () => {
    expect(radii.card).toBe(20);
    expect(radii.control).toBe(12);
  });
});
