import { EditInput } from '../../../shared/entity/DataCard';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { Icon } from '../../../shared/ui/Icon';
import type { Product } from '../../products/types';
import type { QuoteItemDraft } from '../types';
import { ProductSearchField } from './ProductSearchField';
import { isAcceptableDiscountInput, previewAmount } from './quoteItemMath';

/** Read-only, derived cell (prezzo/importo) shown muted to mark it non-editable. */
export function DerivedValue({ value }: { value: string }) {
  return (
    <span className="font-body-md text-body-md text-outline">
      <FieldValue value={value} />
    </span>
  );
}

const TONE_CLASS = {
  neutral: 'text-outline hover:text-on-surface hover:bg-black/5',
  confirm: 'text-[#1a7f37] hover:bg-[#1a7f37]/10',
  danger: 'text-outline hover:text-error hover:bg-error/10',
} as const;

export function IconButton({
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

export function NewItemButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-[6px] rounded-[6px] bg-primary-container px-[12px] py-[6px] font-body-sm text-body-sm font-medium text-on-primary transition-colors hover:bg-on-primary-fixed-variant disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Icon name="add" className="text-[18px]" />
      Nuovo
    </button>
  );
}

export function MessageRow({
  colSpan,
  tone = 'muted',
  children,
}: {
  colSpan: number;
  tone?: 'muted' | 'error';
  children: string;
}) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <tr>
      <td colSpan={colSpan} className={`py-6 px-4 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}

/** The trailing confirm/cancel actions shared by the add and edit rows. */
function ConfirmCancelActions({
  submitting,
  canConfirm,
  onConfirm,
  onCancel,
}: {
  submitting: boolean;
  canConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-[4px]">
      <IconButton icon="close" title="Annulla" tone="danger" onClick={onCancel} disabled={submitting} />
      <IconButton
        icon="check"
        title="Conferma"
        tone="confirm"
        onClick={onConfirm}
        disabled={!canConfirm}
        busy={submitting}
      />
    </div>
  );
}

const NUMERIC_INPUTS = {
  /** Quantity cannot be negative; ignore any minus-signed input. */
  quantity: (value: string, set: (v: string) => void) => {
    if (!value.startsWith('-')) set(value);
  },
  /** Discount is a 1–100 percent; reject keystrokes outside that range. */
  discount: (value: string, set: (v: string) => void) => {
    if (isAcceptableDiscountInput(value)) set(value);
  },
} as const;

/**
 * Inline row for adding a new line: the product is picked from the live
 * `nomenclatore` lookup (by code or description, kept in sync), and only quantity
 * and discount are typed since prezzo and importo are derived.
 */
export function ItemDraftRow({
  draft,
  submitting,
  onField,
  onProductSelect,
  onConfirm,
  onCancel,
}: {
  draft: QuoteItemDraft;
  submitting: boolean;
  onField: (key: keyof QuoteItemDraft, value: string) => void;
  onProductSelect: (product: Product) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const canConfirm = draft.productId.trim() !== '' && !submitting;
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
        <EditInput
          type="number"
          min={0}
          value={draft.quantity}
          onChange={(value) => NUMERIC_INPUTS.quantity(value, (v) => onField('quantity', v))}
        />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={draft.price} />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={previewAmount(draft.price, draft.quantity, draft.discount)} />
      </td>
      <td className="py-3 px-4 align-top">
        <EditInput
          type="number"
          min={1}
          value={draft.discount}
          onChange={(value) => NUMERIC_INPUTS.discount(value, (v) => onField('discount', v))}
        />
      </td>
      <td className="py-3 px-4 align-top text-right">
        <ConfirmCancelActions
          submitting={submitting}
          canConfirm={canConfirm}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}

/**
 * Inline row for editing an existing line: the product and its prezzo are fixed
 * (shown read-only), and only quantity and discount are editable; importo is
 * previewed from the fixed prezzo, mirroring the backend recompute.
 */
export function ItemEditRow({
  draft,
  submitting,
  onField,
  onConfirm,
  onCancel,
}: {
  draft: QuoteItemDraft;
  submitting: boolean;
  onField: (key: keyof QuoteItemDraft, value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <tr className="border-b border-surface-variant last:border-0 bg-secondary/5">
      <td className="py-3 px-4 align-top whitespace-nowrap">
        <FieldValue value={draft.productId} />
      </td>
      <td className="py-3 px-4 align-top">
        <div className="max-w-[360px] whitespace-normal break-words">
          <FieldValue value={draft.description} />
        </div>
      </td>
      <td className="py-3 px-4 align-top">
        <EditInput
          type="number"
          min={0}
          value={draft.quantity}
          onChange={(value) => NUMERIC_INPUTS.quantity(value, (v) => onField('quantity', v))}
        />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={draft.price} />
      </td>
      <td className="py-3 px-4 align-top">
        <DerivedValue value={previewAmount(draft.price, draft.quantity, draft.discount)} />
      </td>
      <td className="py-3 px-4 align-top">
        <EditInput
          type="number"
          min={1}
          value={draft.discount}
          onChange={(value) => NUMERIC_INPUTS.discount(value, (v) => onField('discount', v))}
        />
      </td>
      <td className="py-3 px-4 align-top text-right">
        <ConfirmCancelActions
          submitting={submitting}
          canConfirm={!submitting}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}
