import { describe, it, expect } from "vitest";
import { evaluateCapability, type PolicySubject } from "../index.js";

const INDIA_ADULT_AGE = 18;

describe("evaluateCapability — golden policy cases", () => {
  it("POL-01: denies 17-year-old minor from adult_community", () => {
    const subject: PolicySubject = { age: 17, assurance: "minor", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_community", INDIA_ADULT_AGE);
    expect(result.allowed).toBe(false);
  });

  it("POL-02: allows 18-year-old adult for independent_adult_setup", () => {
    const subject: PolicySubject = { age: 18, assurance: "adult", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "independent_adult_setup", INDIA_ADULT_AGE);
    expect(result.allowed).toBe(true);
  });

  it("POL-03: denies 18-year-old unknown assurance from adult_community", () => {
    const subject: PolicySubject = { age: 18, assurance: "unknown", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_community", INDIA_ADULT_AGE);
    expect(result.allowed).toBe(false);
  });

  it("POL-05: denies 17-year-old minor from adult_minor_dm", () => {
    const subject: PolicySubject = { age: 17, assurance: "minor", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_minor_dm", INDIA_ADULT_AGE);
    expect(result.allowed).toBe(false);
  });

  it("POL-06: denies null age unknown assurance from minor_live_location", () => {
    const subject: PolicySubject = { age: null, assurance: "unknown", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "minor_live_location", INDIA_ADULT_AGE);
    expect(result.allowed).toBe(false);
  });
});
