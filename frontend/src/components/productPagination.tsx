import React from 'react';
import { PaginationData } from '../types/productTypes';

interface ProductPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  pagination,
  onPageChange
}) => {
  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPreviousPage}
        className="btn-pagination"
      >
        Anterior
      </button>
      
      <div className="pagination-info">
        <span>
          Página {pagination.currentPage} de {pagination.totalPages}
        </span>
        <span>
          ({pagination.totalItems} produtos no total)
        </span>
      </div>
      
      <button 
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="btn-pagination"
      >
        Próxima
      </button>
    </div>
  );
};
