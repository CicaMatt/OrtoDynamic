import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import { Icon } from '../../../shared/ui/Icon';
import { fetchQuoteDashboardMetrics } from '../../quotes/api/quotes';
import type { DashboardQuoteStatus } from '../../quotes/types';

const numberFormatter = new Intl.NumberFormat('it-IT');

type QuoteMetricDefinition = {
  status: DashboardQuoteStatus;
  statusLabel: string;
  icon: string;
};

const quoteMetricDefinitions: ReadonlyArray<QuoteMetricDefinition> = [
  { status: 'INSERITO', statusLabel: 'Inseriti', icon: 'note_add' },
  { status: 'INVIATO', statusLabel: 'Inviati', icon: 'send' },
  {
    status: 'IN LAVORAZIONE',
    statusLabel: 'In Lavorazione',
    icon: 'pending_actions',
  },
];

export function DashboardView() {
  const { navigate } = useNavigation();
  const { data, loading, error } = useApiData(fetchQuoteDashboardMetrics, []);

  return (
    <div className="max-w-[1440px]">
      <header className="mb-[28px] border-b border-surface-variant pb-[20px]">
        <h2 className="font-headline-lg text-headline-lg font-bold text-black">Dashboard</h2>
      </header>

      {error && (
        <p
          role="alert"
          className="mb-[18px] rounded-[8px] border border-error/30 bg-error-container px-[16px] py-[12px] font-body-md text-body-md text-on-error-container"
        >
          {error}
        </p>
      )}

      <section aria-labelledby="quote-metrics-heading">
        <h3
          id="quote-metrics-heading"
          className="mb-[14px] font-headline-md text-headline-md font-bold text-black"
        >
          Preventivi
        </h3>
        <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {quoteMetricDefinitions.map((definition) => (
            <QuoteMetricCard
              key={definition.status}
              definition={definition}
              count={data?.[definition.status]}
              loading={loading}
              onClick={() => navigate({ name: 'quotes', status: definition.status })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function QuoteMetricCard({
  definition,
  count,
  loading,
  onClick,
}: {
  definition: QuoteMetricDefinition;
  count?: number;
  loading: boolean;
  onClick: () => void;
}) {
  const value = count === undefined ? '—' : numberFormatter.format(count);
  const label = `Preventivi ${definition.statusLabel}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${loading ? 'caricamento' : value}. Apri elenco`}
      className="group relative flex min-h-[170px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[12px] border border-outline-variant/70 bg-white p-[24px] pb-[18px] text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-[0_10px_24px_rgba(7,29,49,0.10)] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[4px] bg-secondary" />
      <span className="flex items-start justify-between gap-[16px]">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[10px] bg-secondary/10 text-secondary">
          <Icon name={definition.icon} className="text-[25px]" />
        </span>
        <Icon
          name="arrow_forward"
          className="text-[22px] text-outline transition-transform group-hover:translate-x-1 group-hover:text-secondary"
        />
      </span>

      <span className="mt-auto flex w-full items-center justify-between gap-[18px] pt-[24px]">
        <span className="flex min-w-0 flex-col text-lg leading-[28px] text-on-surface">
          <span>Preventivi</span>
          <strong className="font-bold">{definition.statusLabel}</strong>
        </span>
        <span className="shrink-0 font-headline-lg text-[34px] font-bold leading-[38px] text-black">
          {loading ? (
            <span
              aria-hidden="true"
              className="inline-block h-[32px] w-[54px] animate-pulse rounded-[6px] bg-surface-container-high"
            />
          ) : (
            value
          )}
        </span>
      </span>
    </button>
  );
}
