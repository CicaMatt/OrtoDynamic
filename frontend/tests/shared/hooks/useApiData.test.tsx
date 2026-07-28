import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useApiData } from '../../../src/shared/hooks/useApiData';

describe('useApiData', () => {
  it('reloads with a stable callback and exposes the latest result', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce('first').mockResolvedValueOnce('second');
    const { result } = renderHook(() => useApiData(fetcher, []));

    await waitFor(() => expect(result.current.data).toBe('first'));
    const reload = result.current.reload;

    act(() => result.current.reload());

    await waitFor(() => expect(result.current.data).toBe('second'));
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.current.reload).toBe(reload);
  });

  it('keeps loaded data visible while a manual reload is pending', async () => {
    let resolveReload: ((value: string) => void) | undefined;
    const fetcher = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce('first')
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveReload = resolve;
          }),
      );
    const { result } = renderHook(() => useApiData(fetcher, []));
    await waitFor(() => expect(result.current.data).toBe('first'));

    act(() => result.current.reload());

    expect(result.current.data).toBe('first');
    expect(result.current.loading).toBe(false);

    act(() => resolveReload?.('second'));
    await waitFor(() => expect(result.current.data).toBe('second'));
  });

  it('ignores stale requests after dependencies change', async () => {
    let resolveFirst: ((value: string) => void) | undefined;
    const fetcher = vi.fn((id: string) => {
      if (id === 'first') {
        return new Promise<string>((resolve) => {
          resolveFirst = resolve;
        });
      }
      return Promise.resolve('second result');
    });
    const { result, rerender } = renderHook(({ id }) => useApiData(() => fetcher(id), [id]), {
      initialProps: { id: 'first' },
    });

    rerender({ id: 'second' });
    await waitFor(() => expect(result.current.data).toBe('second result'));

    act(() => resolveFirst?.('stale result'));
    expect(result.current.data).toBe('second result');
  });
});
