import { afterEach, describe, expect, it, vi } from 'vitest';

import { usersService } from '../services/users.service';
import type { ListUsersParams } from '../types/user';
import { makeUser } from './fixtures';

const baseParams: ListUsersParams = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' };

describe('usersService.search', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('usa a listagem paginada quando não há filtro de ID', async () => {
    const response = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    const list = vi.spyOn(usersService, 'list').mockResolvedValue(response);

    await expect(usersService.search({ ...baseParams, status: 'ACTIVE' })).resolves.toBe(response);
    expect(list).toHaveBeenCalledWith({ ...baseParams, status: 'ACTIVE' });
  });

  it('com ID, lista apenas o usuário encontrado (GET /users/:id)', async () => {
    const user = makeUser();
    const getById = vi.spyOn(usersService, 'getById').mockResolvedValue(user);
    const list = vi.spyOn(usersService, 'list');

    const result = await usersService.search({ ...baseParams, id: user.id });

    expect(getById).toHaveBeenCalledWith(user.id);
    expect(list).not.toHaveBeenCalled();
    expect(result).toEqual({ data: [user], meta: { page: 1, limit: 10, total: 1, totalPages: 1 } });
  });

  it('com ID inexistente (404), retorna lista vazia', async () => {
    vi.spyOn(usersService, 'getById').mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { message: 'Usuário não encontrado' } },
    });

    const result = await usersService.search({ ...baseParams, id: 'inexistente' });

    expect(result).toEqual({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
  });

  it('propaga outros erros da API', async () => {
    const error = { isAxiosError: true, response: { status: 500, data: {} } };
    vi.spyOn(usersService, 'getById').mockRejectedValue(error);

    await expect(usersService.search({ ...baseParams, id: 'x' })).rejects.toBe(error);
  });
});
