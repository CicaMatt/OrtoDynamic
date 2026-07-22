import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  FieldSectionCard,
  markRequired,
  optionsFromValues,
  type FieldConfig,
} from '../../../src/shared/entity/EntityFields';

type Example = {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  status: string;
  notes: string;
  clientId: string;
};

const data: Example = {
  id: '7',
  name: 'Ada',
  birthDate: '1980-01-02',
  gender: 'F',
  status: 'LEGACY',
  notes: 'Nota iniziale',
  clientId: '21',
};

const fields: FieldConfig<Example>[] = [
  {
    label: 'ID',
    key: 'id',
    readonly: true,
    renderValue: (value) => <strong>Record {value}</strong>,
  },
  { label: 'Nome', key: 'name', required: true },
  { label: 'Nascita', key: 'birthDate', type: 'date' },
  { label: 'Sesso', key: 'gender', type: 'gender' },
  {
    label: 'Stato',
    key: 'status',
    type: 'select',
    options: optionsFromValues(['ATTIVO', 'SOSPESO']),
  },
  { label: 'Note', key: 'notes', type: 'textarea' },
  { label: 'Cliente', key: 'clientId', type: 'autocomplete' },
];

describe('EntityFields', () => {
  it('formats read values and marks only declared required fields', () => {
    const required = markRequired(fields, ['name', 'clientId']);

    render(
      <FieldSectionCard
        icon="person"
        title="Dati"
        data={data}
        fields={required}
        editing={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Record 7').tagName).toBe('STRONG');
    expect(screen.getByText('2 Gennaio 1980')).toBeTruthy();
    expect(screen.getByText('Femminile')).toBeTruthy();
    expect(screen.getByText('Nome').textContent).toContain('*');
    expect(screen.getByText('Cliente').textContent).toContain('*');
    expect(screen.getByText('ID').textContent).not.toContain('*');
  });

  it('edits each input kind, preserves legacy select values, and keeps readonly fields fixed', () => {
    const onChange = vi.fn();
    const onClientSelect = vi.fn();

    render(
      <FieldSectionCard
        icon="person"
        title="Dati"
        data={data}
        fields={fields}
        editing
        invalidKeys={['name', 'clientId']}
        onChange={onChange}
        autocompleteFields={{
          clientId: {
            options: [
              { value: 'Ada Rossi', label: 'Ada Rossi', meta: { id: '21' } },
              { value: 'Luca Bianchi', label: 'Luca Bianchi', meta: { id: '22' } },
            ],
            displayValue: (id) => (id === '21' ? 'Ada Rossi' : ''),
            selectValue: (option) => option.meta?.id ?? '',
            onSelect: onClientSelect,
          },
        }}
      />,
    );

    expect(screen.getByText('Record 7')).toBeTruthy();
    expect(screen.queryByDisplayValue('7')).toBeNull();

    fireEvent.change(screen.getByDisplayValue('Ada'), { target: { value: 'Ada Maria' } });
    fireEvent.change(screen.getByDisplayValue('1980-01-02'), {
      target: { value: '1981-03-04' },
    });
    fireEvent.change(screen.getByDisplayValue('Femminile'), { target: { value: 'M' } });
    fireEvent.change(screen.getByDisplayValue('LEGACY'), { target: { value: 'ATTIVO' } });
    fireEvent.change(screen.getByDisplayValue('Nota iniziale'), {
      target: { value: 'Nota aggiornata' },
    });

    const clientInput = screen.getByDisplayValue('Ada Rossi');
    fireEvent.change(clientInput, { target: { value: 'Luca' } });
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Luca Bianchi' }));

    expect(onChange).toHaveBeenCalledWith('name', 'Ada Maria');
    expect(onChange).toHaveBeenCalledWith('birthDate', '1981-03-04');
    expect(onChange).toHaveBeenCalledWith('gender', 'M');
    expect(onChange).toHaveBeenCalledWith('status', 'ATTIVO');
    expect(onChange).toHaveBeenCalledWith('notes', 'Nota aggiornata');
    expect(onChange).toHaveBeenCalledWith('clientId', '22');
    expect(onClientSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'Luca Bianchi' }));
  });
});
