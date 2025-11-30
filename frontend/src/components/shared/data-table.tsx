import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
};

const LIMIT_OPTIONS = [5, 10, 20, 50];

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pagination,
  onPageChange,
  onLimitChange,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="text-zinc-400">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                className="border-zinc-800 hover:bg-zinc-900/50"
              >
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
            ))}
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
