import { useEntityEdit, useEntityEditor } from '../../app/editing/EntityEditContext';
import type { QuoteItemDraft } from './types';

export function useQuoteEditor() {
  const editor = useEntityEditor('quote');
  const { supplement } = useEntityEdit();
  return {
    ...editor,
    items: editor.session?.items ?? [],
    addItem: (draft: QuoteItemDraft) => supplement({ type: 'add-quote-item', draft }),
    removeItem: (index: number) => supplement({ type: 'remove-quote-item', index }),
  };
}
