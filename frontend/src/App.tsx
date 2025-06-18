import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { LoginPage } from './pages/LoginPage';
import ProductsPage from './pages/ProductPage';
import { ProtectedRoute } from './components/PrivateRoute';
import { RegisterPage } from './pages/RegisterPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<ProductsPage />} />
            </Route>
            
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
