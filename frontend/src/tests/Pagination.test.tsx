import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from '../components/users/Pagination';

describe('<Pagination />', () => {
  it('mostra o intervalo exibido e o total', () => {
    render(
      <Pagination
        meta={{ page: 2, limit: 10, total: 25, totalPages: 3 }}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByText('11–20 de 25 usuários')).toBeInTheDocument();
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });

  it('navega entre páginas', async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        meta={{ page: 2, limit: 10, total: 25, totalPages: 3 }}
        onPageChange={onPageChange}
        onLimitChange={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Próxima' }));
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }));

    expect(onPageChange.mock.calls).toEqual([[3], [1]]);
  });

  it('desabilita os botões nos limites', () => {
    render(
      <Pagination
        meta={{ page: 1, limit: 10, total: 5, totalPages: 1 }}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
  });

  it('altera a quantidade por página', async () => {
    const onLimitChange = vi.fn();
    render(
      <Pagination
        meta={{ page: 1, limit: 10, total: 5, totalPages: 1 }}
        onPageChange={vi.fn()}
        onLimitChange={onLimitChange}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText('Por página'), '20');

    expect(onLimitChange).toHaveBeenCalledWith(20);
  });
});
