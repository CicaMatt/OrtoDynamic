type CsvDownload = {
  filename: string;
  headers: ReadonlyArray<string>;
  rows: ReadonlyArray<ReadonlyArray<string>>;
};

/**
 * Serialize a table as an Excel-friendly UTF-8 CSV.
 *
 * The BOM lets Excel detect UTF-8 reliably. Cells that could be interpreted as
 * spreadsheet formulas are prefixed with an apostrophe to keep exported
 * user-entered data inert when the file is opened.
 */
export function serializeCsv(
  headers: ReadonlyArray<string>,
  rows: ReadonlyArray<ReadonlyArray<string>>,
): string {
  return `\uFEFF${[headers, ...rows].map(serializeRow).join('\r\n')}\r\n`;
}

/** Trigger a browser download for an in-memory CSV table. */
export function downloadCsv({ filename, headers, rows }: CsvDownload): void {
  const blob = new Blob([serializeCsv(headers, rows)], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function serializeRow(cells: ReadonlyArray<string>): string {
  return cells.map((cell) => quoteCell(neutralizeFormula(cell))).join(',');
}

function neutralizeFormula(value: string): string {
  return /^[\t\r ]*[=+\-@]/.test(value) ? `'${value}` : value;
}

function quoteCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}
