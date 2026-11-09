import { Link } from 'react-router-dom';

import type { SortOrder, User, UserSortField } from '../../types/user';
import { formatDateTime } from '../../utils/format';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

interface UsersTableProps {
  users: User[];
  selectedIds: string[];
  sortBy: UserSortField;
  sortOrder: SortOrder;
  currentUserId?: string;
  onToggle(id: string): void;
  onTogglePage(): void;
  onSort(field: UserSortField): void;
  onDelete(user: User): void;
}

const COLUMNS: Array<{ field: UserSortField; label: string }> = [
  { field: 'name', label: 'Nome' },
  { field: 'email', label: 'E-mail' },
  { field: 'status', label: 'Status' },
];

export function UsersTable({
  users,
  selectedIds,
  sortBy,
  sortOrder,
  currentUserId,
  onToggle,
  onTogglePage,
  onSort,
  onDelete,
}: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="table-wrapper">
        <p className="empty-state">Nenhum usuário encontrado com os filtros atuais.</p>
      </div>
    );
  }

  const allSelected = users.every((user) => selectedIds.includes(user.id));

  const sortIndicator = (field: UserSortField) =>
    sortBy === field ? (sortOrder === 'ASC' ? ' ↑' : ' ↓') : '';

  const ariaSort = (field: UserSortField) =>
    sortBy === field ? (sortOrder === 'ASC' ? 'ascending' : 'descending') : undefined;

  const sortableHeader = (field: UserSortField, label: string) => (
    <th key={field} aria-sort={ariaSort(field)}>
      <button type="button" className="th-sort" onClick={() => onSort(field)}>
        {label}
        {sortIndicator(field)}
      </button>
    </th>
  );

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                aria-label="Selecionar todos da página"
                checked={allSelected}
                onChange={onTogglePage}
              />
            </th>
            {COLUMNS.map(({ field, label }) => sortableHeader(field, label))}
            <th>Regiões</th>
            {sortableHeader('createdAt', 'Criado em')}
            <th>
              <span className="visually-hidden">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const selected = selectedIds.includes(user.id);
            return (
              <tr key={user.id} className={selected ? 'is-selected' : undefined}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ${user.name}`}
                    checked={selected}
                    onChange={() => onToggle(user.id)}
                  />
                </td>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.email}</td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>
                  {user.regions.map((region) => (
                    <span key={region.code} className="region-tag" title={region.code}>
                      {region.name}
                    </span>
                  ))}
                </td>
                <td>{formatDateTime(user.createdAt)}</td>
                <td>
                  <div className="cell-actions">
                    <Link className="btn btn--ghost" to={`/users/${user.id}/edit`}>
                      Editar
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(user)}
                      disabled={user.id === currentUserId}
                      title={user.id === currentUserId ? 'Você não pode excluir a si mesmo' : undefined}
                      aria-label={`Excluir ${user.name}`}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
