import type { DashboardQuoteStatus } from '../quotes/types';

export type QuoteMetricDefinition = {
  status: DashboardQuoteStatus;
  label: string;
  icon: string;
};

export const quoteMetricDefinitions: ReadonlyArray<QuoteMetricDefinition> = [
  {
    status: 'INSERITO',
    label: 'Preventivi Inseriti',
    icon: 'note_add',
  },
  {
    status: 'INVIATO',
    label: 'Preventivi Inviati',
    icon: 'send',
  },
  {
    status: 'IN LAVORAZIONE',
    label: 'Preventivi In Lavorazione',
    icon: 'pending_actions',
  },
];
