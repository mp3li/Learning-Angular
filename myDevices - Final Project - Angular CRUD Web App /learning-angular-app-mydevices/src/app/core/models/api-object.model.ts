export interface ApiObject {
  id: string;
  name: string;
  data: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiObjectPayload {
  name: string;
  data: Record<string, unknown>;
}

export interface ApiObjectPatchPayload {
  name?: string;
  data?: Record<string, unknown>;
}
