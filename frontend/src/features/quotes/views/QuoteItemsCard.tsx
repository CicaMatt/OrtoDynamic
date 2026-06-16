import { useState } from 'react';
import { DataCard, EditInput } from '../../../shared/entity/DataCard';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { Icon } from '../../../shared/ui/Icon';
import { useApiData } from '../../../shared/hooks/useApiData';
import type { Product } from '../../products/types';
import { createQuoteItem, deleteQuoteItem, fetchQuoteItems } from '../api/quotes';
import type { QuoteItem } from '../types';
import { ProductSearchField } from '../components/ProductSearchField';

/**
 * Editable draft of a new line. `productId`/`description`/`price` are filled
 * together from the chosen product (so the code and product fields always agree),
 * while `quantity` and `discount` are typed; `price` is shown read-only and the
 * importo is derived from it.
 */
type ItemDraft = {
  productId: string;
  description: string;
  price: string;
  quantity: string;
  discount: string;
};

/**
 * Read-mode columns in display order; the value is read straight off the item.
 * `wrap` lets a long cell (the product description) flow onto multiple lines
 * instead of forcing the row onto a single, ever-widening line.
 */
const READ_COLUMNS: ReadonlyArray<{ key: keyof QuoteItem; label: string; wrap?: boolean }> = [
  { key: 'productId', label: 'Codice Nomenclatore' },
  { key: 'productDescription', label: 'Prodotto', wrap: true },
  { key: 'quantity', label: 'Quantità' },
  { key: 'price', label: 'Prezzo' },
  { key: 'amount', label: 'Importo' },
  { key: 'discount', label: 'Sconto' },
];

const EMPTY_DRAFT: ItemDraft = { productId: '', description: '', price: '', quantity: '', discount: '' };

// One column per read column plus the trailing actions column.
const COLUMN_COUNT = READ_COLUMNS.length + 1;

/** Parse an amount input into the number the API expects, or `null` when blank. */
function toNullableNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** Live preview of importo (prezzo × quantità); blank until both are known. */
function previewAmount(price: string, quantity: string): string {
  const unitPrice = Number(price);
  const count = Number(quantity);
  if (price.trim() === '' || quantity.trim() === '' || !Number.isFinite(unitPrice) || !Number.isFinite(count)) {
    return '';
  }
  return String(Math.round(unitPrice * count * 100) / 100);
}

/**
 * A quote's line items (`item_preventivi`), with inline add and delete. "Nuovo"
 * opens an empty draft row: the product is picked from the live `nomenclatore`
 * lookup — by code or by description, each kept in sync with the other — and only
 * quantity and discount are typed, since prezzo (the product's price) and importo
 * (prezzo × quantità) are derived by the backend. Confirming creates the row
 * under this quote; each existing row can be removed via its trash icon.
 * Mutations refetch the list so the table always reflects the server.
 */
export function QuoteItemsCard({ quoteId }: { quoteId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const { data, loading, error } = useApiData(
    () => fetchQuoteItems(quoteId),
    [quoteId, reloadKey],
  );

  const [draft, setDraft] = useState<ItemDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const items = data ?? [];
  const busy = submitting || deletingId !== null;
  const canAdd = !loading && !error && draft === null && !busy;

  const setField = (key: keyof ItemDraft, value: string) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  // Picking from either the code or the product field fills both, plus the price.
  const selectProduct = (product: Product) =>
    setDraft((current) =>
      current
        ? { ...current, productId: product.id, description: product.description, price: product.price }
        : current,
    );

  const confirmDraft = async () => {
    if (!draft || draft.productId.trim() === '') return;
    setSubmitting(true);
    setActionError(null);
    try {
      await createQuoteItem(quoteId, {
        productId: Number(draft.productId),
        quantity: toNullableNumber(draft.quantity),
        discount: toNullableNumber(draft.discount),
      });
      setDraft(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Creazione articolo non riuscita.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm('Eliminare questo articolo dal preventivo?')) return;
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteQuoteItem(quoteId, id);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Eliminazione articolo non riuscita.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DataCard
      icon="inventory_2"
      title="Articoli Preventivo"
      action={
        <NewItemButton disabled={!canAdd} onClick={() => setDraft({ ...EMPTY_DRAFT })} />
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
            <tr>
              {READ_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="py-3 px-4 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
              <th className="py-3 px-4 w-px text-right uppercase font-bold tracking-wider">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <MessageRow>Caricamento articoli...</MessageRow>
            ) : error ? (
              <MessageRow tone="error">{error}</MessageRow>
            ) : (
              <>
                {items.length === 0 && draft === null && (
                  <MessageRow>Nessun articolo per questo preventivo.</MessageRow>
                )}
                {items.map((item) => (
                  <ReadRow
                    key={item.id}
                    item={item}
                    onDelete={() => removeItem(item.id)}
                    deleting={deletingId === item.id}
                    disabled={busy}
                  />
                ))}
                {draft && (
                  <DraftRow
                    draft={draft}
                    submitting={submitting}
                    onField={setField}
                    onProductSelect={selectProduct}
                    onConfirm={confirmDraft}
                    onCancel={() => setDraft(null)}
                  />
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {actionError && <p className="mt-[16px] font-body-sm text-body-sm text-error">{actionError}</p>}
    </DataCard>
  );
}

function ReadRow({
  item,
  onDelete,
  deleting,
  disabled,
}: {
  item: QuoteItem;
  onDelete: () => void;
  deleting: boolean;
  disabled: boolean;
}) {
  return (
    <tr className="border-b border-surface-variant last:border-0">
      {READ_COLUMNS.map((column) => (
        <td
          key={column.key}
          className={`py-3 px-4 ${column.wrap ? 'align-top' : 'whitespace-nowrap'}`}
        >
          {column.wrap ? (
            <div className="max-w-[360px] whitespace-normal break-words">
              <FieldValue value={item[column.key]} />
            </div>
          ) : (
            <FieldValue value={item[column.key]} />
          )}
        </td>
      ))}
      <td className="py-3 px-4 text-right">
        <IconButton
          icon="delete"
          title="Elimina articolo"
          tone="danger"
          onClick={onDelete}
          disabled={disabled}
          busy={deleting}
        />
      </td>
    </tr>
  );
}

function DraftRow({
  draft,
  submitting,
  onField,
  onProductSelect,
  onConfirm,
  onCancel,
}: {
  draft: ItemDraft;
  submitting: boolean;
  onField: (key: keyof ItemDraft, value: string) => void;
  onProductSelect: (product: Product) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const canConfirm = draft.productId.trim() !== '' && !submitting;
  // Quantity cannot be negative; ignore any minus-signed input.
  const handleQuantity = (value: string) => {
    if (!value.startsWith('-')) onField('quantity', value);
  };
  return (
    <tr className="border-b border-surface-variant last:border-0 bg-secondary/5">
      <td className="py-3 px-4 align-top min-w-[200px]">
        <ProductSearchField
          value={draft.productId}
          inputMode="numeric"
          placeholder="Cerca codice…"
          onSelect={onProductSelect}
        />
      </td>
      <td className="py-3 px-4 align-top min-w-[260px]">
        <ProductSearchField
          value={draft.description}
          placeholder="Cerca prodotto…"
          inputValueOf={(product) => product.description}
          onSelect={onProductSelect}
        />
      </td>
      <td className="py-3 px-4 align-top">
        <EditInput type="number" min={0} value={draft.quantity} onChange={handleQuantity} />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={draft.price} />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={previewAmount(draft.price, draft.quantity)} />
      </td>
      <td className="py-3 px-4 align-top">
        <EditInput
          type="number"
          value={draft.discount}
          onChange={(value) => onField('discount', value)}
        />
      </td>
      <td className="py-3 px-4 align-top text-right">
        <div className="flex items-center justify-end gap-[4px]">
          <IconButton
            icon="close"
            title="Annulla"
            tone="danger"
            onClick={onCancel}
            disabled={submitting}
          />
          <IconButton
            icon="check"
            title="Conferma"
            tone="confirm"
            onClick={onConfirm}
            disabled={!canConfirm}
            busy={submitting}
          />
        </div>
      </td>
    </tr>
  );
}

/** Read-only, derived cell (prezzo/importo) shown muted to mark it non-editable. */
function DerivedValue({ value }: { value: string }) {
  return (
    <span className="font-body-md text-body-md text-[#737780]">
      <FieldValue value={value} />
    </span>
  );
}

function MessageRow({ tone = 'muted', children }: { tone?: 'muted' | 'error'; children: string }) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <tr>
      <td colSpan={COLUMN_COUNT} className={`py-6 px-4 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}

function NewItemButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-[6px] rounded-[6px] border border-[#c9cdd4] px-[12px] py-[6px] font-body-sm text-body-sm font-medium text-secondary transition-colors hover:bg-secondary/5 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Icon name="add" className="text-[18px]" />
      Nuovo
    </button>
  );
}

const TONE_CLASS = {
  neutral: 'text-[#737780] hover:text-[#171a20] hover:bg-black/5',
  confirm: 'text-[#1a7f37] hover:bg-[#1a7f37]/10',
  danger: 'text-[#737780] hover:text-error hover:bg-error/10',
} as const;

function IconButton({
  icon,
  title,
  tone,
  onClick,
  disabled = false,
  busy = false,
}: {
  icon: string;
  title: string;
  tone: keyof typeof TONE_CLASS;
  onClick: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled || busy}
      className={`inline-flex h-[32px] w-[32px] items-center justify-center rounded-[6px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${TONE_CLASS[tone]}`}
    >
      <Icon name={busy ? 'progress_activity' : icon} className={`text-[20px] ${busy ? 'animate-spin' : ''}`} />
    </button>
  );
}
