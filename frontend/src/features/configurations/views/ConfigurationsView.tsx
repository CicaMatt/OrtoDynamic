import { useMemo, useState, type ReactNode } from 'react';
import { DataTable } from '../../../shared/entity/DataTable';
import { useApiData } from '../../../shared/hooks/useApiData';
import { useTableSearchFilter, type SearchFilterColumn } from '../../../shared/hooks/useTableSearchFilter';
import { ViewToolbar } from '../../../shared/ui/ViewToolbar';
import { fetchQuoteStatuses, fetchQuoteStatusTransitions } from '../api/statuses';
import type { Status, StatusTransition } from '../types';

type Panel = 'states' | 'transitions';

const PANELS: ReadonlyArray<{ value: Panel; label: string }> = [
  { value: 'states', label: 'Stati' },
  { value: 'transitions', label: 'Transizioni' },
];

/**
 * Read-only configuration screen for the Preventivi workflow: the defined states
 * and, via the header toggle, the permitted transitions between them. Both are
 * plain reference tables (no creation, editing or detail navigation), each with
 * its own toolbar search and filters.
 */
const STATE_COLUMNS: ReadonlyArray<SearchFilterColumn<Status>> = [
  { key: 'name', label: 'Stato', getValue: (status) => status.name },
];

const TRANSITION_COLUMNS: ReadonlyArray<SearchFilterColumn<StatusTransition>> = [
  { key: 'fromStatus', label: 'Stato di Partenza', getValue: (transition) => transition.fromStatus },
  { key: 'toStatus', label: 'Stato di Arrivo', getValue: (transition) => transition.toStatus },
];

export function ConfigurationsView() {
  const [panel, setPanel] = useState<Panel>('states');
  const toggle = <PanelToggle value={panel} onChange={setPanel} />;

  // The distinct `key` per panel remounts the table on switch, so the other one
  // starts from a clean toolbar — appropriate since their columns differ.
  return panel === 'states' ? (
    <ConfigPanel
      key="states"
      toggle={toggle}
      fetchItems={fetchQuoteStatuses}
      columns={STATE_COLUMNS}
      rowKey={(status) => String(status.id)}
      loadingLabel="Caricamento stati..."
      emptyLabel="Nessuno stato configurato."
    />
  ) : (
    <ConfigPanel
      key="transitions"
      toggle={toggle}
      fetchItems={fetchQuoteStatusTransitions}
      columns={TRANSITION_COLUMNS}
      rowKey={(transition) => String(transition.id)}
      loadingLabel="Caricamento transizioni..."
      emptyLabel="Nessuna transizione configurata."
    />
  );
}

type ConfigPanelProps<T> = {
  toggle: ReactNode;
  fetchItems: () => Promise<T[]>;
  columns: ReadonlyArray<SearchFilterColumn<T>>;
  rowKey: (row: T) => string;
  loadingLabel: string;
  emptyLabel: string;
};

/** A configuration table with its own header toolbar (panel toggle, search, filters). */
function ConfigPanel<T>({ toggle, fetchItems, columns, rowKey, loadingLabel, emptyLabel }: ConfigPanelProps<T>) {
  const { data, loading, error } = useApiData(fetchItems, []);
  const items = useMemo(() => data ?? [], [data]);
  const { searchValue, setSearchValue, activeFilters, setFilter, clearFilters, filterOptions, filteredItems } =
    useTableSearchFilter(items, columns);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Configurazioni</h2>
        <div className="flex items-center gap-4">
          {toggle}
          <ViewToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={setFilter}
            onClearFilters={clearFilters}
          />
        </div>
      </header>

      <DataTable
        columns={columns}
        rows={filteredItems}
        loading={loading}
        error={error}
        loadingLabel={loadingLabel}
        emptyLabel={emptyLabel}
        rowKey={rowKey}
      />
    </div>
  );
}

function PanelToggle({ value, onChange }: { value: Panel; onChange: (value: Panel) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-outline-variant bg-surface p-1">
      {PANELS.map((panel) => {
        const active = panel.value === value;
        return (
          <button
            key={panel.value}
            type="button"
            onClick={() => onChange(panel.value)}
            aria-pressed={active}
            className={`px-4 py-1.5 rounded-md font-label-caps text-label-caps transition-colors ${
              active
                ? 'bg-primary-container text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {panel.label}
          </button>
        );
      })}
    </div>
  );
}

