/**
 * Quote shape mirrored from the API (`preventivi`). Every field is a string —
 * the backend renders NULLs as empty strings and dates/numbers as text — so the
 * same type drives the list, the detail view, and the edit draft.
 */
export type Quote = {
  id: string;

  // Links
  clientId: string;
  doctorId: string;
  /** Display names for the linked client/doctor, resolved by the API (read-only). */
  clientName: string;
  doctorName: string;

  // Quote identity
  quoteNumber: string;
  quoteType: string;
  status: string;
  creationDate: string;
  quoteDate: string;
  total: string;
  entryBy: string;

  // Clinical data
  diagnosis: string;
  therapeuticProgram: string;
  detailedPrescription: string;

  // Authorization & deadlines
  authorizationNumber: string;
  acceptanceDate: string;
  authorizationReceiptDate: string;
  expiryDays: string;
  maxExpiry: string;

  // Supply & invoicing
  measurementsOk: string;
  commissionsPaid: string;
  orderNumber: string;
  model: string;
  measurements: string;
  invoiceNumber: string;

  // Free text
  quote: string;
  note: string;
  privateNote: string;
  finalNote: string;
};

/**
 * Allowed status transitions for a quote, returned by the transitions endpoint.
 * `available` lists the states the quote may move to next, per `stato_check`.
 */
export type QuoteStatusTransitions = {
  current: string;
  available: string[];
};

/**
 * Quote line item mirrored from the API (`item_preventivi`), linked to its
 * parent quote on the backend by `id_preventivo`. All-strings like {@link Quote}.
 * `productId` is the raw `codice_nomenclatore` reference (a `nomenclatore.id`).
 */
export type QuoteItem = {
  id: string;
  productId: string;
  /** The product's `descrizione`, joined from `nomenclatore` for display. */
  productDescription: string;
  quantity: string;
  price: string;
  amount: string;
  discount: string;
};

/**
 * Editable draft of a line item. `productId`/`description`/`price` are filled
 * together from the chosen product (so the code and product fields always agree),
 * while `quantity` and `discount` are typed; `price` is shown read-only and the
 * importo is derived from it. Drives both the inline "Nuovo" row and the create
 * form's pending-items list. All-strings, like the form values it backs.
 */
export type QuoteItemDraft = {
  productId: string;
  description: string;
  price: string;
  quantity: string;
  discount: string;
};

/**
 * Payload to create a {@link QuoteItem}. Only the client-controlled inputs are
 * sent: `productId` (the chosen `nomenclatore.id`, required) plus the optional
 * `quantity` and `discount` (`null` when left blank). `price` and `amount` are
 * derived from the product by the backend, and the parent `id_preventivo` is set
 * from the URL (existing quote) or assigned on create (new quote) — none of them
 * are sent here.
 */
export type QuoteItemCreate = {
  productId: number;
  quantity: number | null;
  discount: number | null;
};
