import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { UsersTable } from '../components/users/UsersTable';
import type { User } from '../types/user';
import { makeUser } from './fixtures';

const users: User[] = [
  makeUser({ id: 'u1', name: 'Ana' }),
  makeUser({ id: 'u2', name: 'Bruno', status: 'INACTIVE', regions: [{ code: 'US', name: 'Estados Unidos' }] }),
];

const renderTable = (props: Partial<Parameters<typeof UsersTable>[0]> = {}) => {
  const handlers = {
    onToggle: vi.fn(),
    onTogglePage: vi.fn(),
    onSort: vi.fn(),
    onDelete: vi.fn(),
  };
  render(
    <MemoryRouter>
      <UsersTable
        users={users}
        selectedIds={[]}
        sortBy="createdAt"
        sortOrder="DESC"
        {...handlers}
        {...props}
      />
    </MemoryRouter>,
  );
  return handlers;
};

describe('<UsersTable />', () => {
  it('lista os usuários com status e todas as regiões', () => {
    renderTable();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText('Brasil')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Reino Unido')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Inativo')).toBeInTheDocument();
  });

  it('mostra estado vazio quando não há usuários', () => {
    renderTable({ users: [] });

    expect(screen.getByText(/Nenhum usuário encontrado/)).toBeInTheDocument();
  });

  it('dispara seleção individual e da página', async () => {
    const { onToggle, onTogglePage } = renderTable();

    await userEvent.click(screen.getByLabelText('Selecionar Bruno'));
    await userEvent.click(screen.getByLabelText('Selecionar todos da página'));

    expect(onToggle).toHaveBeenCalledWith('u2');
    expect(onTogglePage).toHaveBeenCalled();
  });

  it('ordena ao clicar no cabeçalho', async () => {
    const { onSort } = renderTable();

    await userEvent.click(screen.getByRole('button', { name: 'Nome' }));

    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('solicita exclusão e impede o usuário de excluir a si mesmo', async () => {
    const { onDelete } = renderTable({ currentUserId: 'u1' });

    expect(screen.getByRole('button', { name: 'Excluir Ana' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Excluir Bruno' }));

    expect(onDelete).toHaveBeenCalledWith(users[1]);
  });
});
