import { useEntityEdit } from '../editing/EntityEditContext';
import { useNavigation } from '../navigation/NavigationContext';
import { entityDetailRoute, entityListRoute } from '../navigation/routes';

/** Floating Salva / Annulla bar shown while an entity is being edited or created. */
export function EditActionBar() {
  const { session, saving, error, save, cancel } = useEntityEdit();
  const { replace } = useNavigation();
  if (!session) return null;

  const creating = session.mode === 'create';

  const handleSave = async () => {
    // Apply a successful create's destination before the edit session closes,
    // so the create view never renders for one frame without its required draft.
    await save((created) => replace(entityDetailRoute(created.type, created.id)));
  };

  const handleCancel = () => {
    const creatingType = creating ? session.type : null;
    cancel();
    // Leaving a create form returns to the entity's list.
    if (creatingType) replace(entityListRoute(creatingType));
  };

  const saveLabel = saving ? 'Salvataggio…' : creating ? 'Crea' : 'Salva';

  return (
    <div className="fixed bottom-[24px] right-[32px] z-50 flex flex-col items-stretch gap-[10px] rounded-[10px] border border-surface-variant bg-white px-[12px] py-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      {error && <span className="max-w-[260px] font-body-sm text-body-sm text-error">{error}</span>}
      <button
        onClick={handleCancel}
        disabled={saving}
        className="h-[40px] min-w-[96px] rounded-[6px] border border-outline-variant px-[14px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
      >
        Annulla
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="h-[40px] min-w-[96px] rounded-[6px] bg-secondary px-[14px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </div>
  );
}
