import { UserEntity } from "../../entities/user.entity";
import { UserCreateRequest, UserUpdateRequest } from './UserDTO';

export interface UsersRepository {

  findAll(): Promise<UserEntity[]>;
  
  findById(id: string): Promise<UserEntity | null>;

  create(dto: UserCreateRequest): Promise<UserEntity>;

  update(id: string, dto: UserUpdateRequest): Promise<UserEntity | null>;

  delete(id: string): Promise<void>;

}