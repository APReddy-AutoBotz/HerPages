import { describe, it, expect } from "vitest";
import {
  evaluateCapability,
  type CapabilityContext,
  type PolicySubject,
} from "../index.js";

const ADULT_AGE = 18;

function ctx(overrides: Partial<CapabilityContext["flags"]> = {}): CapabilityContext {
  return {
    adultAge: ADULT_AGE,
    flags: {
      synthetic_demo: { enabled: true, gate: "G1" },
      real_personal_vault: { enabled: false, gate: "G2" },
      real_child_processing: { enabled: false, gate: "G3" },
      adult_community: { enabled: false, gate: "G5" },
      mentor_programs: { enabled: false, gate: "G5" },
      cloud_ai_adult_selected: { enabled: false, gate: "G6" },
      adult_safety_sessions: { enabled: false, gate: "G7" },
      minor_live_location: { enabled: false, gate: "not_supported_baseline" },
      adult_minor_dm: { enabled: false, gate: "not_supported_baseline" },
      public_minor_profiles: { enabled: false, gate: "not_supported_baseline" },
      police_dispatch_integration: { enabled: false, gate: "not_supported_baseline" },
      ...overrides,
    },
  };
}

function adult(age: number): PolicySubject {
  return { age, assurance: "adult", jurisdiction: "IN" };
}

describe("golden policy cases", () => {
  it("POL-01: denies 17-year-old minor from adult_community", () => {
    const subject: PolicySubject = { age: 17, assurance: "minor", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_community", ctx());
    expect(result.allowed).toBe(false);
  });

  it("POL-02: allows 18-year-old adult for independent_adult_setup", () => {
    const subject: PolicySubject = { age: 18, assurance: "adult", jurisdiction: "IN" };
    const result = evaluateCapability(
      subject,
      "independent_adult_setup",
      ctx({ real_personal_vault: { enabled: true, gate: "G2" } }),
    );
    expect(result.allowed).toBe(true);
  });

  it("POL-03: denies 18-year-old unknown assurance from adult_community", () => {
    const subject: PolicySubject = { age: 18, assurance: "unknown", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_community", ctx());
    expect(result.allowed).toBe(false);
  });

  it("POL-04: allows 72-year-old adult for personal_vault", () => {
    const subject: PolicySubject = { age: 72, assurance: "adult", jurisdiction: "IN" };
    const result = evaluateCapability(
      subject,
      "personal_vault",
      ctx({ real_personal_vault: { enabled: true, gate: "G2" } }),
    );
    expect(result.allowed).toBe(true);
  });

  it("POL-05: denies 17-year-old minor from adult_minor_dm", () => {
    const subject: PolicySubject = { age: 17, assurance: "minor", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "adult_minor_dm", ctx());
    expect(result.allowed).toBe(false);
  });

  it("POL-06: denies null age unknown assurance from minor_live_location", () => {
    const subject: PolicySubject = { age: null, assurance: "unknown", jurisdiction: "IN" };
    const result = evaluateCapability(subject, "minor_live_location", ctx());
    expect(result.allowed).toBe(false);
  });

  it("POL-07: denies revoked-relationship adult from child_history_access", () => {
    const subject: PolicySubject = {
      age: 44,
      assurance: "adult",
      jurisdiction: "IN",
      relationship: "revoked",
    };
    const result = evaluateCapability(
      subject,
      "child_history_access",
      ctx({ real_child_processing: { enabled: true, gate: "G3" } }),
    );
    expect(result.allowed).toBe(false);
  });

  it("POL-08: denies payer adult from beneficiary_private_vault", () => {
    const subject: PolicySubject = {
      age: 50,
      assurance: "adult",
      jurisdiction: "IN",
    };
    const result = evaluateCapability(subject, "beneficiary_private_vault", ctx());
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("specific_key_and_grant_required");
  });
});

describe("FR-016: theme never grants authority", () => {
  it("age-17 and age-18 both visually Horizon but have different policy authority", () => {
    const minor: PolicySubject = { age: 17, assurance: "minor", jurisdiction: "IN" };
    const adult18: PolicySubject = { age: 18, assurance: "adult", jurisdiction: "IN" };
    const enabled = ctx({ adult_community: { enabled: true, gate: "G5" } });

    expect(evaluateCapability(minor, "adult_community", enabled).allowed).toBe(false);
    expect(evaluateCapability(adult18, "adult_community", enabled).allowed).toBe(true);
  });

  it("rejects authority claimed from theme, client_age, client_clock, user_metadata, payer_status", () => {
    const forged = {
      age: 18,
      assurance: "adult",
      jurisdiction: "IN",
      theme: "horizon",
      client_age: 18,
      client_clock: "2026-09-17T00:00:00Z",
      user_metadata: { adult: true },
      payer_status: "paid",
    } as unknown as PolicySubject;
    const result = evaluateCapability(forged, "adult_community", ctx());
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("rejected");
  });
});

describe("FR-039: adult-minor DM disabled", () => {
  it("denies mentor and guardian regardless of role", () => {
    const mentor: PolicySubject = { age: 40, assurance: "adult", jurisdiction: "IN" };
    const guardian: PolicySubject = {
      age: 40,
      assurance: "adult",
      jurisdiction: "IN",
      relationship: "active",
    };
    expect(evaluateCapability(mentor, "adult_minor_dm", ctx()).allowed).toBe(false);
    expect(evaluateCapability(guardian, "adult_minor_dm", ctx()).allowed).toBe(false);
  });
});

describe("FR-045: minor live location disabled", () => {
  it("denies even when a guardian toggles a client flag", () => {
    const guardian: PolicySubject = {
      age: 40,
      assurance: "adult",
      jurisdiction: "IN",
      relationship: "active",
    };
    const result = evaluateCapability(
      guardian,
      "minor_live_location",
      ctx({ minor_live_location: { enabled: true, gate: "not_supported_baseline" } }),
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("capability_not_supported_baseline");
  });
});

describe("FR-056: fail closed for unknown or disabled capabilities", () => {
  it("denies a disabled adult_community flag", () => {
    const subject = adult(20);
    expect(evaluateCapability(subject, "adult_community", ctx()).allowed).toBe(false);
  });

  it("denies a capability whose flag is absent from the flag set", () => {
    const subject = adult(20);
    const result = evaluateCapability(subject, "adult_community", {
      adultAge: ADULT_AGE,
      flags: {},
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("feature_flag_disabled_or_unknown");
  });

  it("denies unknown capability string", () => {
    const subject = adult(20);
    const result = evaluateCapability(subject, "not_a_real_capability" as never, ctx());
    expect(result.allowed).toBe(false);
  });

  it("denies disputed assurance even with adult age", () => {
    const subject: PolicySubject = { age: 30, assurance: "disputed", jurisdiction: "IN" };
    expect(evaluateCapability(subject, "adult_community", ctx()).allowed).toBe(false);
  });
});
