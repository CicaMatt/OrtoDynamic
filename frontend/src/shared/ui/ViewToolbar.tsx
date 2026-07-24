import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export type ToolbarFilter = {
  key: string;
  label: string;
  options: string[];
  /** Render a fixed-choice dropdown instead of the free-text typeahead. */
  fixedChoices?: boolean;
};

export type ToolbarFilters = Record<string, string>;

type ViewToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onDownload?: () => void;
  downloadDisabled?: boolean;
  onCreate?: () => void;
  filters?: ToolbarFilter[];
  activeFilters?: ToolbarFilters;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
};

export function ViewToolbar({
  searchValue = '',
  onSearchChange,
  onDownload,
  downloadDisabled = false,
  onCreate,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
}: ViewToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          disabled={downloadDisabled}
          className="border border-outline-variant text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="download" className="text-sm" />
          Scarica CSV
        </button>
      )}
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className="bg-secondary text-on-secondary font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 border border-transparent hover:bg-secondary-hover transition-colors"
        >
          <Icon name="add" className="text-sm" />
          Nuovo
        </button>
      )}
      {(onDownload || onCreate) && <div className="h-6 w-px bg-outline-variant mx-2" />}
      <FilterMenu
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
      <ToolbarSearch value={searchValue} onChange={onSearchChange} />
    </div>
  );
}

function FilterMenu({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: {
  filters: ToolbarFilter[];
  activeFilters: ToolbarFilters;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
}) {
  const { open, setOpen, containerRef } = useClickOutsideDropdown<HTMLDivElement>();
  const disabled = filters.length === 0 || !onFilterChange;
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        disabled={disabled}
        className="border border-outline-variant text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon name="filter_list" className="text-sm" />
        Filtra
        {activeFilterCount > 0 && (
          <span className="bg-primary text-on-primary rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-[11px] leading-none">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && onFilterChange && (
        <DropdownShell>
          <div className="flex items-center justify-between mb-3">
            <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Filtri
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="font-label-caps text-label-caps text-primary hover:underline"
              >
                Rimuovi
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {filters.map((filter) =>
              filter.fixedChoices ? (
                <FilterSelect
                  key={filter.key}
                  label={filter.label}
                  value={activeFilters[filter.key] ?? ''}
                  options={filter.options}
                  onChange={(value) => onFilterChange(filter.key, value)}
                />
              ) : (
                <FilterCombobox
                  key={filter.key}
                  label={filter.label}
                  value={activeFilters[filter.key] ?? ''}
                  options={filter.options}
                  onCommit={(value) => onFilterChange(filter.key, value)}
                />
              ),
            )}
          </div>
        </DropdownShell>
      )}
    </div>
  );
}

function useClickOutsideDropdown<T extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return { open, setOpen, containerRef };
}

function DropdownShell({ children }: { children: ReactNode }) {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 p-4 z-50">
      {children}
    </div>
  );
}

/** A column filter over a small, fixed set of values (status, type, yes/no). */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-outline-variant rounded-lg bg-surface px-3 py-2 text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="">Tutti</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function matchRank(option: string, term: string): number | null {
  if (option.startsWith(term)) return 0;
  if (option.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(term))) return 1;
  return option.includes(term) ? 2 : null;
}

function FilterCombobox({
  label,
  value,
  options,
  onCommit,
}: {
  label: string;
  value: string;
  options: string[];
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => setDraft(value), [value]);

  const suggestions = useMemo(() => {
    const term = draft.trim().toLowerCase();
    if (!term) return [];
    return options
      .map((option) => {
        const lower = option.toLowerCase();
        return { option, lower, rank: matchRank(lower, term) };
      })
      .filter(
        (entry): entry is { option: string; lower: string; rank: number } =>
          entry.rank !== null && entry.lower !== term,
      )
      .sort((a, b) => a.rank - b.rank)
      .map(({ option, rank }) => ({ option, rank }));
  }, [draft, options]);

  const commit = (next: string) => {
    setDraft(next);
    setOpen(false);
    onCommit(next);
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      <div className="relative">
        <input
          type="text"
          value={draft}
          placeholder="Tutti"
          onChange={(event) => {
            setDraft(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit(draft);
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="w-full border border-outline-variant rounded-lg bg-surface pl-3 pr-9 py-2 text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          aria-label={`Cerca ${label}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => commit(draft)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
        >
          <Icon name="search" className="text-base" />
        </button>
        {open && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1 z-10">
            {suggestions.map((entry, index) => {
              const startsSubstringGroup =
                entry.rank === 2 && index > 0 && suggestions[index - 1].rank < 2;
              return (
                <li
                  key={entry.option}
                  className={
                    startsSubstringGroup
                      ? 'mt-1 pt-1 border-t border-outline-variant/30'
                      : undefined
                  }
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commit(entry.option)}
                    className="w-full text-left px-3 py-1.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    {entry.option}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </label>
  );
}

function ToolbarSearch({ value, onChange }: { value: string; onChange?: (value: string) => void }) {
  return (
    <div className="relative">
      <Icon
        name="search"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Cerca..."
        disabled={!onChange}
        className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface text-body-sm w-48 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
