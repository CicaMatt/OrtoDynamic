import { Icon } from '../ui/Icon';

export type DetailAction = {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  onClick?: () => void;
};

export function DetailActionsCard({ title, actions }: { title: string; actions: DetailAction[] }) {
  return (
    <section className="rounded-[10px] border border-surface-variant bg-white px-[24px] py-[25px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-outline">{title}</h3>

      <div className="mt-[22px] space-y-[8px]">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || !action.onClick}
            className={`flex h-[46px] w-full items-center gap-[18px] rounded-[6px] text-left font-body-md text-body-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              action.active
                ? 'bg-secondary/10 font-semibold text-secondary'
                : action.tone === 'danger'
                  ? 'text-error hover:bg-error/10'
                  : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <Icon
              name={action.icon}
              className={`text-[24px] ${action.tone === 'danger' ? 'text-error' : 'text-secondary'}`}
            />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
