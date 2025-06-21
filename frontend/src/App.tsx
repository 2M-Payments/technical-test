// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

    
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;