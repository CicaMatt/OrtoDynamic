import { DataCard, EditInput } from './DataCard';
import { FieldValue } from '../ui/FieldValue';

export function NoteCard({
  title = 'Note',
  value,
  editing,
  onChange,
  className,
}: {
  title?: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <DataCard icon="sticky_note_2" title={title} className={className}>
      {editing ? (
        <EditInput type="textarea" value={value} onChange={onChange} />
      ) : (
        <p className="font-body-md text-body-md text-[#171a20] whitespace-pre-line">
          <FieldValue value={value} />
        </p>
      )}
    </DataCard>
  );
}
