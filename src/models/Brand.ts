import { Schema, model } from "mongoose";
import { BrandEntity } from '../entities/brand.entity';

const brand = new Schema<BrandEntity>(
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
          unique: true,
        },
        role: {
          type: String,
          enum: ['admin', 'editor', 'viewer'],
          required: true,
        },
      },
    ],
    workspaces: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Workspace',
        },
        type: {
          type: String,
          enum: ['owner', 'shared'],
        },
      },
    ],
    connections: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Connection',
        },
      },
    ],
  },
  {
    _id: true,
    timestamps: true,
  },
);

export const Brand = model<BrandEntity>('Brand', brand);