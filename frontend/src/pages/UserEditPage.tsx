import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { UserForm, type UserFormValues } from '../components/users/UserForm';
import { Alert } from '../components/ui/Alert';
import { useRegions } from '../hooks/useRegions';
import { useUser } from '../hooks/useUser';
import { useUsers } from '../hooks/useUsers';
import { getErrorMessage, getFieldErrors } from '../services/api';
import { usersService } from '../services/users.service';
import { buildUpdatePayload } from '../utils/user-payload';

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error: loadError } = useUser(id);
  const { regions } = useRegions();
  const { refresh } = useUsers();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (loading) return <p className="empty-state">Carregando…</p>;
  if (!user) {
    return (
      <div className="stack">
        <Alert>{loadError ?? 'Usuário não encontrado.'}</Alert>
        <Link to="/users">Voltar para a listagem</Link>
      </div>
    );
  }

  const handleSubmit = async (values: UserFormValues) => {
    const payload = buildUpdatePayload(user, values);
    if (Object.keys(payload).length === 0) {
      navigate(`/users/${user.id}`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updated = await usersService.update(user.id, payload);
      refresh();
      navigate('/users', { state: { message: `Usuário ${updated.name} atualizado.` } });
    } catch (err) {
      setError(getErrorMessage(err));
      setFieldErrors(getFieldErrors(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1>Editar usuário</h1>
          <p className="mono">{user.id}</p>
        </div>
      </header>
      {error && <Alert>{error}</Alert>}
      <UserForm
        mode="edit"
        regions={regions}
        initialValues={{
          name: user.name,
          email: user.email,
          status: user.status,
          regionCodes: user.regions.map((r) => r.code),
        }}
        serverErrors={fieldErrors}
        submitting={submitting}
        onSubmit={(values) => void handleSubmit(values)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
