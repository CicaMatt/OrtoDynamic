import { Icon } from './Icon';

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between mt-4 text-body-sm text-on-surface-variant px-2">
      <div>
        {rangeStart}–{rangeEnd} di {totalItems} risultati
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Pagina precedente"
          className="p-1 border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="chevron_left" className="text-[20px]" />
        </button>
        <span className="px-2">
          Pagina {page} di {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Pagina successiva"
          className="p-1 border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="chevron_right" className="text-[20px]" />
        </button>
      </div>
    </div>
  );
}
