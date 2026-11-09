import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserForm, type UserFormValues } from '../components/users/UserForm';
import { Alert } from '../components/ui/Alert';
import { useRegions } from '../hooks/useRegions';
import { useUsers } from '../hooks/useUsers';
import { getErrorMessage, getFieldErrors } from '../services/api';
import { usersService } from '../services/users.service';

export function UserCreatePage() {
  const navigate = useNavigate();
  const { regions, error: regionsError } = useRegions();
  const { refresh } = useUsers();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const user = await usersService.create(values);
      refresh();
      navigate('/users', { state: { message: `Usuário ${user.name} criado com sucesso.` } });
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
          <h1>Novo usuário</h1>
          <p>Um usuário pode estar em mais de uma região.</p>
        </div>
      </header>
      {(error ?? regionsError) && <Alert>{error ?? regionsError}</Alert>}
      <UserForm
        mode="create"
        regions={regions}
        serverErrors={fieldErrors}
        submitting={submitting}
        onSubmit={(values) => void handleSubmit(values)}
        onCancel={() => navigate('/users')}
      />
    </div>
  );
}
