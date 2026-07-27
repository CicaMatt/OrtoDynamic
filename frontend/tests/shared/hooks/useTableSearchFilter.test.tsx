import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  useTableSearchFilter,
  type SearchFilterColumn,
} from '../../../src/shared/hooks/useTableSearchFilter';

type Row = { name: string; status: string };

const rows: Row[] = [
  { name: 'Tutore gamba', status: 'APERTO' },
  { name: 'Tutore braccio', status: 'CHIUSO' },
  { name: 'Plantare', status: 'APERTO URGENTE' },
];
const columns: SearchFilterColumn<Row>[] = [
  { key: 'name', label: 'Nome' },
  { key: 'status', label: 'Stato', searchable: false },
];

describe('useTableSearchFilter', () => {
  it('combines case-insensitive search with substring text filters', () => {
    const { result } = renderHook(() => useTableSearchFilter(rows, columns));

    act(() => result.current.setSearchValue('TUTORE'));
    act(() => result.current.setFilter('name', 'brac'));

    expect(result.current.filteredItems).toEqual([rows[1]]);
  });

  it('uses exact matching for categorical columns', () => {
    const { result } = renderHook(() => useTableSearchFilter(rows, columns));

    act(() => result.current.setFilter('status', 'APERTO'));

    expect(result.current.filteredItems).toEqual([rows[0]]);
    expect(result.current.filterOptions[1]).toMatchObject({
      key: 'status',
      fixedChoices: true,
      options: ['APERTO', 'APERTO URGENTE', 'CHIUSO'],
    });
  });

  it('can put categorical filters first and clear active filters', () => {
    const { result } = renderHook(() =>
      useTableSearchFilter(rows, columns, { categoricalFiltersFirst: true }),
    );

    expect(result.current.filterOptions.map((option) => option.key)).toEqual(['status', 'name']);
    act(() => result.current.setFilter('status', 'CHIUSO'));
    act(() => result.current.clearFilters());
    expect(result.current.activeFilters).toEqual({});
    expect(result.current.filteredItems).toEqual(rows);
  });

  it('applies initial filters and allows them to be cleared', () => {
    const { result } = renderHook(() =>
      useTableSearchFilter(rows, columns, { initialFilters: { status: 'CHIUSO' } }),
    );

    expect(result.current.activeFilters).toEqual({ status: 'CHIUSO' });
    expect(result.current.filteredItems).toEqual([rows[1]]);

    act(() => result.current.clearFilters());
    expect(result.current.filteredItems).toEqual(rows);
  });
});
