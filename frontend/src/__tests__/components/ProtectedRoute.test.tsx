import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../../hooks/useAuth');

describe('ProtectedRoute', () => {
  it('redirects to login if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route path="/protegido" element={
            <ProtectedRoute>
              <div>Conteúdo Protegido</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
    expect(screen.getByText('Página de Login')).toBeInTheDocument();
  });

  it('renders content if authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/protegido']}>
        <Routes>
           <Route path="/login" element={<div>Página de Login</div>} />
           <Route path="/protegido" element={
            <ProtectedRoute>
              <div>Conteúdo Protegido</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
  });
});