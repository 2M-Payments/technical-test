import { useEffect, useState } from 'react';

import { getErrorMessage } from '../services/api';
import { regionsService } from '../services/regions.service';
import type { Region } from '../types/user';

interface UseRegionsResult {
  regions: Region[];
  loading: boolean;
  error: string | null;
}

/** As regiões raramente mudam: guardamos a primeira requisição em cache no módulo. */
let cache: Promise<Region[]> | null = null;

export function useRegions(): UseRegionsResult {
  const [result, setResult] = useState<UseRegionsResult>({
    regions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    cache ??= regionsService.list();

    cache
      .then((regions) => active && setResult({ regions, loading: false, error: null }))
      .catch((error: unknown) => {
        cache = null;
        if (active) setResult({ regions: [], loading: false, error: getErrorMessage(error) });
      });

    return () => {
      active = false;
    };
  }, []);

  return result;
}
