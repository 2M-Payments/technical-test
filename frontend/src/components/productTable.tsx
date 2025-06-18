import React from 'react';
import { Product } from '../types/productTypes';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  loading
}) => {
  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      onDelete(id);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">Nenhum produto encontrado</div>;
  }

 return (
  <div className="products-table-container">
    <table className="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Quantidade</th>  {/* ✅ Corrigido */}
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.quantity}</td>  {/* ✅ Corrigido */}
            <td>R$ {product.price.toFixed(2)}</td>
            <td className="actions">
              <button 
                onClick={() => onEdit(product)}
                className="btn-edit"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="btn-delete"
              >
                Deletar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}
