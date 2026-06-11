import { useEffect, useState } from 'react';
import { fetchMunicipalities } from './api/municipalities';
import type { Municipality } from './types';

/**
 * The `comuni` list is large and static, so it is fetched once and shared
 * process-wide via this module-level cache.
 */
let cache: Promise<Municipality[]> | null = null;

/**
 * Load the municipalities lookup. Pass `enabled = false` to skip the fetch
 * (e.g. a detail view that only needs it once it enters edit mode).
 */
export function useMunicipalities(enabled = true): { municipalities: Municipality[]; error: string | null } {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    if (!cache) {
      cache = fetchMunicipalities().catch((reason) => {
        cache = null; // allow a later retry
        throw reason;
      });
    }
    cache
      .then((data) => {
        if (active) setMunicipalities(data);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Impossibile caricare i comuni.');
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  return { municipalities, error };
}
