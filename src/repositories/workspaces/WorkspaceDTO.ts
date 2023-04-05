export interface CreateWorkspaceRequest {
  userId: string;
  name: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
}