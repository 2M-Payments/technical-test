import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { useSessionCountdown } from '../../hooks/useSessionCountdown';
import { Button } from '../ui/Button';

export function AppLayout() {
  const { user, sessionExpiresAt, logout } = useAuth();
  const minutesLeft = useSessionCountdown(sessionExpiresAt);

  return (
    <>
      <header className="app-header">
        <Link to="/users" className="app-header__brand">
          crud<span>/</span>usuários
        </Link>
        <nav aria-label="Principal">
          <NavLink to="/users" end>
            Usuários
          </NavLink>
          <NavLink to="/users/new">Novo</NavLink>
          <NavLink to="/users/bulk">Criar em lote</NavLink>
        </nav>
        <div className="app-header__session">
          <span>{user?.name}</span>
          {minutesLeft !== null && (
            <span title="A sessão é renovada a cada ação e expira após 30 minutos de inatividade">
              Sessão: {minutesLeft} min
            </span>
          )}
          <Button variant="ghost" onClick={() => void logout()}>
            Sair
          </Button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
