import { Request, Response } from "express";
import { WorkspacesRepository } from '../repositories/workspaces/workspaces.repository';
import { WorkspaceMemberRole } from "../entities/workspace.entity";
import { UsersRepository } from "../repositories/users/users.repository";
import { APIError } from '../errors/APIError';
import { someIsNull, someIsNullish } from "../utils/validations";
import { Workspace } from "../models/Workspace";

export class WorkspaceController {

  constructor(
    private workspacesRepository: WorkspacesRepository,
    private usersRepository: UsersRepository,
  ) { }

  async index(req: Request, res: Response) {
    const workspaces = await this.workspacesRepository.findAll();
   
    return res.json(workspaces);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const workspace = await this.workspacesRepository.findById(id);

    return res.json(workspace);
  }

  async findAllByMemberId(req: Request, res: Response) {
    const { userId } = req.params;
    const { role } = req.query as { role?: WorkspaceMemberRole };

    const workspace = await this.workspacesRepository.findAllByMemberId(userId, role);

    return res.json(workspace);
  }

  async findByBrandId(req: Request, res: Response) {
    const { brandId } = req.params;
    const { is } = req.query as { is?: 'owner' | 'shared' };

    const workspaces = await this.workspacesRepository.findAllByBrandId(brandId, is);

    return res.json(workspaces);
  }

  async create(req: Request, res: Response) {
    const { name, userId } = req.body;

    if(someIsNullish(name, userId)) {
      throw new APIError('Nome e Usuário são obrigatórios.', 400);
    }
    
    const userExists = await this.usersRepository.findById(userId);
    if(!userExists) {
      throw new APIError('Usuário não existe.', 404);
    }

    const workspace = await this.workspacesRepository.create({ name, userId });

    return res.status(201).json(workspace);
  }

  async addMember(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    if(someIsNullish(userId, role)) {
      throw new APIError('Usuário e Cargo são obrigatórios.', 400);
    }

    if(role === 'owner') {
      throw new APIError('Para adicionar um usuário como owner, você deve adiciona-lo primeiro na workspace como um admin ou worker.', 400);
    }

    if(!['admin', 'worker'].includes(role)) {
      throw new APIError('O cargo pode ser somente admin ou worker.', 400);      
    }

    const workspace = await this.workspacesRepository.findById(workspaceId);
    if(!workspace) {
      throw new APIError('Workspace não existe.', 404);
    }

    const usersIds = workspace.members.map(member => member.userId);
    const hasUser = usersIds.includes(userId);
    if(hasUser) {
      throw new APIError('Usuário já está na workspace.', 400);
    }

    const userExists = await this.usersRepository.findById(userId);
    if(!userExists) {
      throw new APIError('Usuário não existe.', 404);
    }

    const member = await this.workspacesRepository.addMember(workspaceId, userId, role);

    return res.status(201).json(member);
  }

  async editRoleMember(req: Request, res: Response) {
    const { workspaceId, userId } = req.params;
    const { newRole } = req.body;

    if(someIsNullish(newRole)) {
      throw new APIError('Você precisa passar o novo role do membro.', 400);
    }

    const workspace = await this.workspacesRepository.findById(workspaceId);
    if(!workspace) {
      throw new APIError('Workspace não existe.', 404);
    }

    const user = workspace.members.find(member => member.userId === userId);
    if(!user) {
      throw new APIError('Esse usuário não está nessa workspace', 400);
    }

    if(user.role === 'owner') {
      throw new APIError('Você não pode atualizar o cargo de um usuário que é owner, você deve fazer a transferência de workspace antes disso.', 400);
    }

    if(newRole === 'owner') {
      throw new APIError('Você não pode editar o cargo de um usuário como owner, você deve fazer a transferência de workspace.', 400);
    }

    if(!['admin', 'worker'].includes(newRole)) {
      throw new APIError('O cargo pode ser somente admin ou worker.', 400);      
    }

    const workspaceUpdated = await this.workspacesRepository.editRoleMember(workspaceId, userId, newRole);

    return res.json(workspaceUpdated);
  }

  async removeMember(req: Request, res: Response) {
    const { workspaceId, userId } = req.params;

    const workspace = await this.workspacesRepository.findById(workspaceId);
    if(!workspace) {
      throw new APIError('Workspace não existe.', 404);
    }

    const user = workspace.members.find(member => member.userId === userId);
    if(user?.role === 'owner') {
      throw new APIError('Você não pode remover o owner da workspace.', 400);
    }

    await this.workspacesRepository.removeMember(workspaceId, userId);

    return res.sendStatus(204);
  }

  async transferOwnerRoleToMember(req: Request, res: Response) {
    const { workspaceId, userId } = req.params;

    const workspace = await this.workspacesRepository.findById(workspaceId);
    if(!workspace) {
      throw new APIError('Workspace não existe.', 404);
    }

    const user = workspace.members.find(member => member.userId === userId);
    if(!user) {
      throw new APIError('Esse usuário não está nessa workspace', 400);
    }

    if(user.role === 'owner') {
      throw new APIError('Esse usuário já é owner da workspace.', 400);
    }

    const oldOwner = workspace.members.find(member => member.role === 'owner');

    await this.workspacesRepository.editRoleMember(workspaceId, userId, 'owner');
    const workspaceUpdated = await this.workspacesRepository.editRoleMember(workspaceId, oldOwner!.userId, 'admin');

    return res.json(workspaceUpdated);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if(someIsNull(name)) {
      throw new APIError('Nome é obrigatório', 400);
    }

    const workspace = await this.workspacesRepository.update(id, { name });

    return res.json(workspace);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.workspacesRepository.delete(id);

    return res.sendStatus(204);
  }

}