
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import ProductsPage from './pages/ProductPage';
import { ProtectedRoute } from './components/PrivateRoute';
import { RegisterPage } from './pages/RegisterPage';



const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductsPage />} />
          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App; 