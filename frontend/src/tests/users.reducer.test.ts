import { describe, expect, it } from 'vitest';

import {
  initialUsersState,
  selectFilters,
  usersReducer,
  type UsersState,
} from '../contexts/users.reducer';
import { makeUser } from './fixtures';

const withUsers = (): UsersState => ({
  ...initialUsersState,
  users: [makeUser({ id: 'a' }), makeUser({ id: 'b' })],
  meta: { page: 2, limit: 10, total: 12, totalPages: 2 },
  params: { ...initialUsersState.params, page: 2 },
  selectedIds: ['a'],
});

describe('usersReducer', () => {
  it('aplica filtros voltando para a primeira página e limpando a seleção', () => {
    const state = usersReducer(withUsers(), {
      type: 'SET_FILTERS',
      filters: { status: 'INACTIVE', regionCode: 'GB' },
    });

    expect(state.params).toMatchObject({ page: 1, status: 'INACTIVE', regionCode: 'GB' });
    expect(state.selectedIds).toEqual([]);
  });

  it('substitui os filtros anteriores em vez de mesclar', () => {
    const filtered = usersReducer(initialUsersState, {
      type: 'SET_FILTERS',
      filters: { search: 'ana' },
    });
    const state = usersReducer(filtered, { type: 'SET_FILTERS', filters: { status: 'ACTIVE' } });

    expect(selectFilters(state)).toEqual({
      search: undefined,
      status: 'ACTIVE',
      regionCode: undefined,
      createdFrom: undefined,
      createdTo: undefined,
    });
  });

  it('alterna a ordenação ao clicar duas vezes na mesma coluna', () => {
    const asc = usersReducer(initialUsersState, { type: 'SET_SORT', sortBy: 'name' });
    const desc = usersReducer(asc, { type: 'SET_SORT', sortBy: 'name' });

    expect(asc.params).toMatchObject({ sortBy: 'name', sortOrder: 'ASC', page: 1 });
    expect(desc.params.sortOrder).toBe('DESC');
  });

  it('altera o tamanho da página voltando para a página 1', () => {
    const state = usersReducer(withUsers(), { type: 'SET_LIMIT', limit: 50 });

    expect(state.params).toMatchObject({ limit: 50, page: 1 });
  });

  it('seleciona e desmarca itens individualmente', () => {
    const selected = usersReducer(withUsers(), { type: 'TOGGLE_SELECTION', id: 'b' });
    const unselected = usersReducer(selected, { type: 'TOGGLE_SELECTION', id: 'a' });

    expect(selected.selectedIds).toEqual(['a', 'b']);
    expect(unselected.selectedIds).toEqual(['b']);
  });

  it('seleciona toda a página e desmarca quando todos já estão selecionados', () => {
    const all = usersReducer(withUsers(), { type: 'TOGGLE_PAGE_SELECTION' });
    const none = usersReducer(all, { type: 'TOGGLE_PAGE_SELECTION' });

    expect(all.selectedIds).toEqual(['a', 'b']);
    expect(none.selectedIds).toEqual([]);
  });

  it('controla os estados de carregamento e erro', () => {
    const loading = usersReducer(initialUsersState, { type: 'FETCH_START' });
    const failed = usersReducer(loading, { type: 'FETCH_ERROR', error: 'Falhou' });

    expect(loading.loading).toBe(true);
    expect(failed).toMatchObject({ loading: false, error: 'Falhou' });
  });
});
