import { ClientDataSwitchButton } from './ClientDataSwitchButton';
import { EntityPageHeader, type Crumb } from '../../../shared/entity/EntityPageHeader';

export function ClientPageHeader({
  back,
  crumbs,
  name,
  surname,
  code,
}: {
  back: { label: string; onClick: () => void };
  crumbs: Crumb[];
  name: string;
  surname: string;
  code: string;
}) {
  return (
    <EntityPageHeader
      back={back}
      crumbs={crumbs}
      title={`${name} ${surname}`.trim()}
      subtitle={
        <>
          Codice: <span className="font-semibold text-[#343942]">{code}</span>
        </>
      }
      rightSlot={<ClientDataSwitchButton />}
    />
  );
}
