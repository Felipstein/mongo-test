import { Document, Types } from "mongoose";
import { WorkspaceEntity } from "../entities/workspace.entity";

type WorkspaceDomain = WorkspaceEntity;
type WorkspaceMongo = Document<unknown, {}, WorkspaceEntity> & Omit<WorkspaceEntity & {
  _id: Types.ObjectId;
}, never>;

export class WorkspaceMapper {

  static mongoToDomain(workspaceMongo: WorkspaceMongo): WorkspaceDomain {
    return {
      id: workspaceMongo._id.toString(),
      name: workspaceMongo.name,
      members: workspaceMongo.members.map(member => ({
        userId: member.userId.toString(),
        role: member.role,
      })),
      brands: workspaceMongo.brands.map(brand => ({
        id: brand.id.toString(),
      })),
      connections: workspaceMongo.connections.map(connection => ({
        id: connection.id.toString(),
      })),
    };
  }

}