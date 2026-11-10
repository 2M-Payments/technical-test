import { useEffect, useState, type FormEvent } from 'react';

import {
  USER_STATUSES,
  USER_STATUS_LABELS,
  type Region,
  type UserFilters as Filters,
  type UserStatus,
} from '../../types/user';
import { Button } from '../ui/Button';
import { SelectField } from '../ui/SelectField';
import { TextField } from '../ui/TextField';

interface UserFiltersProps {
  value: Filters;
  regions: Region[];
  onApply(filters: Filters): void;
}

const EMPTY_FILTERS: Filters = {};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Normaliza o formulário: remove espaços e campos vazios. A busca por ID é
 * exclusiva, então quando há ID os demais filtros não são enviados.
 */
export function cleanFilters(filters: Filters): Filters {
  const cleaned = Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
      .filter(([, value]) => typeof value === 'string' && value !== ''),
  ) as Filters;

  return cleaned.id ? { id: cleaned.id } : cleaned;
}

export function UserFilters({ value, regions, onApply }: UserFiltersProps) {
  const [draft, setDraft] = useState<Filters>(value);

  // Mantém o formulário sincronizado se os filtros mudarem por fora.
  useEffect(() => setDraft(value), [value]);

  const update = <K extends keyof Filters>(key: K, fieldValue: Filters[K]) =>
    setDraft((current) => ({ ...current, [key]: fieldValue }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onApply(cleanFilters(draft));
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onApply(EMPTY_FILTERS);
  };

  const id = draft.id?.trim() ?? '';
  const searchingById = id !== '';
  const invalidId = searchingById && !UUID_PATTERN.test(id);
  const invalidPeriod = Boolean(
    draft.createdFrom && draft.createdTo && draft.createdFrom > draft.createdTo,
  );

  return (
    <form className="card filters" onSubmit={handleSubmit} aria-label="Filtros de usuários">
      <TextField
        label="ID"
        className="filters__wide mono"
        placeholder="00000000-0000-0000-0000-000000000000"
        value={draft.id ?? ''}
        onChange={(e) => update('id', e.target.value)}
        error={invalidId ? 'ID inválido (formato UUID)' : undefined}
      />
      <TextField
        label="Buscar"
        className="filters__wide"
        placeholder="Nome ou e-mail"
        value={draft.search ?? ''}
        onChange={(e) => update('search', e.target.value)}
        disabled={searchingById}
      />
      <SelectField
        label="Status"
        placeholder="Todos"
        value={draft.status ?? ''}
        onChange={(e) => update('status', (e.target.value || undefined) as UserStatus | undefined)}
        options={USER_STATUSES.map((status) => ({ value: status, label: USER_STATUS_LABELS[status] }))}
        disabled={searchingById}
      />
      <SelectField
        label="Região"
        placeholder="Todas"
        value={draft.regionCode ?? ''}
        onChange={(e) => update('regionCode', e.target.value || undefined)}
        options={regions.map((r) => ({ value: r.code, label: r.name }))}
        disabled={searchingById}
      />
      <TextField
        label="Criado de"
        type="date"
        value={draft.createdFrom ?? ''}
        onChange={(e) => update('createdFrom', e.target.value)}
        disabled={searchingById}
      />
      <TextField
        label="Criado até"
        type="date"
        value={draft.createdTo ?? ''}
        onChange={(e) => update('createdTo', e.target.value)}
        error={invalidPeriod && !searchingById ? 'Data final anterior à inicial' : undefined}
        disabled={searchingById}
      />
      <div className="row filters__actions">
        <Button type="submit" disabled={invalidId || (invalidPeriod && !searchingById)}>
          Filtrar
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          Limpar
        </Button>
      </div>
      {searchingById && (
        <p className="filters__hint">
          Buscando por ID: os demais filtros são ignorados enquanto este campo estiver preenchido.
        </p>
      )}
    </form>
  );
}
