import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

type RouteGuardProps = {
  requireAuth: boolean;
  redirectTo: string;
};

export function RouteGuard({ requireAuth, redirectTo }: RouteGuardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

