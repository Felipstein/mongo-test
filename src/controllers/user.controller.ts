import { Request, Response } from "express";
import { UsersRepository } from '../repositories/users/users.repository';
import { someIsNull, someIsNullish } from '../utils/validations';
import { APIError } from "../errors/APIError";

export class UserController {

  constructor(
    private usersRepository: UsersRepository,
  ) { }

  async index(req: Request, res: Response) {
    const users = await this.usersRepository.findAll();

    return res.json(users);
  }
  
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this.usersRepository.findById(id);

    return res.json(user);
  }

  async create(req: Request, res: Response) {
    const { name } = req.body;

    if(someIsNullish(name)) {
      throw new APIError('Nome é obrigatório', 400);
    }

    const userCreated = await this.usersRepository.create({ name });

    return res.status(201).json(userCreated);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if(someIsNull(name)) {
      throw new APIError('Nome é obrigatório', 400);
    }

    const userUpdated = await this.usersRepository.update(id, { name });

    return res.json(userUpdated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.usersRepository.delete(id);

    return res.sendStatus(204);
  }

}