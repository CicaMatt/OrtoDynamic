import { FieldValue } from './FieldValue';

/**
 * Shows a linked entity's name with its id revealed on hover as a small label
 * beneath the text. Used in the quote and work order views to surface the
 * referenced client/doctor by name while keeping the underlying id discoverable.
 * Renders nothing extra when the id is missing, so an unset reference stays a
 * plain "N/D".
 */
export function ReferenceName({ name, id }: { name: string; id: string }) {
  return (
    <span className="group relative inline-block">
      <FieldValue value={name} />
      {id.trim() !== '' && (
        <span className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden whitespace-nowrap rounded-lg bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface shadow-md group-hover:block">
          ID: {id}
        </span>
      )}
    </span>
  );
}
