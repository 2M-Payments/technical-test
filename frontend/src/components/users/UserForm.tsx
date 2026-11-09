import { useState, type FormEvent } from 'react';

import {
  USER_STATUSES,
  USER_STATUS_LABELS,
  type Region,
  type UserPayload,
  type UserStatus,
} from '../../types/user';
import { Button } from '../ui/Button';
import { SelectField } from '../ui/SelectField';
import { TextField } from '../ui/TextField';
import { RegionSelector } from './RegionSelector';

export type UserFormValues = UserPayload;

interface UserFormProps {
  mode: 'create' | 'edit';
  regions: Region[];
  initialValues?: Partial<UserFormValues>;
  /** Erros vindos da API, indexados pelo nome do campo. */
  serverErrors?: Record<string, string>;
  submitting?: boolean;
  onSubmit(values: UserFormValues): void;
  onCancel(): void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validação no cliente para feedback imediato; a API valida novamente com Zod. */
export function validateUserForm(values: UserFormValues, mode: 'create' | 'edit') {
  const errors: Partial<Record<keyof UserFormValues, string>> = {};
  if (values.name.trim().length < 3) errors.name = 'Nome deve ter ao menos 3 caracteres';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'E-mail inválido';
  if ((mode === 'create' || values.password) && values.password.length < 8) {
    errors.password = 'Senha deve ter ao menos 8 caracteres';
  }
  if (values.regionCodes.length === 0) errors.regionCodes = 'Selecione ao menos uma região';
  return errors;
}

export function UserForm({
  mode,
  regions,
  initialValues,
  serverErrors = {},
  submitting = false,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    password: '',
    status: initialValues?.status ?? 'ACTIVE',
    regionCodes: initialValues?.regionCodes ?? [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormValues, string>>>({});

  const set = <K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const errorFor = (field: keyof UserFormValues) => errors[field] ?? serverErrors[field];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateUserForm(values, mode);
    setErrors(validation);
    if (Object.keys(validation).length === 0) onSubmit(values);
  };

  return (
    <form className="card stack" onSubmit={handleSubmit} noValidate>
      <div className="grid-2">
        <TextField
          label="Nome"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          error={errorFor('name')}
          autoComplete="name"
        />
        <TextField
          label="E-mail"
          type="email"
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          error={errorFor('email')}
          autoComplete="email"
        />
        <TextField
          label={mode === 'create' ? 'Senha' : 'Nova senha (opcional)'}
          type="password"
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          error={errorFor('password')}
          autoComplete="new-password"
        />
        <SelectField
          label="Status"
          value={values.status}
          onChange={(e) => set('status', e.target.value as UserStatus)}
          options={USER_STATUSES.map((s) => ({ value: s, label: USER_STATUS_LABELS[s] }))}
        />
      </div>

      <RegionSelector
        regions={regions}
        value={values.regionCodes}
        onChange={(codes) => set('regionCodes', codes)}
        error={errorFor('regionCodes')}
      />

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {mode === 'create' ? 'Criar usuário' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  );
}
