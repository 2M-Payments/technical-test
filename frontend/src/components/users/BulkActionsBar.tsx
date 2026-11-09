import { Button } from '../ui/Button';

interface BulkActionsBarProps {
  selectedCount: number;
  total: number;
  onDeleteSelected(): void;
  onDeleteAll(): void;
}

export function BulkActionsBar({
  selectedCount,
  total,
  onDeleteSelected,
  onDeleteAll,
}: BulkActionsBarProps) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Ações em lote">
      <span>
        {selectedCount > 0
          ? `${selectedCount} selecionado${selectedCount === 1 ? '' : 's'}`
          : 'Selecione usuários para excluir em lote'}
      </span>
      <div className="row">
        <Button variant="danger" disabled={selectedCount === 0} onClick={onDeleteSelected}>
          Excluir selecionados
        </Button>
        <Button variant="secondary" disabled={total === 0} onClick={onDeleteAll}>
          Excluir todos
        </Button>
      </div>
    </div>
  );
}
