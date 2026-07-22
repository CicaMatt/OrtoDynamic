import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DocumentErrorAlert } from '../../../src/shared/files/DocumentActions';
import { presentBlobInWindow } from '../../../src/shared/files/openBlob';
import { useInlineDocument } from '../../../src/shared/files/useInlineDocument';

function DocumentHarness({ fetcher }: { fetcher: () => Promise<{ blob: Blob }> }) {
  const document = useInlineDocument<'scheda'>();
  return (
    <>
      <button onClick={() => document.open('scheda', fetcher)}>
        {document.generating ? 'Generazione…' : 'Apri scheda'}
      </button>
      {document.error && (
        <DocumentErrorAlert error={document.error} onClose={document.clearError} />
      )}
    </>
  );
}

describe('inline documents', () => {
  const createObjectURL = vi.fn(() => 'blob:document');
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
  });

  it('opens a tab immediately and loads the generated blob into it', async () => {
    const popup = { location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
    const fetcher = vi.fn().mockResolvedValue({ blob: new Blob(['pdf']) });

    render(<DocumentHarness fetcher={fetcher} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apri scheda' }));

    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(screen.getByRole('button', { name: 'Generazione…' })).toBeTruthy();
    await waitFor(() => expect(popup.location.href).toBe('blob:document'));
    expect(fetcher).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Apri scheda' })).toBeTruthy();
  });

  it('closes the popup, reports failures, and lets the user dismiss the error', async () => {
    const popup = { location: { href: '' }, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
    const fetcher = vi.fn().mockRejectedValue(new Error('Documento non disponibile.'));

    render(<DocumentHarness fetcher={fetcher} />);
    fireEvent.click(screen.getByRole('button', { name: 'Apri scheda' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Documento non disponibile.');
    expect(popup.close).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Chiudi' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('falls back to opening the object URL when the initial popup was blocked', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);

    presentBlobInWindow(null, new Blob(['pdf']));

    expect(open).toHaveBeenCalledWith('blob:document', '_blank', 'noopener');
  });
});
