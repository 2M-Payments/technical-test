import { renderHook } from '@testing-library/react';
import { AuthContext} from '../../contexts/AuthContext';
import { type AuthContextData } from '../../types/authTypes';
import { useAuth } from '../../hooks/useAuth';
import {type ReactNode } from 'react';

const createWrapper = (value: AuthContextData) => ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

describe('useAuth Hook', () => {
  it('deve lançar um erro quando usado fora de um AuthProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado dentro de um AuthProvider'
    );
    console.error = originalError;
  });

  it('deve retornar o contexto quando usado dentro de um AuthProvider', () => {
    const mockContextValue: AuthContextData = {
      isAuthenticated: true,
      token: 'fake-token-123',
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockContextValue),
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('fake-token-123');
  });
});