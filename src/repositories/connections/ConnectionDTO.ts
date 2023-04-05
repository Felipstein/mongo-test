export interface CreateConnectionRequest {
  name: string;
  credentials: Record<string, string>;
}

export interface UpdateConnectionRequest {
  name?: string;
  credentials?: Record<string, string>;
}