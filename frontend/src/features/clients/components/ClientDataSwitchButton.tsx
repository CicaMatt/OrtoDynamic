import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { Icon } from '../../../shared/ui/Icon';

/**
 * Toggles between the client detail and orthopedic views. Lives in both
 * headers; its target and label follow the current view and edit mode
 * ("Visualizza" when reading, "Modifica" when editing).
 */
export function ClientDataSwitchButton() {
  const { view, navigate } = useNavigation();
  const { editing } = useEntityEdit();

  const toOrthopedic = view === 'client-detail';
  const target = toOrthopedic ? 'client-orthopedic' : 'client-detail';
  const subject = toOrthopedic ? 'Dati Ortopedici' : 'Dati Cliente';
  const icon = toOrthopedic ? 'medical_services' : 'person';

  return (
    <button
      type="button"
      onClick={() => navigate(target)}
      className="inline-flex items-center gap-[8px] h-[40px] rounded-[6px] bg-secondary px-[16px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-container transition-colors"
    >
      <Icon name={icon} className="text-[20px]" />
      {editing ? 'Modifica' : 'Visualizza'} {subject}
    </button>
  );
}
