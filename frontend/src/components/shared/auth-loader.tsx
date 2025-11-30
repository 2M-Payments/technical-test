import { Loader2Icon } from "lucide-react";
import { useGetMeQuery } from "@/features/auth/auth-api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { ReactNode } from "react";

type AuthLoaderProps = {
  children: ReactNode;
};

export function AuthLoader({ children }: AuthLoaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { isLoading } = useGetMeQuery(undefined, {
    skip: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
