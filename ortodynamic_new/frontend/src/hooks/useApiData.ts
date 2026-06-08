import { useEffect, useState, type DependencyList } from 'react';

type ApiDataState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Run an async fetcher and track its loading/data/error state.
 *
 * Re-runs whenever `deps` change, and guards against state updates after the
 * component unmounts or the dependencies change mid-flight.
 */
export function useApiData<T>(fetcher: () => Promise<T>, deps: DependencyList): ApiDataState<T> {
  const [state, setState] = useState<ApiDataState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState({ data: null, loading: true, error: null });

    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          const message = error instanceof Error ? error.message : 'Errore di caricamento.';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
