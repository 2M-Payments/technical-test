import { Link, useParams } from 'react-router-dom';

import { Alert } from '../components/ui/Alert';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useUser } from '../hooks/useUser';
import { formatDateTime } from '../utils/format';

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, error } = useUser(id);

  if (loading) return <p className="empty-state">Carregando…</p>;

  if (!user) {
    return (
      <div className="stack">
        <Alert>{error ?? 'Usuário não encontrado.'}</Alert>
        <Link to="/users">Voltar para a listagem</Link>
      </div>
    );
  }

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="row">
          <Link to="/users" className="btn btn--secondary">
            Voltar
          </Link>
          <Link to={`/users/${user.id}/edit`} className="btn btn--primary">
            Editar
          </Link>
        </div>
      </header>

      <section className="card">
        <dl className="details-list">
          <dt>ID</dt>
          <dd className="mono">{user.id}</dd>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={user.status} />
          </dd>
          <dt>Regiões</dt>
          <dd>
            {user.regions.map((region) => (
              <span key={region.code} className="region-tag">
                {region.name} ({region.code})
              </span>
            ))}
          </dd>
          <dt>Criado em</dt>
          <dd>{formatDateTime(user.createdAt)}</dd>
          <dt>Atualizado em</dt>
          <dd>{formatDateTime(user.updatedAt)}</dd>
        </dl>
      </section>
    </div>
  );
}
