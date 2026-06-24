import { useEffect, useRef, useState } from 'react';
import { searchProducts } from '../../products/api/products';
import type { Product } from '../../products/types';

const baseInputClass =
  'w-full rounded-[6px] border bg-white px-[11px] py-[8px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1';
const validBorderClass = 'border-outline-variant focus:border-secondary focus:ring-secondary';
const invalidBorderClass = 'border-error focus:border-error focus:ring-error';

// Wait for the user to pause typing before hitting the API, so each keystroke
// does not fire its own request.
const SEARCH_DEBOUNCE_MS = 250;

/** Human-readable line for a result: its code and description, never the raw id. */
function describe(product: Product): string {
  return [product.code, product.description].filter(Boolean).join(' — ');
}

/**
 * Type-ahead picker for a `nomenclatore` row, fetched from the server per query
 * (unlike the shared {@link Autocomplete}, which filters a client-side list) as
 * the catalog is too large to ship to the client. The same endpoint matches the
 * id, code, and description, so this drives both the code and the description
 * fields of a quote line: `inputValueOf` maps the chosen product to the text
 * shown in the input (its code for one field, its description for the other) while
 * `onSelect` hands the full product back so the caller can fill the sibling.
 */
export function ProductSearchField({
  value,
  invalid = false,
  onSelect,
  placeholder = 'Cerca…',
  inputMode = 'text',
  inputValueOf = (product) => product.idProduct,
}: {
  /** Text currently shown in the input (the selected product's code or description). */
  value: string;
  invalid?: boolean;
  onSelect: (product: Product) => void;
  placeholder?: string;
  inputMode?: 'text' | 'numeric';
  /** Maps the chosen product to the text the input should display. */
  inputValueOf?: (product: Product) => string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reflect external value changes (reset after submit) in the input.
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced server search; a stale response is ignored once the query moves on.
  useEffect(() => {
    const needle = query.trim();
    if (!open || needle === '') {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    let active = true;
    const handle = window.setTimeout(() => {
      searchProducts(needle)
        .then((products) => {
          if (!active) return;
          setResults(products);
          setError(null);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (!active) return;
          setResults([]);
          setError(err instanceof Error ? err.message : 'Errore di ricerca.');
          setLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [query, open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

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

  const choose = (product: Product) => {
    onSelect(product);
    setQuery(inputValueOf(product));
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
        inputMode={inputMode}
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
          {loading ? (
            <li className="px-[11px] py-[8px] font-body-sm text-body-sm text-outline">Ricerca…</li>
          ) : error ? (
            <li className="px-[11px] py-[8px] font-body-sm text-body-sm text-error">{error}</li>
          ) : results.length === 0 ? (
            <li className="px-[11px] py-[8px] font-body-sm text-body-sm text-outline">
              Nessun risultato.
            </li>
          ) : (
            results.map((product, index) => (
              <li key={product.idProduct}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(product);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`block w-full px-[11px] py-[7px] text-left font-body-md text-body-md ${
                    index === activeIndex
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {describe(product)}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
