import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductTable } from '../components/productTable';
import { ProductModal } from '../components/productModal';
import { ProductPagination } from '../components/productPagination';
import { SearchInput } from '../components/searchInput';
import { Product, ProductFormData } from '../types/productTypes';
import './productPage.css';

const ProductPage: React.FC = () => {
  const {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
  };

  
  const handleSubmit = async (formData: ProductFormData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  // ✅ Filtro corrigido - apenas por nome (campo que existe)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Gerenciamento de Produtos</h1>
        <div className="header-actions">
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome..."
          />
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Novo Produto
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {pagination && (
        <ProductPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        loading={loading}
      />
    </div>
  );
};

export default ProductPage;
