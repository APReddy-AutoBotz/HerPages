import type { LifecycleStageId } from "@herpages/contracts";
import type {
  RelationshipState,
  AdulthoodTransitionState,
} from "@herpages/contracts";

export interface VaultRepository {
  open(vaultId: string): Promise<void>;
  close(): Promise<void>;
  isOpen(): boolean;
}

export interface CatalogRepository {
  getCategories(): Promise<string[]>;
}

export interface NotificationTransport {
  send(userId: string, payload: { title: string; body: string }): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export interface AuditSink {
  record(entry: {
    action: string;
    actorId: string;
    resourceRef: string;
    timestamp: Date;
  }): Promise<void>;
}

export function resolveStageForAge(
  age: number,
  stages: ReadonlyArray<{
    id: LifecycleStageId;
    minAge: number;
    maxAge: number | null;
  }>,
): LifecycleStageId | null {
  for (const stage of stages) {
    if (age >= stage.minAge && (stage.maxAge === null || age <= stage.maxAge)) {
      return stage.id;
    }
  }
  return null;
}

const RELATIONSHIP_TRANSITIONS: Record<
  RelationshipState,
  Partial<Record<RelationshipState, true>>
> = {
  proposed: { assurance_pending: true, revoked: true },
  assurance_pending: { active: true, revoked: true },
  active: { suspended: true, revoked: true },
  suspended: { active: true, revoked: true },
  revoked: {},
};

export function nextRelationshipState(
  from: RelationshipState,
  to: RelationshipState,
): RelationshipState {
  if (RELATIONSHIP_TRANSITIONS[from]?.[to]) return to;
  throw new Error(`Invalid relationship transition: ${from} -> ${to}`);
}

const ADULTHOOD_TRANSITIONS: Record<
  AdulthoodTransitionState,
  Partial<Record<AdulthoodTransitionState, true>>
> = {
  minor_active: { transition_due: true, disputed: true, blocked: true },
  transition_due: {
    independent_identity_pending: true,
    disputed: true,
    blocked: true,
  },
  independent_identity_pending: {
    key_transfer_pending: true,
    disputed: true,
    blocked: true,
  },
  key_transfer_pending: {
    adult_independent: true,
    disputed: true,
    blocked: true,
  },
  adult_independent: { disputed: true },
  disputed: { transition_due: true, blocked: true },
  blocked: {},
};

export function nextAdulthoodTransitionState(
  from: AdulthoodTransitionState,
  to: AdulthoodTransitionState,
): AdulthoodTransitionState {
  if (ADULTHOOD_TRANSITIONS[from]?.[to]) return to;
  throw new Error(`Invalid adulthood transition: ${from} -> ${to}`);
}
