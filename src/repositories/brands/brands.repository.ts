import { BrandEntity, BrandMemberRole } from '../../entities/brand.entity';
import { CreateBrandRequest, UpdateBrandRequest } from './BrandDTO';

export interface BrandsRepository {

  findAll(): Promise<BrandEntity[]>;

  findById(id: string): Promise<BrandEntity | null>;

  findAllByOwnerWorkspaceId(workspaceId: string): Promise<BrandEntity[] | null>;

  findAllBySharedWorkspaceId(workspaceId: string): Promise<BrandEntity[] | null>;

  create(dto: CreateBrandRequest, workspaceId: string): Promise<BrandEntity | null>;

  addMember(id: string, userId: string, role: BrandMemberRole): Promise<BrandEntity | null>;

  removeMember(id: string, userId: string): Promise<BrandEntity | null>;

  editRoleMember(id: string, userId: string, newRole: BrandMemberRole): Promise<BrandEntity | null>;

  shareToWorkspace(id: string, workspaceId: string): Promise<BrandEntity | null>;

  update(id: string, dto: UpdateBrandRequest): Promise<BrandEntity | null>;

  delete(id: string): Promise<void>;

}