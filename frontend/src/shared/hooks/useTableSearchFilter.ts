import { useMemo, useState } from 'react';
import { tableColumnValue, type TableColumn } from '../entity/DataTable';

/** A table column the toolbar can search and filter on. */
export type SearchFilterColumn<T extends object> = TableColumn<T>;

/**
 * Drives a `ViewToolbar`'s search box and column filters over an in-memory list:
 * holds the search/filter state, derives the available filter options from the
 * data, and returns the matching rows. Free-text search is a case-insensitive
 * substring match across the searchable columns. Each filterable column is
 * filtered one of two ways: a free-text column (searchable) by a case-insensitive
 * substring typeahead, a categorical column (`searchable === false`, e.g. status
 * or a yes/no flag) by an exact pick from its distinct values.
 */
type UseTableSearchFilterOptions = {
  /**
   * List the exact-pick (categorical) filters before the free-text ones in the
   * derived filter menu, regardless of column order. Off by default.
   */
  categoricalFiltersFirst?: boolean;
};

export function useTableSearchFilter<T extends object>(
  items: T[],
  columns: ReadonlyArray<SearchFilterColumn<T>>,
  { categoricalFiltersFirst = false }: UseTableSearchFilterOptions = {},
) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );
  const filterableColumns = useMemo(() => {
    const filterable = columns.filter((column) => column.filterable !== false);
    if (!categoricalFiltersFirst) return filterable;
    // Stable sort keeps each group's column order; categorical (exact-pick)
    // columns move ahead of the free-text ones.
    return [...filterable].sort((a, b) => Number(isCategorical(b)) - Number(isCategorical(a)));
  }, [columns, categoricalFiltersFirst]);

  const filterOptions = useMemo(
    () =>
      filterableColumns.map((column) => ({
        key: String(column.key),
        label: column.label,
        options: uniqueValues(items.map((item) => tableColumnValue(column, item))),
        // Categorical columns are picked from a fixed dropdown; free-text ones
        // use a substring typeahead. Kept in sync with the matching in
        // `filteredItems`.
        fixedChoices: isCategorical(column),
      })),
    [filterableColumns, items],
  );

  const filteredItems = useMemo(() => {
    const term = normalize(searchValue);
    return items.filter((item) => {
      const matchesSearch =
        term.length === 0 ||
        searchableColumns.some((column) =>
          normalize(tableColumnValue(column, item)).includes(term),
        );
      const matchesFilters = filterableColumns.every((column) => {
        const activeValue = activeFilters[String(column.key)];
        if (!activeValue) return true;
        return isCategorical(column)
          ? tableColumnValue(column, item) === activeValue
          : normalize(tableColumnValue(column, item)).includes(normalize(activeValue));
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

/**
 * Columns excluded from free-text search are treated as categorical (status,
 * type, yes/no): filtered by an exact dropdown pick rather than a typeahead.
 */
function isCategorical<T extends object>(column: SearchFilterColumn<T>): boolean {
  return column.searchable === false;
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
