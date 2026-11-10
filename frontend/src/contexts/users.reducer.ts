import type {
  ListUsersParams,
  PaginationMeta,
  SortOrder,
  User,
  UserFilters,
  UserSortField,
} from '../types/user';

export interface UsersState {
  params: ListUsersParams;
  users: User[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  selectedIds: string[];
}

export type UsersAction =
  | { type: 'SET_FILTERS'; filters: UserFilters }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'SET_LIMIT'; limit: number }
  | { type: 'SET_SORT'; sortBy: UserSortField }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; users: User[]; meta: PaginationMeta }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'TOGGLE_SELECTION'; id: string }
  | { type: 'TOGGLE_PAGE_SELECTION' }
  | { type: 'CLEAR_SELECTION' };

export const initialUsersState: UsersState = {
  params: { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' },
  users: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  loading: false,
  error: null,
  selectedIds: [],
};

const toggle = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];

const nextSortOrder = (state: UsersState, sortBy: UserSortField): SortOrder =>
  state.params.sortBy === sortBy && state.params.sortOrder === 'ASC' ? 'DESC' : 'ASC';

/**
 * Reducer puro da listagem. Mudanças de filtro, página ou ordenação
 * limpam a seleção, evitando excluir itens que não estão mais visíveis.
 */
export function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case 'SET_FILTERS': {
      const { limit, sortBy, sortOrder } = state.params;
      return {
        ...state,
        params: { ...action.filters, page: 1, limit, sortBy, sortOrder },
        selectedIds: [],
      };
    }
    case 'SET_PAGE':
      return { ...state, params: { ...state.params, page: action.page }, selectedIds: [] };
    case 'SET_LIMIT':
      return {
        ...state,
        params: { ...state.params, limit: action.limit, page: 1 },
        selectedIds: [],
      };
    case 'SET_SORT':
      return {
        ...state,
        params: {
          ...state.params,
          sortBy: action.sortBy,
          sortOrder: nextSortOrder(state, action.sortBy),
          page: 1,
        },
        selectedIds: [],
      };
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.users, meta: action.meta };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'TOGGLE_SELECTION':
      return { ...state, selectedIds: toggle(state.selectedIds, action.id) };
    case 'TOGGLE_PAGE_SELECTION': {
      const pageIds = state.users.map((user) => user.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => state.selectedIds.includes(id));
      return { ...state, selectedIds: allSelected ? [] : pageIds };
    }
    case 'CLEAR_SELECTION':
      return { ...state, selectedIds: [] };
    default:
      return state;
  }
}

export function selectFilters({ params }: UsersState): UserFilters {
  const { id, search, status, regionCode, createdFrom, createdTo } = params;
  return { id, search, status, regionCode, createdFrom, createdTo };
}
