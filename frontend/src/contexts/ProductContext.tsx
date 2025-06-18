import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, ProductFormData, ProductsResponse, PaginationData } from '../types/productTypes';
import { productService } from '../services/ProductService';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string;
  pagination: PaginationData | null;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  createProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (id: number, productData: ProductFormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchProducts = async (page: number = 1, limit: number = 10) => {
    if (!user?.token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response: ProductsResponse = await productService.getProducts(page, limit, user.token);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: ProductFormData) => {
    if (!user?.token) throw new Error('Token não encontrado');
    
    setLoading(true);
    try {
      await productService.createProduct(productData, user.token);
      await fetchProducts();
    } catch (err) {
      setError('Erro ao criar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: ProductFormData) => {
    if (!user?.token) throw new Error('Token não encontrado');
    
    setLoading(true);
    try {
      await productService.updateProduct(id, productData, user.token);
      await fetchProducts();
    } catch (err) {
      setError('Erro ao atualizar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!user?.token) throw new Error('Token não encontrado');
    
    setLoading(true);
    try {
      await productService.deleteProduct(id, user.token);
      await fetchProducts();
    } catch (err) {
      setError('Erro ao deletar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [user]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error, 
      pagination,
      fetchProducts, 
      createProduct, 
      updateProduct, 
      deleteProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
