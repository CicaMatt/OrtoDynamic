import { useState } from 'react';
import { presentBlobInWindow } from './openBlob';

/**
 * Drive an "open a generated PDF inline" action shared by the detail views.
 *
 * The tab is opened synchronously inside the click (so popup blockers keep it
 * attributed to the user gesture), the blob is fetched, then loaded into the tab.
 * `generating` tracks which document is in flight and `error` holds the last
 * failure; the `K` type parameter distinguishes the buttons that share the state.
 */
export function useInlineDocument<K extends string = string>() {
  const [generating, setGenerating] = useState<K | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = async (kind: K, fetcher: () => Promise<{ blob: Blob }>) => {
    setError(null);
    const win = window.open('', '_blank');
    setGenerating(kind);
    try {
      const { blob } = await fetcher();
      presentBlobInWindow(win, blob);
    } catch (err) {
      win?.close();
      setError(err instanceof Error ? err.message : 'Impossibile generare il documento.');
    } finally {
      setGenerating(null);
    }
  };

  return { generating, error, clearError: () => setError(null), open };
}
