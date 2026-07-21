import type { ReactNode } from 'react';
import { DataCard } from '../../../shared/entity/DataCard';
import { ScrollableTable } from '../../../shared/entity/ScrollableTable';
import { TableMessageRow } from '../../../shared/entity/TableMessageRow';
import { formatEuro, formatInteger } from '../../../shared/format/format';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { EntityReference } from '../../../app/navigation/EntityReference';
import type { QuoteItem, QuoteItemDraft } from '../types';
import { IconButton } from './QuoteItemRow';
import { previewAmount } from './quoteItemMath';
import { QuoteTotalSummary } from './QuoteTotalSummary';

const TABLE_SURFACE_CLASS =
  'rounded-xl border border-outline-variant/50 bg-surface-container-low transition-[padding] duration-200 ease-out';
const TABLE_SURFACE_DROPDOWN_SPACE_CLASS = `${TABLE_SURFACE_CLASS} pb-[340px]`;

export const PERSISTED_ITEM_COLUMN_LABELS = [
  'Codice Prodotto',
  'Descrizione',
  'Quantità',
  'Prezzo',
  'Importo',
  'Sconto',
] as const;

const DRAFT_ITEM_COLUMN_LABELS = [
  'Codice Nomenclatore',
  'Prodotto',
  'Quantità',
  'Prezzo',
  'Importo',
  'Sconto',
] as const;
const ITEM_COLUMN_COUNT = DRAFT_ITEM_COLUMN_LABELS.length + 1;

type TableMessage = {
  content: ReactNode;
  tone?: 'muted' | 'error';
};

/** Shared quote-owned card, table header, status row, dropdown space, and total. */
export function QuoteItemsTable({
  action,
  expanded,
  columnLabels = DRAFT_ITEM_COLUMN_LABELS,
  message,
  actionError,
  total,
  children,
}: {
  action: ReactNode;
  expanded: boolean;
  columnLabels?: ReadonlyArray<string>;
  message?: TableMessage;
  actionError: string | null;
  total: string;
  children: ReactNode;
}) {
  return (
    <DataCard icon="inventory_2" title="Articoli Preventivo" action={action}>
      <ScrollableTable
        surfaceClassName={expanded ? TABLE_SURFACE_DROPDOWN_SPACE_CLASS : TABLE_SURFACE_CLASS}
      >
        <table className="w-full bg-white text-left font-body-md text-body-md">
          <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
            <tr>
              {columnLabels.map((label) => (
                <th
                  key={label}
                  className="py-3 px-4 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  {label}
                </th>
              ))}
              <th className="py-3 px-4 w-px text-right uppercase font-bold tracking-wider">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {message && (
              <TableMessageRow columnCount={ITEM_COLUMN_COUNT} tone={message.tone}>
                {message.content}
              </TableMessageRow>
            )}
            {children}
          </tbody>
        </table>
      </ScrollableTable>

      {actionError && (
        <p className="mt-[16px] font-body-sm text-body-sm text-error">{actionError}</p>
      )}
      <QuoteTotalSummary total={total} />
    </DataCard>
  );
}

const PERSISTED_ITEM_COLUMNS: ReadonlyArray<{
  key: keyof QuoteItem;
  wrap?: boolean;
  format?: (raw: string) => string;
}> = [
  { key: 'productCode' },
  { key: 'productDescription', wrap: true },
  { key: 'quantity', format: formatInteger },
  { key: 'price', format: formatEuro },
  { key: 'amount', format: formatEuro },
  { key: 'discount' },
];

export function PersistedQuoteItemRow({
  item,
  onEdit,
  onDelete,
  deleting,
  disabled,
}: {
  item: QuoteItem;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  disabled: boolean;
}) {
  return (
    <tr className="border-b border-surface-variant last:border-0 hover:bg-surface-container-low transition-colors duration-300">
      {PERSISTED_ITEM_COLUMNS.map((column) => {
        const raw = item[column.key];
        const value = column.format ? column.format(raw) : raw;
        const content =
          column.key === 'productCode' || column.key === 'productDescription' ? (
            <EntityReference name={value} id={item.productId} entity="product" />
          ) : (
            <FieldValue value={value} />
          );
        return (
          <td
            key={column.key}
            className={`py-3 px-4 ${column.wrap ? 'align-top' : 'whitespace-nowrap'}`}
          >
            {column.wrap ? (
              <div className="max-w-[360px] whitespace-normal break-words">{content}</div>
            ) : (
              content
            )}
          </td>
        );
      })}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-[4px]">
          <IconButton
            icon="edit"
            title="Modifica articolo"
            tone="neutral"
            onClick={onEdit}
            disabled={disabled}
          />
          <IconButton
            icon="delete"
            title="Elimina articolo"
            tone="danger"
            onClick={onDelete}
            disabled={disabled}
            busy={deleting}
          />
        </div>
      </td>
    </tr>
  );
}

/** A confirmed pending item: read-only values plus its local remove action. */
export function PendingQuoteItemRow({
  item,
  onDelete,
}: {
  item: QuoteItemDraft;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-surface-variant last:border-0 hover:bg-surface-container-low transition-colors duration-300">
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.code} />
      </td>
      <td className="py-3 px-4 align-top">
        <div className="max-w-[360px] whitespace-normal break-words">
          <FieldValue value={item.description} />
        </div>
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.quantity} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={formatEuro(item.price)} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={formatEuro(previewAmount(item.price, item.quantity, item.discount))} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.discount} />
      </td>
      <td className="py-3 px-4 text-right">
        <IconButton icon="delete" title="Rimuovi articolo" tone="danger" onClick={onDelete} />
      </td>
    </tr>
  );
}
