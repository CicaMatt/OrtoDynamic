import { describe, expect, it } from 'vitest';

import { serializeCsv } from '../../../src/shared/files/downloadCsv';

describe('serializeCsv', () => {
  it('writes UTF-8 CSV with escaped cells and CRLF rows', () => {
    const csv = serializeCsv(
      ['Nome', 'Note'],
      [
        ['Mario, Rossi', 'Riga "uno"\nriga due'],
        ['Èva', ''],
      ],
    );

    expect(csv).toBe(
      '\uFEFF"Nome","Note"\r\n' + '"Mario, Rossi","Riga ""uno""\nriga due"\r\n' + '"Èva",""\r\n',
    );
  });

  it('neutralizes values that spreadsheet applications could execute as formulas', () => {
    const csv = serializeCsv(['Valore'], [['=1+1'], [' +SUM(A1:A2)'], ['testo']]);

    expect(csv).toContain(`"'=1+1"`);
    expect(csv).toContain(`"' +SUM(A1:A2)"`);
    expect(csv).toContain('"testo"');
  });
});
