import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

export type ToolbarFilter = {
  key: string;
  label: string;
  options: string[];
};

export type ToolbarFilters = Record<string, string>;

export type QuickFilterGroup = {
  title: string;
  options: Array<{
    key: string;
    label: string;
    value: string;
    icon?: string;
    dotColor?: string;
  }>;
};

type ViewToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onCreate?: () => void;
  onActions?: () => void;
  filters?: ToolbarFilter[];
  activeFilters?: ToolbarFilters;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  quickFilterGroups?: QuickFilterGroup[];
};

export function ViewToolbar({
  searchValue = '',
  onSearchChange,
  onCreate,
  onActions,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  quickFilterGroups = [],
}: ViewToolbarProps) {
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="flex items-center gap-4">
      {onCreate && (
        <button
          onClick={onCreate}
          className="bg-primary-container text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-lg hover:bg-on-primary-fixed-variant transition-colors"
        >
          Crea Nuovo
        </button>
      )}
      {onActions && (
        <button
          onClick={onActions}
          className="border border-outline-variant text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors"
        >
          Azioni
          <Icon name="expand_more" className="text-sm" />
        </button>
      )}
      {(onCreate || onActions) && <div className="h-6 w-px bg-outline-variant mx-2" />}
      {quickFilterGroups.length > 0 && (
        <QuickFilters groups={quickFilterGroups} onFilterChange={onFilterChange} />
      )}
      <FilterMenu
        filters={filters}
        activeFilters={activeFilters}
        activeFilterCount={activeFilterCount}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
      <ToolbarSearch value={searchValue} onChange={onSearchChange} />
    </div>
  );
}

function QuickFilters({
  groups,
  onFilterChange,
}: {
  groups: QuickFilterGroup[];
  onFilterChange?: (key: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabled = groups.length === 0 || !onFilterChange;

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

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        disabled={disabled}
        className="border border-outline-variant text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Filtri Rapidi
        <Icon name="expand_more" className="text-sm" />
      </button>
      {open && onFilterChange && (
        <QuickFiltersDropdown
          groups={groups}
          onSelect={(key, value) => {
            onFilterChange(key, value);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function QuickFiltersDropdown({
  groups,
  onSelect,
}: {
  groups: QuickFilterGroup[];
  onSelect: (key: string, value: string) => void;
}) {
  return (
    <div className="absolute left-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 py-2 z-50">
      {groups.map((group, groupIndex) => (
        <div key={group.title}>
          {groupIndex > 0 && <div className="h-px bg-outline-variant/30 my-2" />}
          <DropdownHeader>{group.title}</DropdownHeader>
          {group.options.map((option) => (
            <DropdownOption
              key={`${option.key}-${option.value}`}
              onClick={() => onSelect(option.key, option.value)}
              dotColor={option.dotColor}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DropdownHeader({ children }: { children: ReactNode }) {
  return <div className="px-3 py-2 text-[10px] font-bold text-outline uppercase tracking-wider">{children}</div>;
}

type DropdownOptionProps = {
  label: string;
  onClick: () => void;
  icon?: string;
  dotColor?: string;
};

function DropdownOption({ label, onClick, icon, dotColor }: DropdownOptionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-container-low text-body-sm transition-colors text-on-surface group text-left"
    >
      {dotColor && <span className={`w-2 h-2 rounded-full ${dotColor}`} />}
      {icon && <Icon name={icon} className="text-[18px] text-outline group-hover:text-primary" />}
      {label}
    </button>
  );
}

function FilterMenu({
  filters,
  activeFilters,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}: {
  filters: ToolbarFilter[];
  activeFilters: ToolbarFilters;
  activeFilterCount: number;
  onFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabled = filters.length === 0 || !onFilterChange;

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
        <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-outline-variant/30 p-4 z-50">
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
            {filters.map((filter) => (
              <label key={filter.key} className="flex flex-col gap-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant">{filter.label}</span>
                <select
                  value={activeFilters[filter.key] ?? ''}
                  onChange={(event) => onFilterChange(filter.key, event.target.value)}
                  className="border border-outline-variant rounded-lg bg-surface px-3 py-2 text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Tutti</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarSearch({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
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
