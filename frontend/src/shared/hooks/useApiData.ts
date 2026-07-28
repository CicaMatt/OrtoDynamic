import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

type ApiDataState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type ApiData<T> = ApiDataState<T> & {
  /** Re-run the current request without making callers own a counter. */
  reload: () => void;
};

/**
 * Run an async fetcher and track its loading/data/error state.
 *
 * Re-runs whenever `deps` change, and guards against state updates after the
 * component unmounts or the dependencies change mid-flight.
 */
export function useApiData<T>(fetcher: () => Promise<T>, deps: DependencyList): ApiData<T> {
  const [state, setState] = useState<ApiDataState<T>>({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  const requestIdRef = useRef(0);
  fetcherRef.current = fetcher;

  const load = useCallback((preserveData: boolean) => {
    const requestId = ++requestIdRef.current;
    setState((current) => ({
      data: preserveData ? current.data : null,
      loading: !preserveData || current.data === null,
      error: null,
    }));

    fetcherRef
      .current()
      .then((data) => {
        if (requestId === requestIdRef.current) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (requestId === requestIdRef.current) {
          const message = error instanceof Error ? error.message : 'Errore di caricamento.';
          setState({ data: null, loading: false, error: message });
        }
      });
  }, []);

  const reload = useCallback(() => load(true), [load]);

  useEffect(() => {
    load(false);

    return () => {
      requestIdRef.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, load]);

  return { ...state, reload };
}
