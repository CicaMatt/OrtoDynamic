import { useCallback } from 'react';
import { useEntityEdit, useEntityEditor } from '../../app/editing/EntityEditContext';
import type { WorkOrderItemsParticipant } from '../../app/editing/editSession';

export function useWorkOrderEditor() {
  const editor = useEntityEditor('workOrder');
  const { supplement } = useEntityEdit();
  return {
    ...editor,
    setItemsParticipant: useCallback(
      (participant: WorkOrderItemsParticipant | null) =>
        supplement({ type: 'set-work-order-items', participant }),
      [supplement],
    ),
  };
}
