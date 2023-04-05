import { Schema, model } from "mongoose";
import { ConnectionEntity } from '../entities/connection.entity';

const connection = new Schema<ConnectionEntity>(
  {
    name: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    brands: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Brand',
        },
      },
    ],
    authType: {
      type: String,
      enum: ['oauth', 'token'],
      required: true,
    },
    credentials: {
      type: Map,
      of: String,
      required: false,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

export const Connection = model<ConnectionEntity>('Connection', connection);