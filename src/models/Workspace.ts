import { Schema, model } from "mongoose";
import { WorkspaceEntity } from '../entities/workspace.entity';

const workspace = new Schema<WorkspaceEntity>(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'worker'],
          required: true,
        },
      },
    ],
    brands: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Brand',
          required: true,
        },
      },
    ],
    connections: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Connection',
          required: true,
        },
      },
    ],
  },
  {
    _id: true,
    timestamps: true,
  },
);

export const Workspace = model<WorkspaceEntity>('Workspace', workspace);
