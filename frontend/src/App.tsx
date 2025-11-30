import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthLoader } from "@/components/shared/auth-loader";
import { RouteGuard } from "@/components/shared/route-guard";
import { Login } from "@/pages/public/login";
import { Register } from "@/pages/public/register";
import { Dashboard } from "@/pages/private/dashboard";

function App() {
  return (
    <AuthLoader>
      <Routes>
        <Route element={<RouteGuard requireAuth={false} redirectTo="/dashboard" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RouteGuard requireAuth={true} redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </AuthLoader>
  );
}

export default App;
