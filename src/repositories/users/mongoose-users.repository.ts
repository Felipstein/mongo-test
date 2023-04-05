import { UserEntity } from "../../entities/user.entity";
import { UserCreateRequest, UserUpdateRequest } from "./UserDTO";
import { UsersRepository } from "./users.repository";
import { User } from '../../models/User';
import { UserMapper } from '../../mappers/user.mapper';
import { Workspace } from "../../models/Workspace";
import { MongooseWorkspacesRepository } from "../workspaces/mongoose-workspaces.repository";
import { WorkspaceEntity } from "../../entities/workspace.entity";

const workspacesRepository = new MongooseWorkspacesRepository();

export class MongooseUsersRepository implements UsersRepository {

  async findAll(): Promise<UserEntity[]> {
    const users = await User.find();

    return users.map(UserMapper.mongoToDomain);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await User.findById(id);

    if(!user) {
      return null;
    }

    return UserMapper.mongoToDomain(user);
  }

  async create({ name }: UserCreateRequest): Promise<UserEntity> {
    const user = await User.create({
      name,
    });

    return UserMapper.mongoToDomain(user);
  }

  async update(id: string, { name }: UserUpdateRequest): Promise<UserEntity | null> {
    const user = await User.findByIdAndUpdate(id, { name }, { new: true });

    if(!user) {
      return null;
    }

    return UserMapper.mongoToDomain(user);
  }
  
  async delete(id: string): Promise<void> {

    const workspaces = await Workspace.find({
      members: {
        $elemMatch: {
          userId: {
            $eq: id,
          },
        },
      },
    });

    const workspacesMember: WorkspaceEntity[] = [];
    const workspacesOwner: WorkspaceEntity[] = [];

    workspaces.forEach(workspace => {
      if(workspace.members.some(member => member.userId.toString() === id && member.role !== 'owner')) {
        workspacesMember.push(workspace);
      }

      if(workspace.members.some(member => member.userId.toString() === id && member.role === 'owner')) {
        workspacesOwner.push(workspace);
      }
    });

    const promisesMember = workspacesMember.map(async (workspace) => {
      await workspacesRepository.removeMember(workspace.id, id);
    })

    const promisesOwner = workspacesOwner.map(async (workspace) => {
      await workspacesRepository.delete(workspace.id);
    })

    await Promise.all([...promisesMember, ...promisesOwner]);

    await User.findByIdAndDelete(id);
  }
  
}