import { useState, useEffect } from 'react';
import { Product, PaginationData, ProductFormData } from '../types/productTypes';
import { productService } from '../services/ProductService';
import { useAuth } from '../contexts/AuthContext';

export const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (page: number = 1, limit: number = 10) => {
    if (!user?.token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await productService.getProducts(page, limit, user.token);
      setProducts(data.data);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const createProduct = async (productData: ProductFormData) => {
  if (!user?.token) throw new Error('Token não encontrado');
  
  // Validações básicas
  if (!productData.name.trim()) {
    throw new Error('Nome é obrigatório');
  }
  
  if (productData.quantity < 0) {
    throw new Error('Quantidade não pode ser negativa');
  }
  
  if (productData.price <= 0) {
    throw new Error('Preço deve ser maior que zero');
  }
  
  setLoading(true);
  try {
    await productService.createProduct(productData, user.token);
    await fetchProducts(currentPage);
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
      await fetchProducts(currentPage);
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
      await fetchProducts(currentPage);
    } catch (err) {
      setError('Erro ao deletar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    currentPage,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
