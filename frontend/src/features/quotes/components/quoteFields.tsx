import {
  markRequired,
  optionsFromValues,
  type FieldConfig,
} from '../../../shared/entity/DataCard';
import type { FieldSectionConfig } from '../../../shared/entity/FieldSectionCard';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import type { Quote } from '../types';

type QuoteField = FieldConfig<Quote>;

// Stored verbatim in `tipologia_preventivo` - values must match the database exactly.
const detailTypeOptions = optionsFromValues(['Asl', 'Privato', 'Inail']);
const createTypeOptions = optionsFromValues(['Asl', 'Inail', 'Privato']);
const yesNoOptions = optionsFromValues(['Si', 'No']);

/**
 * Fields the create form requires. `clientId` is filled by the Cliente lookup
 * (rendered separately); `status` is intentionally absent because the server
 * assigns it (INSERITO).
 */
export const QUOTE_CREATE_REQUIRED = [
  'clientId',
  'quoteType',
  'diagnosis',
  'detailedPrescription',
] as const satisfies readonly (keyof Quote)[];

// `status`, `total`, and `quote` are intentionally excluded: status changes via
// its guarded endpoint, total is server-derived, and quote has no form field.
export const QUOTE_EDITABLE_KEYS = [
  'clientId', 'doctorId', 'quoteNumber', 'quoteType', 'creationDate', 'quoteDate',
  'entryBy', 'diagnosis', 'therapeuticProgram', 'detailedPrescription',
  'authorizationNumber', 'acceptanceDate', 'authorizationReceiptDate', 'expiryDays', 'maxExpiry',
  'measurementsOk', 'commissionsPaid', 'orderNumber', 'model', 'measurements', 'invoiceNumber',
  'note', 'privateNote', 'finalNote',
] as const satisfies readonly (keyof Quote)[];

// `Stato` is read-only here: it changes only via the guarded status action.
const detailIdentityFields: QuoteField[] = [
  { label: 'ID', key: 'idQuote', readonly: true },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Tipologia', key: 'quoteType', type: 'select', options: detailTypeOptions },
  { label: 'Stato', key: 'status', readonly: true },
  { label: 'Data Preventivo', key: 'quoteDate', type: 'date' },
];

const createIdentityFields: QuoteField[] = markRequired(
  [
    { label: 'Tipologia', key: 'quoteType', type: 'select', options: createTypeOptions },
    { label: 'Data Creazione', key: 'creationDate', type: 'date' },
    { label: 'Data Preventivo', key: 'quoteDate', type: 'date' },
  ],
  ['quoteType'],
);

// In read mode the client/doctor show by name with their id revealed on hover.
const referenceFields: QuoteField[] = [
  {
    label: 'Cliente',
    key: 'clientId',
    type: 'autocomplete',
    renderValue: (id, quote) => <ReferenceName name={quote.clientName} id={id} entity="client" />,
  },
  {
    label: 'Medico',
    key: 'doctorId',
    type: 'autocomplete',
    renderValue: (id, quote) => <ReferenceName name={quote.doctorName} id={id} entity="doctor" />,
  },
  { label: 'Inserito Da', key: 'entryBy' },
];

const clinicalFields: QuoteField[] = [
  { label: 'Diagnosi Circostanziata', key: 'diagnosis', type: 'textarea' },
  { label: 'Prescrizione Dettagliata Protesi', key: 'detailedPrescription', type: 'textarea' },
];

const createClinicalFields: QuoteField[] = markRequired(clinicalFields, [
  'diagnosis',
  'detailedPrescription',
]);

const authorizationFields: QuoteField[] = [
  { label: 'Nº Autorizzazione', key: 'authorizationNumber' },
  { label: 'Data Accettazione', key: 'acceptanceDate', type: 'date' },
  { label: 'Data Ricezione Autorizzazione', key: 'authorizationReceiptDate', type: 'date' },
  { label: 'Giorni Massima Scadenza', key: 'expiryDays' },
  // Derived from Giorni Massima Scadenza (today + that many days), so not editable.
  { label: 'Data Massima Scadenza', key: 'maxExpiry', type: 'date', readonly: true },
];

const detailSupplyFields: QuoteField[] = [
  { label: 'Nº Ordine', key: 'orderNumber' },
  { label: 'Nº Fattura', key: 'invoiceNumber' },
  { label: 'Provvigioni Pagate', key: 'commissionsPaid', type: 'select', options: yesNoOptions },
  { label: 'Misure OK', key: 'measurementsOk', type: 'select', options: yesNoOptions },
  { label: 'Modello', key: 'model' },
  { label: 'Misure', key: 'measurements' },
];

const createSupplyFields: QuoteField[] = [
  { label: 'Misure OK', key: 'measurementsOk', type: 'select', options: yesNoOptions },
  { label: 'Provvigioni Pagate', key: 'commissionsPaid', type: 'select', options: yesNoOptions },
  { label: 'Nº Ordine', key: 'orderNumber' },
  { label: 'Modello', key: 'model' },
  { label: 'Misure', key: 'measurements' },
  { label: 'Nº Fattura', key: 'invoiceNumber' },
];

const noteFields: QuoteField[] = [
  { label: 'Note', key: 'note', type: 'textarea' },
  { label: 'Note Private', key: 'privateNote', type: 'textarea' },
  { label: 'Note Finali', key: 'finalNote', type: 'textarea' },
];

export const quoteDetailSectionsBeforeNotes: FieldSectionConfig<Quote>[] = [
  { icon: 'request_quote', title: 'Dati Preventivo', fields: detailIdentityFields },
  { icon: 'group', title: 'Riferimenti', fields: referenceFields },
  { icon: 'clinical_notes', title: 'Dati Clinici', fields: clinicalFields, columns: 1 },
  { icon: 'fact_check', title: 'Autorizzazione e Scadenze', fields: authorizationFields },
  { icon: 'receipt_long', title: 'Fornitura e Fatturazione', fields: detailSupplyFields },
];

export const quoteDetailNoteSections: FieldSectionConfig<Quote>[] = [
  { icon: 'sticky_note_2', title: 'Note', fields: noteFields, columns: 1 },
];

/**
 * Sections shown in the quote create form, in order. The Cliente lookup and the
 * other reference fields (Medico, Inserito Da) are rendered separately.
 */
export const quoteCreateSectionsBeforeNotes: FieldSectionConfig<Quote>[] = [
  { icon: 'request_quote', title: 'Dati Preventivo', fields: createIdentityFields },
  { icon: 'clinical_notes', title: 'Dati Clinici', fields: createClinicalFields, columns: 1 },
  { icon: 'fact_check', title: 'Autorizzazione e Scadenze', fields: authorizationFields },
  { icon: 'receipt_long', title: 'Fornitura e Fatturazione', fields: createSupplyFields },
];

export const quoteCreateNoteSections: FieldSectionConfig<Quote>[] = [
  { icon: 'sticky_note_2', title: 'Note', fields: noteFields, columns: 1 },
];
