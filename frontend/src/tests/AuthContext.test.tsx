import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth.service';

// Captura os listeners que o AuthProvider registra no cliente HTTP.
const apiListeners = vi.hoisted(() => ({ unauthorized: [] as Array<() => void> }));

vi.mock('../services/api', () => ({
  onUnauthorized: (listener: () => void) => {
    apiListeners.unauthorized.push(listener);
    return () => undefined;
  },
  onSessionRenewed: () => () => undefined,
}));

vi.mock('../services/auth.service', () => ({
  authService: { me: vi.fn(), login: vi.fn(), logout: vi.fn() },
}));

const session = { user: { id: '1', name: 'Admin', email: 'admin@crud.dev' }, expiresAt: null };

function AuthProbe() {
  const { status, user, sessionExpired, login, logout } = useAuth();
  return (
    <div>
      <p>status: {status}</p>
      <p>usuário: {user?.name ?? '-'}</p>
      <p>expirada: {String(sessionExpired)}</p>
      <button onClick={() => void login('admin@crud.dev', 'Admin@123')}>entrar</button>
      <button onClick={() => void logout()}>sair</button>
    </div>
  );
}

const renderProvider = () =>
  render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );

describe('<AuthProvider />', () => {
  beforeEach(() => {
    vi.mocked(authService.me).mockReset();
    vi.mocked(authService.login).mockReset();
    vi.mocked(authService.logout).mockReset().mockResolvedValue(undefined);
    apiListeners.unauthorized = [];
  });

  it('recupera a sessão existente ao carregar', async () => {
    vi.mocked(authService.me).mockResolvedValue(session);

    renderProvider();

    expect(await screen.findByText('status: authenticated')).toBeInTheDocument();
    expect(screen.getByText('usuário: Admin')).toBeInTheDocument();
  });

  it('fica deslogado quando não há sessão', async () => {
    vi.mocked(authService.me).mockRejectedValue(new Error('401'));

    renderProvider();

    expect(await screen.findByText('status: unauthenticated')).toBeInTheDocument();
    expect(screen.getByText('expirada: false')).toBeInTheDocument();
  });

  it('faz login com as credenciais informadas', async () => {
    vi.mocked(authService.me).mockRejectedValue(new Error('401'));
    vi.mocked(authService.login).mockResolvedValue(session);
    renderProvider();
    await screen.findByText('status: unauthenticated');

    await userEvent.click(screen.getByRole('button', { name: 'entrar' }));

    expect(authService.login).toHaveBeenCalledWith('admin@crud.dev', 'Admin@123');
    expect(await screen.findByText('usuário: Admin')).toBeInTheDocument();
  });

  it('marca a sessão como expirada quando a API responde 401', async () => {
    vi.mocked(authService.me).mockResolvedValue(session);
    renderProvider();
    await screen.findByText('status: authenticated');

    act(() => apiListeners.unauthorized.forEach((listener) => listener()));

    expect(screen.getByText('status: unauthenticated')).toBeInTheDocument();
    expect(screen.getByText('expirada: true')).toBeInTheDocument();
  });

  it('desloga sem marcar a sessão como expirada', async () => {
    vi.mocked(authService.me).mockResolvedValue(session);
    renderProvider();
    await screen.findByText('status: authenticated');

    await userEvent.click(screen.getByRole('button', { name: 'sair' }));

    expect(authService.logout).toHaveBeenCalled();
    expect(await screen.findByText('status: unauthenticated')).toBeInTheDocument();
    expect(screen.getByText('expirada: false')).toBeInTheDocument();
  });
});
