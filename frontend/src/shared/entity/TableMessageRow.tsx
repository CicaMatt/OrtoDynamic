import type { ReactNode } from 'react';

/**
 * A full-width table row carrying a single centered message (loading, empty, or
 * error), spanning every column. Shared by the list/table surfaces so the
 * placeholder states look identical everywhere.
 */
export function TableMessageRow({
  columnCount,
  tone = 'muted',
  children,
}: {
  columnCount: number;
  tone?: 'muted' | 'error';
  children: ReactNode;
}) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <tr>
      <td colSpan={columnCount} className={`p-6 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}
