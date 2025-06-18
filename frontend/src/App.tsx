import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import ProductsPage from './pages/ProductPage';
import { ProtectedRoute } from './components/PrivateRoute';
import { RegisterPage } from './pages/RegisterPage';


const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />;
};


const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota raiz - redireciona baseado na autenticação */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductsPage />} />
      </Route>
      
      {/* Rota 404 - redireciona para página inicial */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
