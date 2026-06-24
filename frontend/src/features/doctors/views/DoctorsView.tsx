import { fetchDoctors } from '../api/doctors';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import type { DoctorListItem } from '../types';

const doctorColumns: ReadonlyArray<EntityColumn<DoctorListItem>> = [
  { key: 'idDoctor', label: 'ID Medico', primary: true, filterable: false  },
  { key: 'surname', label: 'Cognome' },
  { key: 'name', label: 'Nome' },
  { key: 'address', label: 'Indirizzo', muted: true },
  { key: 'phone', label: 'Telefono', muted: true },
  { key: 'email', label: 'Email', muted: true },
];

export function DoctorsView() {
  const { openDoctorDetail, openDoctorCreate } = useNavigation();

  return (
    <EntityListView
      title="Medici"
      columns={doctorColumns}
      fetchItems={fetchDoctors}
      rowKey={(doctor) => doctor.idDoctor}
      onRowClick={(doctor) => openDoctorDetail(doctor.idDoctor)}
      onCreate={openDoctorCreate}
      loadingLabel="Caricamento medici..."
      emptyLabel="Nessun medico trovato."
    />
  );
}
