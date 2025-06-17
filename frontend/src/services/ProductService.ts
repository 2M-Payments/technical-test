
export interface Product {
  id: string;
  name: string;
  price: number;
}

// Opção 1: Exportando como objeto
export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch('/api/products');
    return response.json();
  },
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return response.json();
  }
};

