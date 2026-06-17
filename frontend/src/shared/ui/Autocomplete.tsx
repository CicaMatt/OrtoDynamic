import { useEffect, useMemo, useRef, useState } from 'react';

/** A pickable option; `meta` carries extra data the consumer needs on select. */
export type AutocompleteOption = { value: string; label: string; meta?: Record<string, string> };

const baseInputClass =
  'w-full rounded-[6px] border bg-white px-[11px] py-[8px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1';
const validBorderClass = 'border-outline-variant focus:border-secondary focus:ring-secondary';
const invalidBorderClass = 'border-error focus:border-error focus:ring-error';

const MAX_RESULTS = 50;

/**
 * Search-and-pick combobox over a fixed option list. The bound `value` is only
 * changed by selecting an option (free text is a filter, discarded on blur), so
 * callers can rely on the value always being a real list entry.
 */
export function Autocomplete({
  value,
  options,
  onSelect,
  invalid = false,
  placeholder = 'Cerca…',
  emptyLabel = 'Nessun risultato.',
}: {
  value: string;
  options: ReadonlyArray<AutocompleteOption>;
  onSelect: (option: AutocompleteOption) => void;
  invalid?: boolean;
  placeholder?: string;
  /** Message shown when the query matches no option. */
  emptyLabel?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reflect external value changes (seed, reset, programmatic fill) in the input.
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open, value]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const matches: AutocompleteOption[] = [];
    for (const option of options) {
      if (option.label.toLowerCase().includes(needle)) {
        matches.push(option);
        if (matches.length >= MAX_RESULTS) break;
      }
    }
    return matches;
  }, [query, options]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const choose = (option: AutocompleteOption) => {
    onSelect(option);
    setQuery(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      else setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      if (open && results[activeIndex]) {
        event.preventDefault();
        choose(results[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setQuery(value);
    }
  };

  const inputClass = `${baseInputClass} ${invalid ? invalidBorderClass : validBorderClass}`;
  const showDropdown = open && query.trim() !== '';

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={inputClass}
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 max-h-[260px] w-full overflow-auto rounded-[6px] border border-outline-variant bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {results.length === 0 ? (
            <li className="px-[11px] py-[8px] font-body-sm text-body-sm text-outline">
              {emptyLabel}
            </li>
          ) : (
            results.map((option, index) => (
              <li key={`${option.value}-${option.meta?.province ?? index}`}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(option);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`block w-full px-[11px] py-[7px] text-left font-body-md text-body-md ${
                    index === activeIndex ? 'bg-secondary/10 text-secondary' : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
