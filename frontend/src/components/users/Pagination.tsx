import { useId } from 'react';

import type { PaginationMeta } from '../../types/user';
import { Button } from '../ui/Button';

const PAGE_SIZES = [5, 10, 20, 50];

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange(page: number): void;
  onLimitChange(limit: number): void;
}

export function Pagination({ meta, onPageChange, onLimitChange }: PaginationProps) {
  const limitId = useId();
  const { page, limit, total, totalPages } = meta;
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <nav className="pagination" aria-label="Paginação">
      <span>
        {first}–{last} de {total} usuário{total === 1 ? '' : 's'}
      </span>

      <div>
        <label htmlFor={limitId}>Por página</label>
        <select
          id={limitId}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <span aria-live="polite">
          Página {totalPages === 0 ? 0 : page} de {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </nav>
  );
}
