import type {
  CapabilityName,
  FeatureFlagName,
  PolicyDecision,
  PolicySubject,
} from "@herpages/contracts";

export type { PolicySubject } from "@herpages/contracts";

export type AssuranceLevel = "adult" | "minor" | "unknown" | "disputed";

export interface FeatureGate {
  enabled: boolean;
  gate: string;
}

export interface CapabilityContext {
  adultAge: number;
  flags: Readonly<Partial<Record<FeatureFlagName, FeatureGate>>>;
}

const NEVER_SUPPORTED: ReadonlySet<CapabilityName> = new Set([
  "adult_minor_dm",
  "minor_live_location",
  "public_minor_profiles",
  "police_dispatch_integration",
]);

const ADULT_ONLY: ReadonlySet<CapabilityName> = new Set([
  "adult_community",
  "independent_adult_setup",
  "adult_ai_selected",
  "adult_safety_sessions",
  "mentor_programs",
]);

const FLAG_BY_CAPABILITY: Partial<Record<CapabilityName, FeatureFlagName>> = {
  adult_community: "adult_community",
  mentor_programs: "mentor_programs",
  adult_ai_selected: "cloud_ai_adult_selected",
  adult_safety_sessions: "adult_safety_sessions",
  adult_minor_dm: "adult_minor_dm",
  minor_live_location: "minor_live_location",
  public_minor_profiles: "public_minor_profiles",
  police_dispatch_integration: "police_dispatch_integration",
  personal_vault: "real_personal_vault",
  child_history_access: "real_child_processing",
  beneficiary_private_vault: "real_personal_vault",
  independent_adult_setup: "real_personal_vault",
};

const NEVER_AUTHORITY_FIELDS = [
  "theme",
  "client_age",
  "client_clock",
  "user_metadata",
  "payer_status",
] as const;

export function evaluateCapability(
  subject: PolicySubject,
  capability: CapabilityName,
  context: CapabilityContext,
): PolicyDecision {
  const denied = denyIfAuthorityClaimed(subject);
  if (denied) return denied;

  if (subject.age === null || subject.assurance === "unknown" || subject.assurance === "disputed") {
    return { allowed: false, reason: "unknown_or_disputed_age_or_assurance" };
  }

  if (NEVER_SUPPORTED.has(capability)) {
    return { allowed: false, reason: "capability_not_supported_baseline" };
  }

  if (capability === "beneficiary_private_vault") {
    return { allowed: false, reason: "specific_key_and_grant_required" };
  }

  const flagName = FLAG_BY_CAPABILITY[capability];
  if (flagName) {
    const gate = context.flags[flagName];
    if (!gate || gate.enabled !== true) {
      return { allowed: false, reason: "feature_flag_disabled_or_unknown" };
    }
  }

  const isMinor = subject.age < context.adultAge;

  if (ADULT_ONLY.has(capability)) {
    if (isMinor || subject.assurance !== "adult") {
      return { allowed: false, reason: "adult_assurance_required" };
    }
    return { allowed: true, reason: "eligible_subject_to_fresh_checks" };
  }

  if (capability === "child_history_access") {
    if (subject.relationship !== "active") {
      return { allowed: false, reason: "active_relationship_required" };
    }
    if (subject.assurance !== "adult") {
      return { allowed: false, reason: "adult_assurance_required" };
    }
    return { allowed: true, reason: "eligible_subject_to_fresh_checks" };
  }

  if (capability === "personal_vault") {
    if (isMinor && subject.assurance !== "minor") {
      return { allowed: false, reason: "minor_assurance_required" };
    }
    return { allowed: true, reason: "eligible_subject_to_gate" };
  }

  return { allowed: false, reason: "unknown_capability" };
}

function denyIfAuthorityClaimed(subject: PolicySubject): PolicyDecision | null {
  const claimed = (subject as unknown as Record<string, unknown>);
  for (const field of NEVER_AUTHORITY_FIELDS) {
    if (field in claimed && claimed[field] !== undefined && claimed[field] !== null) {
      return { allowed: false, reason: `authority_from_${field}_rejected` };
    }
  }
  return null;
}
