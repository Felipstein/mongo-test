import { Document, Types } from "mongoose";
import { UserEntity } from "../entities/user.entity";

type UserDomain = UserEntity;
type UserMongo = Document<unknown, {}, UserEntity> & Omit<UserEntity & {
  _id: Types.ObjectId;
}, never>

export class UserMapper {

  static mongoToDomain(userMongo: UserMongo): UserDomain {
    return {
      id: userMongo._id.toString(),
      name: userMongo.name,
    };
  }

}