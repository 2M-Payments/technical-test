import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { UserFilters } from '../components/users/UserFilters';
import type { UserFilters as Filters } from '../types/user';
import { regionsFixture } from './fixtures';

const EMPTY: Filters = {};
const USER_ID = '6f1c1a8e-0000-4000-8000-000000000001';

describe('<UserFilters />', () => {
  it('aplica apenas os filtros preenchidos', async () => {
    const onApply = vi.fn();
    render(<UserFilters value={EMPTY} regions={regionsFixture} onApply={onApply} />);

    await userEvent.type(screen.getByLabelText('Buscar'), 'maria');
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'INACTIVE');
    await userEvent.selectOptions(screen.getByLabelText('Região'), 'GB');
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(onApply).toHaveBeenCalledWith({ search: 'maria', status: 'INACTIVE', regionCode: 'GB' });
  });

  it('aplica filtro por período de criação', async () => {
    const onApply = vi.fn();
    render(<UserFilters value={EMPTY} regions={regionsFixture} onApply={onApply} />);

    fireEvent.change(screen.getByLabelText('Criado de'), { target: { value: '2026-10-01' } });
    fireEvent.change(screen.getByLabelText('Criado até'), { target: { value: '2026-10-26' } });
    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(onApply).toHaveBeenCalledWith({ createdFrom: '2026-10-01', createdTo: '2026-10-26' });
  });

  it('bloqueia período com data final anterior à inicial', async () => {
    render(<UserFilters value={EMPTY} regions={regionsFixture} onApply={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Criado de'), { target: { value: '2026-10-26' } });
    fireEvent.change(screen.getByLabelText('Criado até'), { target: { value: '2026-10-01' } });

    expect(screen.getByText('Data final anterior à inicial')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeDisabled();
  });

  it('busca por ID enviando apenas o ID e desabilitando os demais filtros', async () => {
    const onApply = vi.fn();
    render(<UserFilters value={EMPTY} regions={regionsFixture} onApply={onApply} />);

    await userEvent.type(screen.getByLabelText('Buscar'), 'maria');
    await userEvent.type(screen.getByLabelText('ID'), `  ${USER_ID} `);

    expect(screen.getByLabelText('Buscar')).toBeDisabled();
    expect(screen.getByLabelText('Status')).toBeDisabled();
    expect(screen.getByText(/os demais filtros são ignorados/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(onApply).toHaveBeenCalledWith({ id: USER_ID });
  });

  it('bloqueia ID fora do formato UUID', async () => {
    render(<UserFilters value={EMPTY} regions={regionsFixture} onApply={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('ID'), '123');

    expect(screen.getByText('ID inválido (formato UUID)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeDisabled();
  });

  it('limpa todos os filtros', async () => {
    const onApply = vi.fn();
    const active: Filters = { search: 'ana', status: 'ACTIVE' };
    render(<UserFilters value={active} regions={regionsFixture} onApply={onApply} />);

    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));

    expect(onApply).toHaveBeenCalledWith({});
    expect(screen.getByLabelText('Buscar')).toHaveValue('');
  });
});
