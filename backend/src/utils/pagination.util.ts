export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta extends PaginationParams {
  total: number;
  totalPages: number;
}

export function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.limit);

  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
  };
}

export function buildPaginatedResponse<T>(data: T[], total: number, params: PaginationParams) {
  return {
    data,
    meta: buildPaginationMeta(total, params),
  };
}

