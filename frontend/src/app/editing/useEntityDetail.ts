import { useCallback, useEffect, useState } from 'react';
import { useApiData } from '../../shared/hooks/useApiData';
import { useEntityEdit, type EntityKind } from './EntityEditContext';

type UseEntityDetailParams<T> = {
  /** Discriminator identifying this entity in the edit context. */
  type: EntityKind;
  /** The selected record's id from navigation (null when nothing is selected). */
  selectedId: string | null;
  /** Loads the full record by id. */
  fetcher: (id: string) => Promise<T>;
  /** Error surfaced when no record is selected. */
  missingMessage: string;
  /** This entity's edit draft, from the edit context. */
  draft: T | null;
  /** Seeds this entity's draft when an edit session for this record begins. */
  seed: (entity: T) => void;
};

type EntityDetail<T> = {
  /** The edit draft while editing this record, otherwise the fetched record (null until loaded). */
  data: T | null;
  loading: boolean;
  error: string | null;
  /** True when the active edit session targets exactly this record. */
  isEditing: boolean;
  /** Refetch the record — e.g. after a guarded status change applied elsewhere. */
  reload: () => void;
};

/**
 * Drives a detail view's read lifecycle, shared by every entity detail view:
 *
 * - fetches the selected record (re-fetching after any save via `dataVersion`,
 *   or on demand via `reload`),
 * - reports whether this exact record is the one being edited,
 * - seeds the edit draft once when an edit session begins, and
 * - surfaces the draft in place of the server copy while editing.
 *
 * Each view supplies only the entity-specific pieces (its type, fetcher, draft,
 * and seed); all the load/seed/draft wiring lives here.
 */
export function useEntityDetail<T>({
  type,
  selectedId,
  fetcher,
  missingMessage,
  draft,
  seed,
}: UseEntityDetailParams<T>): EntityDetail<T> {
  const { editing, editTarget, dataVersion } = useEntityEdit();
  const [reloadKey, setReloadKey] = useState(0);

  const isEditing = editing && editTarget?.type === type && editTarget.id === selectedId;

  const { data: entity, loading, error } = useApiData(
    () => (selectedId ? fetcher(selectedId) : Promise.reject(new Error(missingMessage))),
    [selectedId, dataVersion, reloadKey],
  );

  useEffect(() => {
    if (isEditing && entity) seed(entity);
  }, [isEditing, entity, seed]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const data = isEditing && draft ? draft : entity;

  return { data, loading, error, isEditing, reload };
}
