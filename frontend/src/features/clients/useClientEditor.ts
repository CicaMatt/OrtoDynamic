import { useCallback } from 'react';
import { useEntityEdit, useEntityEditor } from '../../app/editing/EntityEditContext';
import type { ClientOrthopedic } from './types';

export function useClientEditor() {
  const editor = useEntityEditor('client');
  const { supplement } = useEntityEdit();
  return {
    ...editor,
    orthopedicDraft: editor.session?.orthopedic?.draft ?? null,
    seedOrthopedic: useCallback(
      (draft: ClientOrthopedic) => supplement({ type: 'seed-client-orthopedic', draft }),
      [supplement],
    ),
    changeOrthopedic: (key: keyof ClientOrthopedic, value: string) =>
      supplement({ type: 'change-client-orthopedic', key, value }),
  };
}
