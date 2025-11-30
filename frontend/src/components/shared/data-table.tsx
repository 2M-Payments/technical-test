import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/contexts/modal-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  resource?: {
    name: string;
    modal: string;
    deleteMany?: (ids: string[]) => Promise<unknown>;
    deleteAll?: () => Promise<unknown>;
  };
};

const LIMIT_OPTIONS = [5, 10, 20, 50];

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pagination,
  onPageChange,
  onLimitChange,
  resource,
}: DataTableProps<T>) {
  const { openModal } = useModal();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;
  const hasDeleteActions = resource?.deleteMany || resource?.deleteAll;

  const toggleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(keyExtractor));
    }
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!resource?.deleteMany) return;

    openModal("confirm", {
      title: `Excluir ${resource.name}s selecionados`,
      description: `Tem certeza que deseja excluir ${selectedIds.length} ${resource.name}(s)?`,
      confirmLabel: "Excluir",
      onConfirm: async () => {
        try {
          await resource.deleteMany!(selectedIds);
          toast.success(`${selectedIds.length} ${resource.name}(s) excluído(s) com sucesso!`);
          setSelectedIds([]);
        } catch {
          toast.error(`Erro ao excluir ${resource.name}s`);
        }
      },
    });
  };

  const handleDeleteAll = () => {
    if (!resource?.deleteAll) return;

    openModal("confirm", {
      title: `Excluir todos os ${resource.name}s`,
      description: `Tem certeza que deseja excluir todos os ${resource.name}s?`,
      confirmLabel: "Excluir todos",
      onConfirm: async () => {
        try {
          await resource.deleteAll!();
          toast.success(`Todos os ${resource.name}s foram excluídos!`);
          setSelectedIds([]);
        } catch {
          toast.error(`Erro ao excluir ${resource.name}s`);
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && resource?.deleteMany && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2Icon className="size-4 mr-1" />
              Excluir ({selectedIds.length})
            </Button>
          )}
          {resource?.deleteAll && pagination && pagination.total > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              className="border-zinc-700 text-red-400 hover:text-red-300 hover:bg-red-950/20"
            >
              Excluir todos
            </Button>
          )}
        </div>
        {resource && (
          <Button onClick={() => openModal(resource.modal)}>
            Cadastrar {resource.name}
          </Button>
        )}
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              {hasDeleteActions && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={() => {}}
                    onClick={toggleSelectAll}
                    className="size-4 rounded border-zinc-600 bg-zinc-800 cursor-pointer"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="text-zinc-400">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds.includes(id);

              return (
                <TableRow
                  key={id}
                  className={`border-zinc-800 hover:bg-zinc-900/50 cursor-pointer ${
                    isSelected ? "bg-zinc-800/50" : ""
                  }`}
                  onClick={() => resource && openModal(resource.modal, keyExtractor(item))}
                >
                  {hasDeleteActions && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => toggleSelect(e, id)}
                        className="size-4 rounded border-zinc-600 bg-zinc-800 cursor-pointer"
                      />
                    </TableCell>
                  )}
                  {columns.map((column, index) => (
                    <TableCell
                      key={String(column.key)}
                      className={
                        index === 0
                          ? "text-zinc-100 font-medium"
                          : "text-zinc-400"
                      }
                    >
                      {column.render
                        ? column.render(item)
                        : String((item as Record<string, unknown>)[String(column.key)] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Exibindo</span>
            <Select
              value={String(pagination.limit)}
              onValueChange={(value) => onLimitChange?.(Number(value))}
            >
              <SelectTrigger className="w-[70px] h-8 border-zinc-700 bg-zinc-800/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>de {pagination.total} itens</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400 whitespace-nowrap">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed mt-0"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange?.(pagination.page - 1)}
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed mt-0"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange?.(pagination.page + 1)}
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
