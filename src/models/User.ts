import { Schema, model } from "mongoose";
import { UserEntity } from '../entities/user.entity';

const user = new Schema<UserEntity>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    id: true,
    timestamps: true,
  },
);

export const User = model<UserEntity>('User', user);