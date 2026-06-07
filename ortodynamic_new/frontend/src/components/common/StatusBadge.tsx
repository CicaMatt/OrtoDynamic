import type { WorkOrderStatus } from '../../types';

const workOrderStyles: Record<WorkOrderStatus, string> = {
  'IN LAVORAZIONE': 'bg-[#FFF4E5] text-[#B26E00] border-[#FFD085]',
  TERMINATO: 'bg-[#E6F4EA] text-[#137333] border-[#A1D7A8]',
  'IN ATTESA': 'bg-[#FCE8E6] text-[#C5221F] border-[#F6C2C0]',
};

export function WorkOrderBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${workOrderStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function ClientStatusBadge({ active }: { active: boolean }) {
  const tone = active ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant';
  const label = active ? 'Attivo' : 'Inattivo';
  return (
    <span className={`font-label-caps text-label-caps px-2 py-1 rounded-full uppercase ${tone}`}>
      {label}
    </span>
  );
}
