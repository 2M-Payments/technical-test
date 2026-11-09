import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { BulkActionsBar } from '../components/users/BulkActionsBar';
import { Pagination } from '../components/users/Pagination';
import { UserFilters } from '../components/users/UserFilters';
import { UsersTable } from '../components/users/UsersTable';
import { Alert } from '../components/ui/Alert';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { selectFilters } from '../contexts/users.reducer';
import { useAuth } from '../hooks/useAuth';
import { useRegions } from '../hooks/useRegions';
import { useUsers } from '../hooks/useUsers';
import { getErrorMessage } from '../services/api';
import type { User } from '../types/user';

type PendingDeletion = { kind: 'one'; user: User } | { kind: 'selected' } | { kind: 'all' };
type Feedback = { tone: 'success' | 'error'; text: string };

export function UsersListPage() {
  const { user: currentUser } = useAuth();
  const { regions } = useRegions();
  const location = useLocation();
  const {
    state,
    setFilters,
    setPage,
    setLimit,
    setSort,
    toggleSelection,
    togglePageSelection,
    deleteOne,
    deleteSelected,
    deleteAll,
  } = useUsers();

  const [pending, setPending] = useState<PendingDeletion | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Mensagem enviada pelas páginas de criação/edição ao redirecionar para a listagem.
  const flashMessage = (location.state as { message?: string } | null)?.message;
  const [feedback, setFeedback] = useState<Feedback | null>(
    flashMessage ? { tone: 'success', text: flashMessage } : null,
  );

  // Memoizado para não recriar o objeto (e resetar o formulário de filtros) a cada render.
  const filters = useMemo(() => selectFilters(state), [state.params]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmDeletion = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      if (pending.kind === 'one') {
        await deleteOne(pending.user.id);
        setFeedback({ tone: 'success', text: `Usuário ${pending.user.name} excluído.` });
      } else {
        const deleted = pending.kind === 'all' ? await deleteAll() : await deleteSelected();
        setFeedback({ tone: 'success', text: `${deleted} usuário(s) excluído(s).` });
      }
    } catch (error) {
      setFeedback({ tone: 'error', text: getErrorMessage(error) });
    } finally {
      setDeleting(false);
      setPending(null);
    }
  };

  const dialogCopy = {
    one: {
      title: 'Excluir usuário',
      description: `Tem certeza que deseja excluir ${pending?.kind === 'one' ? pending.user.name : ''}?`,
    },
    selected: {
      title: 'Excluir selecionados',
      description: `${state.selectedIds.length} usuário(s) serão excluídos permanentemente.`,
    },
    all: {
      title: 'Excluir todos os usuários',
      description:
        'Todos os usuários serão excluídos permanentemente, exceto você. Esta ação não pode ser desfeita.',
    },
  };

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h1>Usuários</h1>
          <p>Gerencie usuários e as regiões em que atuam.</p>
        </div>
        <div className="row">
          <Link to="/users/bulk" className="btn btn--secondary">
            Criar em lote
          </Link>
          <Link to="/users/new" className="btn btn--primary">
            Novo usuário
          </Link>
        </div>
      </header>

      <UserFilters value={filters} regions={regions} onApply={setFilters} />

      {feedback && <Alert tone={feedback.tone}>{feedback.text}</Alert>}
      {state.error && <Alert>{state.error}</Alert>}

      <div>
        <BulkActionsBar
          selectedCount={state.selectedIds.length}
          total={state.meta.total}
          onDeleteSelected={() => setPending({ kind: 'selected' })}
          onDeleteAll={() => setPending({ kind: 'all' })}
        />

        <div aria-busy={state.loading} style={{ opacity: state.loading ? 0.6 : 1 }}>
          <UsersTable
            users={state.users}
            selectedIds={state.selectedIds}
            sortBy={state.params.sortBy}
            sortOrder={state.params.sortOrder}
            currentUserId={currentUser?.id}
            onToggle={toggleSelection}
            onTogglePage={togglePageSelection}
            onSort={setSort}
            onDelete={(user) => setPending({ kind: 'one', user })}
          />
        </div>

        <Pagination meta={state.meta} onPageChange={setPage} onLimitChange={setLimit} />
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending ? dialogCopy[pending.kind].title : ''}
        description={pending ? dialogCopy[pending.kind].description : ''}
        confirmLabel="Excluir"
        loading={deleting}
        onConfirm={() => void confirmDeletion()}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
