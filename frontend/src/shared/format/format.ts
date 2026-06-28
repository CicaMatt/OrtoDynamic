const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

/** Format an ISO `YYYY-MM-DD` date as `D MMMM YYYY` in Italian (timezone-safe). */
export function formatBirthDate(value: string): string {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return `${day} ${MONTHS_IT[month - 1]} ${year}`;
}

/** Map the stored `M`/`F` gender code to its Italian label. */
export function formatGender(value: string): string {
  if (value === 'M') return 'Maschile';
  if (value === 'F') return 'Femminile';
  return value;
}

/**
 * Format a numeric string as Euros: a leading `€` followed by the amount with two
 * decimals (e.g. `€ 1250.5` → `€ 1250.50`). Blank stays blank so callers fall back
 * to "N/D"; a non-numeric value is returned untouched.
 */
export function formatEuro(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) return value;
  return `€ ${amount.toFixed(2)}`;
}

/**
 * Format a numeric string as a whole number, dropping any fractional part the
 * backend sends (e.g. `2.0` → `2`). Blank stays blank so callers fall back to
 * "N/D"; a non-numeric value is returned untouched.
 */
export function formatInteger(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) return value;
  return String(Math.round(amount));
}

/**
 * Today's date as an ISO `YYYY-MM-DD` string in the local timezone — the format
 * `date` inputs bind to and the API's DateFields parse. Built from local parts
 * (not `toISOString`, which is UTC) so it never lands on the wrong day near
 * midnight in timezones behind UTC.
 */
export function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add `days` to an ISO `YYYY-MM-DD` date, returning the result as ISO. Computed
 * with local `Date` arithmetic so month/year rollovers are handled and the result
 * stays on the intended day regardless of timezone. Returns '' for an unparseable
 * base date.
 */
export function addDaysIso(baseIso: string, days: number): string {
  const [year, month, day] = baseIso.split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const resultYear = date.getFullYear();
  const resultMonth = String(date.getMonth() + 1).padStart(2, '0');
  const resultDay = String(date.getDate()).padStart(2, '0');
  return `${resultYear}-${resultMonth}-${resultDay}`;
}

/** Trim long table cells while keeping the full value available in detail views. */
export function previewText(value: string): string {
  const maxLength = 60;
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}…` : trimmed;
}
