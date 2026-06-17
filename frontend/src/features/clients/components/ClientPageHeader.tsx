import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityPageHeader, type Crumb } from '../../../shared/entity/EntityPageHeader';
import { Icon } from '../../../shared/ui/Icon';

type ClientHeaderData = {
  name: string;
  surname: string;
  code: string;
};

export function ClientPageHeader({
  back,
  crumbs,
  client,
}: {
  back: { label: string; onClick: () => void };
  crumbs: Crumb[];
  client: ClientHeaderData;
}) {
  return (
    <EntityPageHeader
      back={back}
      crumbs={crumbs}
      title={`${client.name} ${client.surname}`.trim()}
      subtitle={
        <>
          Codice: <span className="font-semibold text-on-surface">{client.code}</span>
        </>
      }
      rightSlot={<ClientDataSwitchButton />}
    />
  );
}

function ClientDataSwitchButton() {
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
      className="inline-flex items-center gap-[8px] h-[40px] rounded-[6px] bg-secondary px-[16px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover transition-colors"
    >
      <Icon name={icon} className="text-[20px]" />
      {editing ? 'Modifica' : 'Visualizza'} {subject}
    </button>
  );
}
