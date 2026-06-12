import { markRequired, optionsFromValues, type FieldConfig } from '../../../shared/entity/DataCard';
import type { FieldSectionConfig } from '../../../shared/entity/FieldSectionCard';
import type { Quote } from '../types';

type QuoteField = FieldConfig<Quote>;

// Stored verbatim in `tipologia_preventivo` — values must match the database exactly.
const typeOptions = optionsFromValues(['Asl', 'Inail', 'Privato']);
const yesNoOptions = optionsFromValues(['Si', 'No']);

/**
 * Fields the create form requires. `clientId` is filled by the Cliente lookup
 * (rendered separately); the rest are marked required in the field sections.
 * `status` is intentionally absent — the server assigns it (INSERITO).
 */
export const QUOTE_CREATE_REQUIRED = [
  'clientId',
  'quoteType',
  'diagnosis',
  'therapeuticProgram',
  'detailedPrescription',
] as const satisfies readonly (keyof Quote)[];

const identityFields: QuoteField[] = markRequired(
  [
    { label: 'Nº Preventivo', key: 'quoteNumber' },
    { label: 'Tipologia', key: 'quoteType', type: 'select', options: typeOptions },
    { label: 'Data Creazione', key: 'creationDate', type: 'date' },
    { label: 'Data Preventivo', key: 'quoteDate', type: 'date' },
    { label: 'Totale', key: 'total', type: 'number' },
  ],
  ['quoteType'],
);

const clinicalFields: QuoteField[] = markRequired(
  [
    { label: 'Diagnosi Circostanziata', key: 'diagnosis', type: 'textarea' },
    { label: 'Programma Terapeutico', key: 'therapeuticProgram', type: 'textarea' },
    { label: 'Prescrizione Dettagliata Protesi', key: 'detailedPrescription', type: 'textarea' },
  ],
  ['diagnosis', 'therapeuticProgram', 'detailedPrescription'],
);

const authorizationFields: QuoteField[] = [
  { label: 'Nº Autorizzazione', key: 'authorizationNumber' },
  { label: 'Data Accettazione', key: 'acceptanceDate', type: 'date' },
  { label: 'Data Ricezione Autorizzazione', key: 'authorizationReceiptDate', type: 'date' },
  { label: 'Giorni Scadenza', key: 'expiryDays' },
  { label: 'Massima Scadenza', key: 'maxExpiry' },
];

const supplyFields: QuoteField[] = [
  { label: 'Misure OK', key: 'measurementsOk', type: 'select', options: yesNoOptions },
  { label: 'Provvigioni Pagate', key: 'commissionsPaid', type: 'select', options: yesNoOptions },
  { label: 'Nº Ordine', key: 'orderNumber' },
  { label: 'Modello', key: 'model' },
  { label: 'Misure', key: 'measurements' },
  { label: 'Nº Fattura', key: 'invoiceNumber' },
];

const quoteTextFields: QuoteField[] = [{ label: 'Preventivo', key: 'quote', type: 'textarea' }];

const noteFields: QuoteField[] = [
  { label: 'Note', key: 'note', type: 'textarea' },
  { label: 'Note Private', key: 'privateNote', type: 'textarea' },
  { label: 'Note Finali', key: 'finalNote', type: 'textarea' },
];

/**
 * Sections shown in the quote create form, in order. The Cliente lookup and the
 * other reference fields (Medico, Inserito Da) are rendered separately, so they
 * are not part of these sections.
 */
export const quoteCreateSections: FieldSectionConfig<Quote>[] = [
  { icon: 'request_quote', title: 'Dati Preventivo', fields: identityFields },
  { icon: 'clinical_notes', title: 'Dati Clinici', fields: clinicalFields, columns: 1 },
  { icon: 'fact_check', title: 'Autorizzazione e Scadenze', fields: authorizationFields },
  { icon: 'receipt_long', title: 'Fornitura e Fatturazione', fields: supplyFields },
  { icon: 'description', title: 'Dettaglio Preventivo', fields: quoteTextFields, columns: 1 },
  { icon: 'sticky_note_2', title: 'Note', fields: noteFields, columns: 1 },
];
