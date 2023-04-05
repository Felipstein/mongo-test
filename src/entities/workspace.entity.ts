export type WorkspaceMemberRole = 'owner' | 'admin' | 'worker';

export interface WorkspaceEntity {
  id: string;
  name: string;
  members: {
    userId: string;
    role: WorkspaceMemberRole,
  }[],
  brands: { 
    id: string;
  }[],
  connections: {
    id: string;
  }[],
}