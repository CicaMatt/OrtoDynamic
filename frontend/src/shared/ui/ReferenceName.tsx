import { useNavigation } from '../../app/navigation/NavigationContext';
import { FieldValue } from './FieldValue';

type ReferenceEntity = 'client' | 'doctor' | 'healthCompany' | 'product' | 'quote' | 'workOrder';

/**
 * Shows a linked entity's name with its id revealed on hover as a small label.
 * When `entity` is supplied the value becomes a read-mode navigation control.
 */
export function ReferenceName({
  name,
  id,
  entity,
}: {
  name: string;
  id: string;
  entity?: ReferenceEntity;
}) {
  const navigation = useNavigation();
  const trimmedId = id.trim();
  const open = entity
    ? {
        client: navigation.openClientDetail,
        doctor: navigation.openDoctorDetail,
        healthCompany: navigation.openHealthCompanyDetail,
        product: navigation.openProductDetail,
        quote: navigation.openQuoteDetail,
        workOrder: navigation.openWorkOrderDetail,
      }[entity]
    : undefined;
  const content = (
    <>
      <FieldValue value={name} />
      {trimmedId !== '' && (
        <span className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden whitespace-nowrap rounded-lg bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface shadow-md group-hover:block">
          ID: {id}
        </span>
      )}
    </>
  );

  if (open && trimmedId !== '') {
    return (
      <button
        type="button"
        onClick={() => open(trimmedId)}
        className="group relative inline-block max-w-full cursor-pointer text-left text-inherit underline-offset-2 hover:underline focus:outline-none focus:ring-1 focus:ring-outline"
      >
        {content}
      </button>
    );
  }

  return (
    <span className="group relative inline-block">
      {content}
    </span>
  );
}
