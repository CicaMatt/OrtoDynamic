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
