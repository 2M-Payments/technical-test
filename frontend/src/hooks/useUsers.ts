import { useContext } from 'react';

import { UsersContext, type UsersContextValue } from '../contexts/UsersContext';

export function useUsers(): UsersContextValue {
  const context = useContext(UsersContext);
  if (!context) throw new Error('useUsers deve ser usado dentro de <UsersProvider>');
  return context;
}
