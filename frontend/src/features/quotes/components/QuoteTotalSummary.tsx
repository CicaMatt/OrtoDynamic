import { formatEuro } from '../../../shared/format/format';
import { FieldValue } from '../../../shared/ui/FieldValue';

export function QuoteTotalSummary({ total }: { total: string }) {
  return (
    <div className="mt-[20px] border-t border-surface-variant pt-[18px] text-center">
      <div className="font-label-caps text-label-caps font-bold uppercase text-outline">Totale</div>
      <div className="mt-[6px] font-headline-md text-headline-md font-bold text-on-surface">
        <FieldValue value={formatEuro(total)} />
      </div>
    </div>
  );
}
