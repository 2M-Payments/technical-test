export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'PENDING'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente',
};

export interface Region {
  code: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  regions: Region[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  /** Busca um único usuário pelo ID (GET /users/:id); quando informado, os demais filtros são ignorados. */
  id?: string;
  search?: string;
  status?: UserStatus;
  regionCode?: string;
  /** Formato AAAA-MM-DD */
  createdFrom?: string;
  /** Formato AAAA-MM-DD */
  createdTo?: string;
}

export type UserSortField = 'name' | 'email' | 'status' | 'createdAt';
export type SortOrder = 'ASC' | 'DESC';

export interface ListUsersParams extends UserFilters {
  page: number;
  limit: number;
  sortBy: UserSortField;
  sortOrder: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  regionCodes: string[];
}

export type UpdateUserPayload = Partial<UserPayload>;
