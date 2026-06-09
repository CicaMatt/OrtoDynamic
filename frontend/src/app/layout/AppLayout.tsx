import { useNavigation } from '../navigation/NavigationContext';
import { SideNavBar } from './SideNavBar';
import { EditActionBar } from './EditActionBar';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { ClientsView } from '../../features/clients/views/ClientsView';
import { ClientDetailView } from '../../features/clients/views/ClientDetailView';
import { ClientOrthopedicView } from '../../features/clients/views/ClientOrthopedicView';
import { DoctorDetailView } from '../../features/doctors/views/DoctorDetailView';
import { DoctorsView } from '../../features/doctors/views/DoctorsView';
import { HealthCompaniesView } from '../../features/healthCompanies/views/HealthCompaniesView';
import { HealthCompanyDetailView } from '../../features/healthCompanies/views/HealthCompanyDetailView';
import { ProductDetailView } from '../../features/products/views/ProductDetailView';
import { ProductsView } from '../../features/products/views/ProductsView';
import { PlaceholderView } from '../../features/placeholders/PlaceholderView';

const placeholder = (title: string) => () => <PlaceholderView title={title} />;

const viewComponents = {
  dashboard: placeholder('Dashboard'),
  clients: ClientsView,
  doctors: DoctorsView,
  'health-companies': HealthCompaniesView,
  products: ProductsView,
  quotes: placeholder('Preventivi'),
  settings: placeholder('Configurazioni'),
  employees: placeholder('Gestione Dipendenti'),
  'work-orders': placeholder('Lavorazioni'),
  'client-detail': ClientDetailView,
  'client-orthopedic': ClientOrthopedicView,
  'doctor-detail': DoctorDetailView,
  'health-company-detail': HealthCompanyDetailView,
  'product-detail': ProductDetailView,
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
