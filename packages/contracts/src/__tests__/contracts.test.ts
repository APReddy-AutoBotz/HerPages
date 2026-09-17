import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LifecycleContract,
  DomainEvent,
  Opportunity,
  ConsentReceipt,
  VaultEnvelope,
  FeatureFlagsContract,
  GoldenPolicyCase,
} from "@herpages/contracts";

const contractsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../contracts",
);

function loadJson(name: string): unknown {
  return JSON.parse(readFileSync(resolve(contractsDir, name), "utf-8"));
}

describe("contracts parse existing JSON schemas", () => {
  it("lifecycle.json validates", () => {
    const data = loadJson("lifecycle.json");
    const result = LifecycleContract.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("feature-flags.json validates", () => {
    const data = loadJson("feature-flags.json");
    const result = FeatureFlagsContract.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("golden-policy-cases.json cases validate", () => {
    const data = loadJson("golden-policy-cases.json") as {
      cases: unknown[];
    };
    for (const c of data.cases) {
      const result = GoldenPolicyCase.safeParse(c);
      expect(result.success).toBe(true);
    }
  });
});

describe("contract schemas reject invalid data", () => {
  it("rejects event with missing required fields", () => {
    const result = DomainEvent.safeParse({ event_type: "consent.withdrawn" });
    expect(result.success).toBe(false);
  });

  it("rejects opportunity with invalid country code", () => {
    const result = Opportunity.safeParse({
      id: "00000000-0000-0000-0000-000000000001",
      title: "Test",
      organizer: "Org",
      source_url: "https://example.com",
      application_url: "https://example.com/apply",
      category: "learning",
      countries: ["india"],
      mode: "remote",
      eligibility: { min_age: 18, max_age: null, description: "Adults" },
      cost_status: "free",
      deadline: null,
      timezone: "Asia/Kolkata",
      status: "draft",
      verified_at: null,
      is_demo: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects vault envelope with wrong crypto profile", () => {
    const result = VaultEnvelope.safeParse({
      format_version: "1.0-draft",
      vault_id: "00000000-0000-0000-0000-000000000001",
      object_id: "00000000-0000-0000-0000-000000000002",
      key_epoch: 1,
      crypto_profile: "AES-256-GCM",
      nonce_b64: "dGVzdA==",
      aad_b64: "dGVzdA==",
      ciphertext_b64: "dGVzdA==",
      ciphertext_sha256:
        "a".repeat(64),
    });
    expect(result.success).toBe(false);
  });

  it("rejects consent receipt with invalid purpose", () => {
    const result = ConsentReceipt.safeParse({
      receipt_id: "00000000-0000-0000-0000-000000000001",
      actor_id: "00000000-0000-0000-0000-000000000002",
      subject_id: "00000000-0000-0000-0000-000000000003",
      purpose: "marketing",
      notice_version: "1.0",
      policy_version: "1.0",
      assurance_reference: "ref",
      granted_at: "2026-01-01T00:00:00Z",
      withdrawn_at: null,
      state: "active",
    });
    expect(result.success).toBe(false);
  });
});
