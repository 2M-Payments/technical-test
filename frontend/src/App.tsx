import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UsersProvider } from './contexts/UsersContext';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UserCreatePage } from './pages/UserCreatePage';
import { UserDetailsPage } from './pages/UserDetailsPage';
import { UserEditPage } from './pages/UserEditPage';
import { UsersBulkCreatePage } from './pages/UsersBulkCreatePage';
import { UsersListPage } from './pages/UsersListPage';

/** O estado da listagem só existe para usuários autenticados. */
function AuthenticatedArea() {
  return (
    <UsersProvider>
      <Outlet />
    </UsersProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedArea />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/users" replace />} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/users/new" element={<UserCreatePage />} />
                <Route path="/users/bulk" element={<UsersBulkCreatePage />} />
                <Route path="/users/:id" element={<UserDetailsPage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
