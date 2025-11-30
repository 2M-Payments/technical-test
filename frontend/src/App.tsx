import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthLoader } from "@/components/shared/auth-loader";
import { RouteGuard } from "@/components/shared/route-guard";
import { PrivateLayout } from "@/components/layout/private-layout";
import { ModalProvider } from "@/contexts/modal-context";
import { Modals } from "@/components/modals";
import { Login } from "@/pages/public/login";
import { Register } from "@/pages/public/register";
import { Dashboard } from "@/pages/private/dashboard";

function App() {
  return (
    <ModalProvider>
      <AuthLoader>
        <Routes>
          <Route element={<RouteGuard requireAuth={false} redirectTo="/dashboard" />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RouteGuard requireAuth={true} redirectTo="/login" />}>
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Modals />
        <Toaster position="top-right" richColors />
      </AuthLoader>
    </ModalProvider>
  );
}

export default App;
