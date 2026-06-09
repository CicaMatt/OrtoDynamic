import { useNavigation } from '../navigation/NavigationContext';
import { SideNavBar } from './SideNavBar';
import { EditActionBar } from './EditActionBar';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { ClientsView } from '../../features/clients/views/ClientsView';
import { ClientDetailView } from '../../features/clients/views/ClientDetailView';
import { ClientOrthopedicView } from '../../features/clients/views/ClientOrthopedicView';
import { DoctorDetailView } from '../../features/doctors/views/DoctorDetailView';
import { DoctorsView } from '../../features/doctors/views/DoctorsView';
import { PlaceholderView } from '../../features/placeholders/PlaceholderView';

const placeholder = (title: string) => () => <PlaceholderView title={title} />;

const viewComponents = {
  dashboard: placeholder('Dashboard'),
  clients: ClientsView,
  doctors: DoctorsView,
  'health-companies': placeholder('Aziende Sanitarie'),
  products: placeholder('Prodotti'),
  quotes: placeholder('Preventivi'),
  settings: placeholder('Configurazioni'),
  employees: placeholder('Gestione Dipendenti'),
  'work-orders': placeholder('Lavorazioni'),
  'client-detail': ClientDetailView,
  'client-orthopedic': ClientOrthopedicView,
  'doctor-detail': DoctorDetailView,
} as const;

export function AppLayout() {
  const { view } = useNavigation();
  const ActiveView = viewComponents[view];

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <SideNavBar />
      <main className="ml-sidebar-width w-[calc(100%-theme(spacing.sidebar-width))] min-h-screen p-container-padding">
        <ActiveView />
      </main>
      <EditActionBar />
      <UnsavedChangesDialog />
    </div>
  );
}
