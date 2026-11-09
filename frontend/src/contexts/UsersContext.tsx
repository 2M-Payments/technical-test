import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

import { getErrorMessage } from '../services/api';
import { usersService } from '../services/users.service';
import type { UserFilters, UserSortField } from '../types/user';
import { initialUsersState, usersReducer, type UsersState } from './users.reducer';

export interface UsersContextValue {
  state: UsersState;
  setFilters(filters: UserFilters): void;
  setPage(page: number): void;
  setLimit(limit: number): void;
  setSort(sortBy: UserSortField): void;
  toggleSelection(id: string): void;
  togglePageSelection(): void;
  refresh(): void;
  deleteOne(id: string): Promise<void>;
  deleteSelected(): Promise<number>;
  deleteAll(): Promise<number>;
}

export const UsersContext = createContext<UsersContextValue | null>(null);

/**
 * Estado da listagem de usuários (filtros, paginação, seleção) compartilhado
 * entre páginas: ao voltar da edição, os filtros aplicados continuam lá.
 */
export function UsersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(usersReducer, initialUsersState);
  const [reloadKey, setReloadKey] = useState(0);
  const { params } = state;

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    usersService
      .search(params)
      .then(({ data, meta }) => {
        if (cancelled) return;
        // Se a página atual ficou vazia (ex.: após excluir), volta para a última existente.
        if (data.length === 0 && meta.page > 1 && meta.totalPages > 0) {
          dispatch({ type: 'SET_PAGE', page: meta.totalPages });
          return;
        }
        dispatch({ type: 'FETCH_SUCCESS', users: data, meta });
      })
      .catch((error: unknown) => {
        if (!cancelled) dispatch({ type: 'FETCH_ERROR', error: getErrorMessage(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [params, reloadKey]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  const deleteOne = useCallback(
    async (id: string) => {
      await usersService.remove(id);
      refresh();
    },
    [refresh],
  );

  const deleteSelected = useCallback(async () => {
    const { deleted } = await usersService.removeMany(state.selectedIds);
    dispatch({ type: 'CLEAR_SELECTION' });
    refresh();
    return deleted;
  }, [state.selectedIds, refresh]);

  const deleteAll = useCallback(async () => {
    const { deleted } = await usersService.removeAll();
    dispatch({ type: 'CLEAR_SELECTION' });
    refresh();
    return deleted;
  }, [refresh]);

  const value = useMemo<UsersContextValue>(
    () => ({
      state,
      setFilters: (filters) => dispatch({ type: 'SET_FILTERS', filters }),
      setPage: (page) => dispatch({ type: 'SET_PAGE', page }),
      setLimit: (limit) => dispatch({ type: 'SET_LIMIT', limit }),
      setSort: (sortBy) => dispatch({ type: 'SET_SORT', sortBy }),
      toggleSelection: (id) => dispatch({ type: 'TOGGLE_SELECTION', id }),
      togglePageSelection: () => dispatch({ type: 'TOGGLE_PAGE_SELECTION' }),
      refresh,
      deleteOne,
      deleteSelected,
      deleteAll,
    }),
    [state, refresh, deleteOne, deleteSelected, deleteAll],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
