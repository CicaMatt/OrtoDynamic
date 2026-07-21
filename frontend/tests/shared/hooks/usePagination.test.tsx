import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePagination } from '../../../src/shared/hooks/usePagination';

describe('usePagination', () => {
  it('reports page slices and one-based ranges', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const { result } = renderHook(() => usePagination(items, 2));

    expect(result.current).toMatchObject({
      page: 1,
      totalPages: 3,
      totalItems: 5,
      pageItems: ['a', 'b'],
      rangeStart: 1,
      rangeEnd: 2,
    });

    act(() => result.current.setPage(3));
    expect(result.current.pageItems).toEqual(['e']);
    expect(result.current.rangeStart).toBe(5);
    expect(result.current.rangeEnd).toBe(5);
  });

  it('resets to page one when the source list changes', () => {
    const first = ['a', 'b', 'c'];
    const second = ['x'];
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 2), {
      initialProps: { items: first },
    });

    act(() => result.current.setPage(2));
    rerender({ items: second });

    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toEqual(['x']);
    expect(result.current.rangeStart).toBe(1);
    expect(result.current.rangeEnd).toBe(1);
  });

  it('keeps empty collections on a single empty page', () => {
    const { result } = renderHook(() => usePagination([], 10));

    expect(result.current).toMatchObject({
      totalPages: 1,
      totalItems: 0,
      pageItems: [],
      rangeStart: 0,
      rangeEnd: 0,
    });
  });
});
