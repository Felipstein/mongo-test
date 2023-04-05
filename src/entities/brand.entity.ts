import mongoose from "mongoose";

export type BrandMemberRole = 'admin' | 'editor' | 'viewer';
export type BrandWorkspaceType = 'owner' | 'shared';

export interface BrandEntity {
  id: string;
  name: string;
  members: {
    userId: string;
    type: BrandMemberRole,
  }[],
  workspaces: {
    id: string | mongoose.Schema.Types.ObjectId;
    type: BrandWorkspaceType,
  }[],
  connections: {
    id: string;
  }[],
}