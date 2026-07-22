import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ViewToolbar } from '../../../src/shared/ui/ViewToolbar';

describe('ViewToolbar', () => {
  it('drives creation, search, fixed filters, ranked suggestions, and clearing', () => {
    const onCreate = vi.fn();
    const onSearchChange = vi.fn();
    const onFilterChange = vi.fn();
    const onClearFilters = vi.fn();

    render(
      <ViewToolbar
        searchValue="Ada"
        onSearchChange={onSearchChange}
        onCreate={onCreate}
        filters={[
          { key: 'status', label: 'Stato', options: ['ATTIVO', 'SOSPESO'], fixedChoices: true },
          {
            key: 'city',
            label: 'Città',
            options: ['Roma Centro', 'Provincia di Roma', 'Aroma'],
          },
        ]}
        activeFilters={{ status: 'ATTIVO', city: '' }}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Nuovo/ }));
    fireEvent.change(screen.getByPlaceholderText('Cerca...'), { target: { value: 'Rossi' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtra/ }));
    fireEvent.change(screen.getByLabelText('Stato'), { target: { value: 'SOSPESO' } });

    const city = screen.getByLabelText('Città');
    fireEvent.change(city, { target: { value: 'roma' } });
    const suggestions = screen.getAllByRole('button', { name: /Roma|Aroma/ });
    expect(suggestions.map((button) => button.textContent)).toEqual([
      'Roma Centro',
      'Provincia di Roma',
      'Aroma',
    ]);
    fireEvent.click(screen.getByRole('button', { name: 'Provincia di Roma' }));
    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi' }));

    expect(onCreate).toHaveBeenCalledOnce();
    expect(onSearchChange).toHaveBeenCalledWith('Rossi');
    expect(onFilterChange).toHaveBeenCalledWith('status', 'SOSPESO');
    expect(onFilterChange).toHaveBeenCalledWith('city', 'Provincia di Roma');
    expect(onClearFilters).toHaveBeenCalledOnce();
  });

  it('disables unavailable filtering/search and closes an open menu outside', () => {
    const { rerender } = render(<ViewToolbar />);

    expect((screen.getByRole('button', { name: /Filtra/ }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByPlaceholderText('Cerca...') as HTMLInputElement).disabled).toBe(true);

    rerender(
      <ViewToolbar
        filters={[{ key: 'status', label: 'Stato', options: ['ATTIVO'] }]}
        onFilterChange={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Filtra/ }));
    expect(screen.getByText('Filtri')).toBeTruthy();
    fireEvent.click(document.body);
    expect(screen.queryByText('Filtri')).toBeNull();
  });
});
