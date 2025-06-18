import React, { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types/productTypes';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  editingProduct: Product | null;
  loading: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  loading
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    quantity: 0,
    price: 0
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        quantity: editingProduct.quantity,
        price: editingProduct.price
      });
    } else {
      setFormData({
        name: '',
        quantity: 0,
        price: 0
      });
    }
  }, [editingProduct]);

  // ✅ Função handleSubmit que estava faltando
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    if (formData.quantity < 0) {
      alert('Quantidade não pode ser negativa');
      return;
    }
    
    if (formData.price <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantidade:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço:</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
