export interface ConnectionEntity {
  id: string;
  name: string;
  workspaceId: string;
  brands: {
    id: string
  }[];
  credentials: Record<string, string>;
}