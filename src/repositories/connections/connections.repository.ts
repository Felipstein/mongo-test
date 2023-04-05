import { ConnectionEntity } from '../../entities/connection.entity';
import { CreateConnectionRequest, UpdateConnectionRequest } from './ConnectionDTO';

export interface ConnectionsRepository {

  findAll(): Promise<ConnectionEntity[]>;

  findById(id: string): Promise<ConnectionEntity | null>;

  findByWorkspaceId(workspaceId: string): Promise<ConnectionEntity[] | null>;

  findByBrandId(brandId: string): Promise<ConnectionEntity[] | null>;

  create(dto: CreateConnectionRequest, workspaceId: string): Promise<ConnectionEntity | null>;

  addToBrand(id: string, brandId: string): Promise<ConnectionEntity | null>;

  removeOfBrand(id: string, brandId: string): Promise<void>;

  update(id: string, dto: UpdateConnectionRequest): Promise<ConnectionEntity | null>;

  delete(id: string): Promise<void>;

}