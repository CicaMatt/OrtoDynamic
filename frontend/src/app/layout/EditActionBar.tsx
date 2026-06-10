import { useEntityEdit } from '../editing/EntityEditContext';
import { useNavigation } from '../navigation/NavigationContext';

/** Floating Salva / Annulla bar shown while an entity is being edited or created. */
export function EditActionBar() {
  const { editing, mode, editTarget, saving, saveError, save, cancel } = useEntityEdit();
  const { openEntityDetail, goToEntityList } = useNavigation();
  if (!editing) return null;

  const creating = mode === 'create';

  const handleSave = async () => {
    const result = await save();
    // On a successful create, land on the new record's detail view.
    if (result.ok && result.created) {
      openEntityDetail(result.created.type, result.created.id);
    }
  };

  const handleCancel = () => {
    const creatingType = creating ? editTarget?.type : null;
    cancel();
    // Leaving a create form returns to the entity's list.
    if (creatingType) goToEntityList(creatingType);
  };

  const saveLabel = saving ? 'Salvataggio…' : creating ? 'Crea' : 'Salva';

  return (
    <div className="fixed bottom-[24px] right-[32px] z-50 flex items-center gap-[14px] rounded-[10px] border border-[#e2e6ec] bg-white px-[18px] py-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      {saveError && <span className="max-w-[260px] font-body-sm text-body-sm text-error">{saveError}</span>}
      <button
        onClick={handleCancel}
        disabled={saving}
        className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
      >
        Annulla
      </button>
      <button
        onClick={handleSave}
        disabled={saving}
        className="h-[40px] rounded-[6px] bg-secondary px-[20px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-container disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </div>
  );
}
