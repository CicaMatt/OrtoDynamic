const MISSING_LABEL = 'N/D';

/**
 * Render a field/column value, falling back to a grayed "N/D" when the value is
 * missing (empty or whitespace-only). Used across table and detail views so the
 * missing state looks the same everywhere.
 */
export function FieldValue({ value }: { value: string }) {
  if (value.trim() === '') {
    return <span className="text-outline">{MISSING_LABEL}</span>;
  }
  return <>{value}</>;
}
