import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { RegionSelector } from '../components/users/RegionSelector';
import { validateUserForm } from '../components/users/UserForm';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { SelectField } from '../components/ui/SelectField';
import { TextField } from '../components/ui/TextField';
import { useRegions } from '../hooks/useRegions';
import { useUsers } from '../hooks/useUsers';
import { getErrorMessage, getFieldErrors } from '../services/api';
import { usersService } from '../services/users.service';
import { USER_STATUSES, USER_STATUS_LABELS, type UserPayload, type UserStatus } from '../types/user';

const MAX_ROWS = 100;

interface BulkRow extends UserPayload {
  key: number;
}

let nextKey = 0;
const emptyRow = (): BulkRow => ({
  key: nextKey++,
  name: '',
  email: '',
  password: '',
  status: 'ACTIVE',
  regionCodes: [],
});

export function UsersBulkCreatePage() {
  const navigate = useNavigate();
  const { regions } = useRegions();
  const { refresh } = useUsers();
  const [rows, setRows] = useState<BulkRow[]>(() => [emptyRow(), emptyRow()]);
  // Erros por caminho: "users.0.email", no mesmo formato devolvido pela API.
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateRow = <K extends keyof UserPayload>(index: number, key: K, value: UserPayload[K]) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    setErrors((current) => {
      const { [`users.${index}.${key}`]: _removed, ...rest } = current;
      return rest;
    });
  };

  const removeRow = (index: number) => {
    setRows((current) => current.filter((_, i) => i !== index));
    setErrors({});
  };

  const validate = (): Record<string, string> => {
    const found: Record<string, string> = {};
    const seenEmails = new Map<string, number>();
    rows.forEach((row, index) => {
      Object.entries(validateUserForm(row, 'create')).forEach(([field, message]) => {
        if (message) found[`users.${index}.${field}`] = message;
      });
      const email = row.email.trim().toLowerCase();
      if (email && seenEmails.has(email)) found[`users.${index}.email`] = 'E-mail duplicado no lote';
      seenEmails.set(email, index);
    });
    return found;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setError('Corrija os campos destacados antes de enviar.');
      return;
    }

    setSubmitting(true);
    try {
      const { created } = await usersService.createMany(rows.map(({ key: _key, ...user }) => user));
      refresh();
      navigate('/users', { state: { message: `${created} usuário(s) criado(s) em lote.` } });
    } catch (err) {
      setError(getErrorMessage(err));
      setErrors(getFieldErrors(err));
      setSubmitting(false);
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <header className="page-header">
        <div>
          <h1>Criar usuários em lote</h1>
          <p>Todos são criados em uma única transação: se um falhar, nenhum é salvo.</p>
        </div>
        <div className="row">
          <Button
            variant="secondary"
            onClick={() => setRows((current) => [...current, emptyRow()])}
            disabled={rows.length >= MAX_ROWS}
          >
            Adicionar linha
          </Button>
          <Button type="submit" loading={submitting} disabled={rows.length === 0}>
            Criar {rows.length} usuário(s)
          </Button>
        </div>
      </header>

      {error && <Alert>{error}</Alert>}

      <div className="card">
        {rows.map((row, index) => {
          const err = (field: keyof UserPayload) => errors[`users.${index}.${field}`];
          return (
            <div key={row.key} className="bulk-row" aria-label={`Usuário ${index + 1}`} role="group">
              <TextField
                label={`Nome #${index + 1}`}
                value={row.name}
                onChange={(e) => updateRow(index, 'name', e.target.value)}
                error={err('name')}
              />
              <TextField
                label="E-mail"
                type="email"
                value={row.email}
                onChange={(e) => updateRow(index, 'email', e.target.value)}
                error={err('email')}
              />
              <TextField
                label="Senha"
                type="password"
                value={row.password}
                onChange={(e) => updateRow(index, 'password', e.target.value)}
                error={err('password')}
                autoComplete="new-password"
              />
              <SelectField
                label="Status"
                value={row.status}
                onChange={(e) => updateRow(index, 'status', e.target.value as UserStatus)}
                options={USER_STATUSES.map((s) => ({ value: s, label: USER_STATUS_LABELS[s] }))}
              />
              <div className="field">
                <span aria-hidden="true">&nbsp;</span>
                <Button
                  variant="ghost"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                  aria-label={`Remover usuário ${index + 1}`}
                >
                  Remover
                </Button>
              </div>
              <div className="bulk-row__regions">
                <RegionSelector
                  regions={regions}
                  value={row.regionCodes}
                  onChange={(codes) => updateRow(index, 'regionCodes', codes)}
                  error={err('regionCodes')}
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
