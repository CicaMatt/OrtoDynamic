import { useMemo, useState } from 'react';

/** A table column the toolbar can search and filter on. */
export type SearchFilterColumn<T> = {
  key: string;
  label: string;
  /** The cell's plain-text value, used for both display and search/filter. */
  getValue: (row: T) => string;
  /** Included in free-text search unless set to false (default true). */
  searchable?: boolean;
  /** Offered as a column filter unless set to false (default true). */
  filterable?: boolean;
};

/**
 * Drives a `ViewToolbar`'s search box and column filters over an in-memory list:
 * holds the search/filter state, derives the available filter options from the
 * data, and returns the matching rows. Search is a case-insensitive substring
 * match across the searchable columns; filters are exact-value matches.
 */
export function useTableSearchFilter<T>(items: T[], columns: ReadonlyArray<SearchFilterColumn<T>>) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );
  const filterableColumns = useMemo(
    () => columns.filter((column) => column.filterable !== false),
    [columns],
  );

  const filterOptions = useMemo(
    () =>
      filterableColumns.map((column) => ({
        key: column.key,
        label: column.label,
        options: uniqueValues(items.map((item) => column.getValue(item))),
      })),
    [filterableColumns, items],
  );

  const filteredItems = useMemo(() => {
    const term = normalize(searchValue);
    return items.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        searchableColumns.some((column) => normalize(column.getValue(item)).includes(term));
      const matchesFilters = filterableColumns.every((column) => {
        const activeValue = activeFilters[column.key];
        return !activeValue || column.getValue(item) === activeValue;
      });
      return matchesSearch && matchesFilters;
    });
  }, [items, searchableColumns, filterableColumns, searchValue, activeFilters]);

  const setFilter = (key: string, value: string) =>
    setActiveFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setActiveFilters({});

  return {
    searchValue,
    setSearchValue,
    activeFilters,
    setFilter,
    clearFilters,
    filterOptions,
    filteredItems,
  };
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
