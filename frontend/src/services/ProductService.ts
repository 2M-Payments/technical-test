import { Product, ProductsResponse, ProductFormData } from '../types/productTypes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:';

export class ProductService {
  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getProducts(page: number = 1, limit: number = 10, token: string): Promise<ProductsResponse> {
    const response = await fetch(
      `${API_URL}/products?page=${page}&limit=${limit}`,
      {
        headers: this.getAuthHeaders(token)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro ao buscar produtos:', errorData);
      throw new Error('Erro ao buscar produtos');
    }

    return response.json();
  }

  async createProduct(productData: ProductFormData, token: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        name: productData.name,
        quantity: Number(productData.quantity),
        price: Number(productData.price)
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API:', errorData);
      throw new Error('Erro ao criar produto');
    }

    return response.json();
  }

  async updateProduct(id: number, productData: ProductFormData, token: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH', // ✅ 
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({
        name: productData.name,
        quantity: Number(productData.quantity),
        price: Number(productData.price)
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API:', errorData);
      throw new Error('Erro ao atualizar produto');
    }

    return response.json();
  }

  async deleteProduct(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API:', errorData);
      throw new Error('Erro ao deletar produto');
    }
  }
}

export const productService = new ProductService();
