import { createContext, useContext, useEffect, useState } from 'react';
import { Product, ProductService } from '../services/ProductService';

interface ProductContextType {
  products: Product[];
  fetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const data = await ProductService.getAll();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);