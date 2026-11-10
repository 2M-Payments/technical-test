import { useEffect, useState } from 'react';

/** Minutos restantes até `expiresAt`, atualizado a cada 15 segundos. */
export function useSessionCountdown(expiresAt: string | null): number | null {
  const compute = () =>
    expiresAt ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 60_000)) : null;

  const [minutes, setMinutes] = useState(compute);

  useEffect(() => {
    setMinutes(compute());
    const interval = window.setInterval(() => setMinutes(compute()), 15_000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiresAt]);

  return minutes;
}
