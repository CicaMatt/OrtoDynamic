import { ReferenceLabel } from '../../shared/ui/ReferenceLabel';
import type { EntityKind } from '../editing/types';
import { useNavigation } from './NavigationContext';
import { entityDetailRoute } from './routes';

/** Adds application navigation to the shared, presentational reference label. */
export function EntityReference({
  name,
  id,
  entity,
}: {
  name: string;
  id: string;
  entity: EntityKind;
}) {
  const { navigate } = useNavigation();
  return (
    <ReferenceLabel
      name={name}
      id={id}
      onClick={() => navigate(entityDetailRoute(entity, id.trim()))}
    />
  );
}
