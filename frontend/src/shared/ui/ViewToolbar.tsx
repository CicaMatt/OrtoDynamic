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
          className="bg-secondary text-on-secondary font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 border border-transparent hover:bg-secondary-hover transition-colors"
        >
          <Icon name="add" className="text-sm" />
          Nuovo
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
        </div>
      )}
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

/**
 * Ranks how well an option matches a search term, lower being more relevant:
 * 0 the option starts with the term, 1 a word inside it starts with the term,
 * 2 the term appears somewhere inside. `null` means no match. Inputs must be
 * lower-cased by the caller. The split is Unicode-aware so accented letters and
 * digits count as word characters.
 */
function matchRank(option: string, term: string): number | null {
  if (option.startsWith(term)) return 0;
  if (option.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(term))) return 1;
  return option.includes(term) ? 2 : null;
}

/**
 * A single column filter: a search box that suggests the column's existing
 * values as the user types, and applies a substring filter on submit (Enter,
 * the search button, or picking a suggestion) so partial phrases match too.
 */
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

  // Mirror the committed value when it changes outside the input — notably when
  // "Rimuovi" clears every filter at once.
  useEffect(() => setDraft(value), [value]);

  const suggestions = useMemo(() => {
    const term = draft.trim().toLowerCase();
    // Nothing typed yet: offer no suggestions rather than the whole column.
    if (!term) return [];
    return options
      .map((option) => ({ option, lower: option.toLowerCase() }))
      .map((entry) => ({ ...entry, rank: matchRank(entry.lower, term) }))
      .filter(
        (entry): entry is { option: string; lower: string; rank: number } =>
          // A value typed in full has nothing left to suggest.
          entry.rank !== null && entry.lower !== term,
      )
      // Most relevant first: prefix, then word-start, then substring. `options`
      // arrives alphabetically sorted and the sort is stable, so values keep
      // that order within each rank.
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
              // A hairline rule splits values that start with the term (and
              // word-start matches) from those that merely contain it.
              const startsSubstringGroup =
                entry.rank === 2 && index > 0 && suggestions[index - 1].rank < 2;
              return (
                <li
                  key={entry.option}
                  className={startsSubstringGroup ? 'mt-1 pt-1 border-t border-outline-variant/30' : undefined}
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
