import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
};

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <Loader2Icon className={cn("animate-spin text-primary", sizeClasses[size])} />
    </div>
  );
}

