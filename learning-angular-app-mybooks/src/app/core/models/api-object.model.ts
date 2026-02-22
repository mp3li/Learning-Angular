export interface ApiObject {
  id: string;
  name: string;
  data?: Record<string, unknown> | null;
}
