import { useState } from "react";
import { PackageIcon } from "lucide-react";
import { useListProductsQuery } from "@/features/products/products-api";
import { DataTable } from "@/components/shared/data-table";
import { Loader } from "@/components/shared/loader";
import { EmptyState } from "@/components/shared/empty-state";
import { columns } from "./columns";

export function Dashboard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useListProductsQuery({ page, limit });

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <Loader />
        ) : data?.data.length === 0 ? (
          <EmptyState icon={PackageIcon} title="Nenhum produto cadastrado" />
        ) : (
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            keyExtractor={(item) => item.id}
            pagination={data?.meta}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        )}
      </main>
    </div>
  );
}
