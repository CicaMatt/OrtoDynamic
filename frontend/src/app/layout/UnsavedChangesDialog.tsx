import { useEntityEdit } from '../editing/EntityEditContext';
import { useNavigation } from '../navigation/NavigationContext';

/** Confirm dialog shown when navigating away from unsaved entity edits. */
export function UnsavedChangesDialog() {
  const { pendingView, keepAndContinue, discardAndContinue, dismissPending } = useNavigation();
  const { saving } = useEntityEdit();
  if (!pendingView) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={dismissPending}
    >
      <div
        className="w-[440px] max-w-full rounded-[12px] bg-white p-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-headline-md text-headline-md font-bold text-black">Modifiche non salvate</h3>
        <p className="mt-[10px] font-body-md text-body-md text-on-surface-variant">
          Ci sono modifiche non salvate. Vuoi mantenerle o scartarle?
        </p>
        <div className="mt-[24px] flex justify-end gap-[12px]">
          <button
            onClick={discardAndContinue}
            disabled={saving}
            className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
          >
            Scarta modifiche
          </button>
          <button
            onClick={() => keepAndContinue()}
            disabled={saving}
            className="h-[40px] rounded-[6px] bg-secondary px-[20px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover disabled:opacity-50"
          >
            {saving ? 'Salvataggio…' : 'Mantieni modifiche'}
          </button>
        </div>
      </div>
    </div>
  );
}
