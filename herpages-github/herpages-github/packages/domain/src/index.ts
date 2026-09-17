import type { LifecycleStageId } from "@herpages/contracts";

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
