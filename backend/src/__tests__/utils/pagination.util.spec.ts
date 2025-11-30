import { buildPaginatedResponse, buildPaginationMeta } from "@/utils/pagination.util";

describe("pagination.util", () => {
  it("deve calcular meta com totalPages zero quando não há registros", () => {
    const meta = buildPaginationMeta(0, { page: 1, limit: 10 });

    expect(meta).toEqual({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });

  it("deve arredondar totalPages para cima quando há registros", () => {
    const meta = buildPaginationMeta(25, { page: 2, limit: 10 });

    expect(meta.totalPages).toBe(3);
  });

  it("deve montar resposta paginada completa", () => {
    const response = buildPaginatedResponse([1, 2], 2, { page: 1, limit: 10 });

    expect(response).toEqual({
      data: [1, 2],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });
});


