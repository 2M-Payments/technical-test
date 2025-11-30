import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useLogoutMutation, useGetMeQuery } from "@/features/auth/auth-api";

export function useAuth() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const { isLoading, isError } = useGetMeQuery(undefined, {
    skip: !!user,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    logout: logoutMutation,
  };
}
