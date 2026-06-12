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
 * Quote line item mirrored from the API (`item_preventivi`), linked to its
 * parent quote on the backend by `id_preventivo`. All-strings like {@link Quote}.
 * `productId` is the raw `codice_nomenclatore` reference (a `nomenclatore.id`).
 */
export type QuoteItem = {
  id: string;
  productId: string;
  quantity: string;
  price: string;
  amount: string;
  discount: string;
};
