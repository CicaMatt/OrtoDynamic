import { useEffect, useMemo, useState } from 'react';

export const DEFAULT_PAGE_SIZE = 30;

export type PaginationState<T> = {
  /** Current page number (1-based). */
  page: number;
  /** Total number of pages (at least 1). */
  totalPages: number;
  /** Total number of items across all pages. */
  totalItems: number;
  /** Items belonging to the current page. */
  pageItems: T[];
  /** 1-based index of the first item on the page (0 when empty). */
  rangeStart: number;
  /** 1-based index of the last item on the page. */
  rangeEnd: number;
  setPage: (page: number) => void;
};

/**
 * Paginate an in-memory list.
 *
 * Resets to the first page whenever the source list changes (e.g. after a
 * search or filter), so callers must pass a stable/memoized `items` reference
 * — an array rebuilt on every render would pin the view to page 1.
 */
export function usePagination<T>(items: T[], pageSize: number = DEFAULT_PAGE_SIZE): PaginationState<T> {
  const [page, setPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPage(1);
  }, [items]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return { page, totalPages, totalItems, pageItems, rangeStart, rangeEnd, setPage };
}
