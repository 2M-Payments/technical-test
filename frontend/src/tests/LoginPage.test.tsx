import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthContextValue } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { LoginPage } from '../pages/LoginPage';

vi.mock('../hooks/useAuth');

const mockAuth = (overrides: Partial<AuthContextValue> = {}) => {
  const value: AuthContextValue = {
    user: null,
    status: 'unauthenticated',
    sessionExpiresAt: null,
    sessionExpired: false,
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn(),
    ...overrides,
  };
  vi.mocked(useAuth).mockReturnValue(value);
  return value;
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users" element={<p>Lista de usuários</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe('<LoginPage />', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReset();
  });

  it('envia e-mail e senha para o contexto de autenticação', async () => {
    const auth = mockAuth();
    renderPage();

    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@crud.dev');
    await userEvent.type(screen.getByLabelText('Senha'), 'Admin@123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(auth.login).toHaveBeenCalledWith('admin@crud.dev', 'Admin@123');
  });

  it('exibe a mensagem de erro da API quando o login falha', async () => {
    mockAuth({
      login: vi.fn().mockRejectedValue({
        isAxiosError: true,
        response: { status: 401, data: { message: 'E-mail ou senha inválidos' } },
      }),
    });
    renderPage();

    await userEvent.type(screen.getByLabelText('E-mail'), 'admin@crud.dev');
    await userEvent.type(screen.getByLabelText('Senha'), 'errada');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument();
  });

  it('avisa quando a sessão expirou por inatividade', () => {
    mockAuth({ sessionExpired: true });
    renderPage();

    expect(screen.getByText(/sessão expirou por inatividade/i)).toBeInTheDocument();
  });

  it('redireciona usuário já autenticado para a listagem', () => {
    mockAuth({ status: 'authenticated', user: { id: '1', name: 'Admin', email: 'a@a.com' } });
    renderPage();

    expect(screen.getByText('Lista de usuários')).toBeInTheDocument();
  });
});
