import { api } from "@/services/api";

export type Product = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type ProductInput = {
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
};

type ListProductsParams = {
  page?: number;
  limit?: number;
};

type ListProductsResponse = {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<ListProductsResponse, ListProductsParams | void>({
      query: (params) => ({
        url: "/products",
        params: params || {},
      }),
      providesTags: ["Product"],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<Product, ProductInput>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: Partial<ProductInput> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }, "Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    deleteManyProducts: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/products",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Product"],
    }),

    deleteAllProducts: builder.mutation<void, void>({
      query: () => ({
        url: "/products/all",
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteManyProductsMutation,
  useDeleteAllProductsMutation,
} = productsApi;

