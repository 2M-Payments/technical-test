import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="empty-state stack">
      <h1>Página não encontrada</h1>
      <Link to="/users">Ir para usuários</Link>
    </div>
  );
}
