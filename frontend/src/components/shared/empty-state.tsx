import { PackageIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon = PackageIcon,
  title = "Nenhum item encontrado",
  description,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-zinc-500", className)}>
      <Icon className="size-12 mb-4" />
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}

