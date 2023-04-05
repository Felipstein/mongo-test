import { Document } from "mongoose";
import { BrandEntity } from "../entities/brand.entity"

type BrandDomain = BrandEntity;
type BrandMongo = Document<unknown, {}, BrandEntity> & Omit<BrandEntity & { _id: string }, never>;

export class BrandMapper {

  static mongoToBrand(brandMongo: BrandMongo): BrandDomain {
    return {
      id: brandMongo._id.toString(),
      name: brandMongo.name,
      members: brandMongo.members.map(member => ({
        userId: member.userId.toString(),
        type: member.type,
      })),
      workspaces: brandMongo.workspaces.map(workspace => ({
        id: workspace.id.toString(),
        type: workspace.type,
      })),
      connections: brandMongo.connections.map(connection => ({
        id: connection.id.toString(),
      })),
    };
  }

}