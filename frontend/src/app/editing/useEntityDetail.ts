import { useEffect, useRef } from 'react';
import { useApiData } from '../../shared/hooks/useApiData';
import { useEntityEdit, type EntityKind } from './EntityEditContext';

type UseEntityDetailParams<T> = {
  type: EntityKind;
  selectedId: string | null;
  fetcher: (id: string) => Promise<T>;
  missingMessage: string;
  draft: T | null;
  seed: (entity: T) => void;
};

/**
 * Loads a detail, seeds its active edit session, and substitutes the draft while editing.
 */
export function useEntityDetail<T>({
  type,
  selectedId,
  fetcher,
  missingMessage,
  draft,
  seed,
}: UseEntityDetailParams<T>) {
  const { session, dataVersion } = useEntityEdit();
  const seedRef = useRef(seed);
  seedRef.current = seed;

  const isEditing = session?.type === type && session.id === selectedId;

  const {
    data: entity,
    loading,
    error,
    reload,
  } = useApiData(
    () => (selectedId ? fetcher(selectedId) : Promise.reject(new Error(missingMessage))),
    [selectedId, dataVersion],
  );

  useEffect(() => {
    if (isEditing && entity) seedRef.current(entity);
  }, [isEditing, entity]);

  const data = isEditing && draft ? draft : entity;

  return { data, loading, error, isEditing, reload };
}
