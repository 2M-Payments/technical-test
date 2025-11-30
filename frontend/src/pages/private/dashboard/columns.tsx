import type { Column } from "@/components/shared/data-table";
import type { Product } from "@/features/products/products-api";
import { formatPrice } from "@/lib/format";

export const columns: Column<Product>[] = [
  { key: "name", header: "Nome" },
  { key: "category", header: "Categoria" },
  { key: "quantity", header: "Quantidade" },
  { key: "price", header: "Preço", render: (item) => formatPrice(item.price) },
];
