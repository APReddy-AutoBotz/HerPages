import type { FeatureFlagName } from "@herpages/contracts";

export type AssuranceLevel = "adult" | "minor" | "unknown";

export interface PolicySubject {
  age: number | null;
  assurance: AssuranceLevel;
  jurisdiction: string;
}

export interface PolicyEvaluator {
  canAccess(
    subject: PolicySubject,
    capability: string,
    flags: Partial<Record<FeatureFlagName, boolean>>,
  ): PolicyDecision;
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
}

export function evaluateCapability(
  subject: PolicySubject,
  capability: string,
  adultAge: number,
): PolicyDecision {
  if (subject.age === null || subject.assurance === "unknown") {
    return { allowed: false, reason: "unknown_age_or_assurance" };
  }

  const isMinor = subject.age < adultAge;

  const alwaysDenied = [
    "adult_minor_dm",
    "minor_live_location",
    "public_minor_profiles",
    "police_dispatch_integration",
  ];
  if (alwaysDenied.includes(capability)) {
    return { allowed: false, reason: "capability_not_supported_baseline" };
  }

  const adultOnly = [
    "adult_community",
    "independent_adult_setup",
    "adult_ai_selected",
    "adult_safety_sessions",
    "mentor_programs",
  ];
  if (adultOnly.includes(capability) && (isMinor || subject.assurance !== "adult")) {
    return { allowed: false, reason: "adult_assurance_required" };
  }

  return { allowed: true, reason: "eligible_subject_to_fresh_checks" };
}
