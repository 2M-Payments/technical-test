import { useEffect, useState } from 'react';

import { getErrorMessage } from '../services/api';
import { usersService } from '../services/users.service';
import type { User } from '../types/user';

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/** Carrega um único usuário pelo ID. */
export function useUser(id: string | undefined): UseUserResult {
  const [result, setResult] = useState<UseUserResult>({ user: null, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    let active = true;
    setResult({ user: null, loading: true, error: null });

    usersService
      .getById(id)
      .then((user) => active && setResult({ user, loading: false, error: null }))
      .catch((error: unknown) => {
        if (active) {
          setResult({
            user: null,
            loading: false,
            error: getErrorMessage(error, 'Usuário não encontrado.'),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  return result;
}
