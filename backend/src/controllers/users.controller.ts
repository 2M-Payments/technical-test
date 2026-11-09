import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { getAuthenticatedUser } from '../utils/get-authenticated-user';
import {
  bulkCreateUsersSchema,
  bulkDeleteUsersSchema,
  createUserSchema,
  deleteAllUsersQuerySchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamSchema,
} from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

/**
 * Controllers são finos: validam a entrada com Zod, delegam ao service e
 * formatam a resposta HTTP. Erros de validação sobem para o errorHandler.
 */
@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly usersService: UsersService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const input = createUserSchema.parse(req.body);
    res.status(201).json(await this.usersService.create(input));
  };

  createMany = async (req: Request, res: Response): Promise<void> => {
    const input = bulkCreateUsersSchema.parse(req.body);
    const users = await this.usersService.createMany(input);
    res.status(201).json({ created: users.length, data: users });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = listUsersQuerySchema.parse(req.query);
    res.json(await this.usersService.list(query));
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    const { id } = userIdParamSchema.parse(req.params);
    res.json(await this.usersService.findById(id));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = userIdParamSchema.parse(req.params);
    const input = updateUserSchema.parse(req.body);
    res.json(await this.usersService.update(id, input));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = userIdParamSchema.parse(req.params);
    await this.usersService.delete(id, getAuthenticatedUser(req).id);
    res.status(204).send();
  };

  deleteMany = async (req: Request, res: Response): Promise<void> => {
    const { ids } = bulkDeleteUsersSchema.parse(req.body);
    res.json(await this.usersService.deleteMany(ids, getAuthenticatedUser(req).id));
  };

  deleteAll = async (req: Request, res: Response): Promise<void> => {
    deleteAllUsersQuerySchema.parse(req.query);
    const currentUser = getAuthenticatedUser(req);
    res.json(await this.usersService.deleteAll(currentUser.id));
  };
}
