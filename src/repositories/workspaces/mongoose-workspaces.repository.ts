import mongoose from 'mongoose';

import { WorkspaceEntity, WorkspaceMemberRole } from '../../entities/workspace.entity';
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from './WorkspaceDTO';
import { WorkspacesRepository } from './workspaces.repository';
import { Workspace } from '../../models/Workspace';
import { Brand } from '../../models/Brand';
import { BrandWorkspaceType } from '../../entities/brand.entity';
import { WorkspaceMapper } from '../../mappers/workspace.mapper';

export class MongooseWorkspacesRepository implements WorkspacesRepository {

  async findAll(): Promise<WorkspaceEntity[]> {
    const workspaces = await Workspace.find();

    return workspaces.map(WorkspaceMapper.mongoToDomain);
  }
  
  async findById(id: string): Promise<WorkspaceEntity | null> {
    const workspace = await Workspace.findById(id);

    if(!workspace) {
      return null;
    }

    return WorkspaceMapper.mongoToDomain(workspace);
  }
  
  async findAllByMemberId(userId: string, role?: WorkspaceMemberRole | undefined): Promise<WorkspaceEntity[] | null> {

    let workspaces;

    if(role) {
      workspaces = await Workspace.find({
        members: {
          $elemMatch: {
            userId: {
              $eq: userId,
            },
            role: {
              $eq: role
            },
          },
        },
      });
    } else {
      workspaces = await Workspace.find({
        members: {
          $elemMatch: {
            userId: {
              $eq: userId,
            },
          },
        },
      });
    }

    return workspaces.map(WorkspaceMapper.mongoToDomain);
  }
  
  async findAllByBrandId(brandId: string, type?: BrandWorkspaceType): Promise<WorkspaceEntity[] | null> {
    const brand = await Brand.findById(brandId);

    if(!brand) {
      return null;
    }

    let workspacesIds: mongoose.Schema.Types.ObjectId[];

    if(type) {
      // @ts-ignore
      workspacesIds = brand.workspaces.filter(workspace => workspace.type === type).map(workspace => workspace.id);
    } else {
      // @ts-ignore
      workspacesIds = brand.workspaces.map(workspace => workspace.id);
    }

    const workspaces = await Workspace.find({
      _id: { $in: workspacesIds },
    });

    return workspaces.map(WorkspaceMapper.mongoToDomain);
  }
  
  async create({ name, userId }: CreateWorkspaceRequest): Promise<WorkspaceEntity> {
    const workspace = await Workspace.create({
      name,
      members: [
        {
          userId,
          role: 'owner',
        },
      ],
    });

    return WorkspaceMapper.mongoToDomain(workspace);
  }
  
  async addMember(id: string, userId: string, role: Omit<WorkspaceMemberRole, 'owner'>): Promise<WorkspaceEntity | null> {
    const workspace = await Workspace.findById(id);

    if(!workspace) {
      return null;
    }

    const members = workspace.members;

    // @ts-ignore
    members.push({ userId, role });

    const workspaceUpdated = await Workspace.findByIdAndUpdate(id, { members }, { new: true });

    if(!workspaceUpdated) {
      return null;
    }

    return WorkspaceMapper.mongoToDomain(workspaceUpdated);
  }
  
  async removeMember(id: string, userId: string): Promise<WorkspaceEntity | null> {
    const workspace = await Workspace.findById(id);

    if(!workspace) {
      return null;
    }

    const members = workspace.members.filter(member => member.userId.toString() !== userId.toString());

    const workspaceUpdated = await Workspace.findByIdAndUpdate(id, { members }, { new: true });
    
    if(!workspaceUpdated) {
      return null;
    }

    return WorkspaceMapper.mongoToDomain(workspaceUpdated);
  }
  
  async editRoleMember(id: string, userId: string, newRole: WorkspaceMemberRole): Promise<WorkspaceEntity | null> {
    const workspace = await Workspace.findById(id);

    if(!workspace) {
      return null;
    }

    const members = workspace.members.map(member => {
      if(member.userId.toString() === userId.toString()) {
        return {
          userId: member.userId,
          role: newRole,
        };
      }

      return member;
    });

    const workspaceUpdated = await Workspace.findByIdAndUpdate(id, { members }, { new: true });

    if(!workspaceUpdated) {
      return null;
    }

    return WorkspaceMapper.mongoToDomain(workspaceUpdated);
  }
  
  async update(id: string, { name }: UpdateWorkspaceRequest): Promise<WorkspaceEntity | null> {
    const workspace = await Workspace.findByIdAndUpdate(id, { name });

    if(!workspace) {
      return null;
    }

    return WorkspaceMapper.mongoToDomain(workspace);
  }
  
  async delete(id: string): Promise<void> {
    await Workspace.findByIdAndDelete(id);
  }
  
  
}