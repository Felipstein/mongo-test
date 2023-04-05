import { BrandWorkspaceType } from '../../entities/brand.entity';
import { WorkspaceEntity, WorkspaceMemberRole } from '../../entities/workspace.entity';
import { CreateWorkspaceRequest, UpdateWorkspaceRequest } from './WorkspaceDTO';

export interface WorkspacesRepository {

  findAll(): Promise<WorkspaceEntity[]>;

  findById(id: string): Promise<WorkspaceEntity | null>;

  findAllByMemberId(userId: string, role?: WorkspaceMemberRole): Promise<WorkspaceEntity[] | null>;

  findAllByBrandId(brandId: string, type?: BrandWorkspaceType): Promise<WorkspaceEntity[] | null>;

  create(dto: CreateWorkspaceRequest): Promise<WorkspaceEntity>;

  addMember(id: string, userId: string, role: Omit<WorkspaceMemberRole, 'owner'>): Promise<WorkspaceEntity | null>;

  removeMember(id: string, userId: string): Promise<WorkspaceEntity | null>;

  editRoleMember(id: string, userId: string, newRole: WorkspaceMemberRole): Promise<WorkspaceEntity | null>;

  update(id: string, dto: UpdateWorkspaceRequest): Promise<WorkspaceEntity | null>;

  delete(id: string): Promise<void>;

}