import { FieldValue } from './FieldValue';

/** Presentational entity label with an id tooltip and optional activation. */
export function ReferenceLabel({
  name,
  id,
  onClick,
}: {
  name: string;
  id: string;
  onClick?: () => void;
}) {
  const trimmedId = id.trim();
  const content = (
    <>
      <FieldValue value={name} />
      {trimmedId !== '' && (
        <span className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden whitespace-nowrap rounded-lg bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface shadow-md group-hover:block">
          ID: {id}
        </span>
      )}
    </>
  );

  if (onClick && trimmedId !== '') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group relative inline-block max-w-full cursor-pointer text-left text-inherit underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-outline"
      >
        {content}
      </button>
    );
  }

  return <span className="group relative inline-block">{content}</span>;
}
