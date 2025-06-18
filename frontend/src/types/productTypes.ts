export interface Product {
  id: number;
  name: string;
  quantity: number;     
  price: number;
  
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationData;
}

export interface ProductFormData {
  name: string;
  quantity: number;     
  price: number;
 
}