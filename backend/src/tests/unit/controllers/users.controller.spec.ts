import type { Request, Response } from 'express';
import { ZodError } from 'zod';

import { UsersController } from '../../../controllers/users.controller';
import type { UsersService } from '../../../services/users.service';

const makeResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const USER_ID = '6f1c1a8e-0000-4000-8000-000000000000';

describe('UsersController', () => {
  let service: jest.Mocked<UsersService>;
  let controller: UsersController;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      createMany: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      deleteAll: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    controller = new UsersController(service);
  });

  it('valida o corpo antes de chamar o service', async () => {
    const req = { body: { name: 'A' } } as Request;

    await expect(controller.create(req, makeResponse())).rejects.toBeInstanceOf(ZodError);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('responde 201 ao criar um usuário', async () => {
    const res = makeResponse();
    const body = { name: 'Maria', email: 'maria@email.com', password: '12345678', regionCodes: ['BR'] };
    service.create.mockResolvedValue({ id: USER_ID } as never);

    await controller.create({ body } as Request, res);

    expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ status: 'ACTIVE' }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: USER_ID });
  });

  it('responde 204 ao excluir um usuário', async () => {
    const res = makeResponse();

    const req = { params: { id: USER_ID }, user: { id: 'outro-usuario' } } as unknown as Request;

    await controller.delete(req, res);

    expect(service.delete).toHaveBeenCalledWith(USER_ID, 'outro-usuario');
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('exclui todos preservando o usuário logado apenas com confirm=true', async () => {
    const res = makeResponse();
    service.deleteAll.mockResolvedValue({ deleted: 3 });
    const req = { query: { confirm: 'true' }, user: { id: USER_ID } } as unknown as Request;

    await controller.deleteAll(req, res);

    expect(service.deleteAll).toHaveBeenCalledWith(USER_ID);
    expect(res.json).toHaveBeenCalledWith({ deleted: 3 });
  });

  it('recusa excluir todos sem confirmação', async () => {
    const req = { query: {}, user: { id: USER_ID } } as unknown as Request;

    await expect(controller.deleteAll(req, makeResponse())).rejects.toBeInstanceOf(ZodError);
    expect(service.deleteAll).not.toHaveBeenCalled();
  });
});
