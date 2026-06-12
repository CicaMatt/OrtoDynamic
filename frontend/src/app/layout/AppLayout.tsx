import { useNavigation } from '../navigation/NavigationContext';
import { SideNavBar } from './SideNavBar';
import { EditActionBar } from './EditActionBar';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { ClientsView } from '../../features/clients/views/ClientsView';
import { ClientDetailView } from '../../features/clients/views/ClientDetailView';
import { ClientCreateView } from '../../features/clients/views/ClientCreateView';
import { ClientOrthopedicView } from '../../features/clients/views/ClientOrthopedicView';
import { DoctorDetailView } from '../../features/doctors/views/DoctorDetailView';
import { DoctorCreateView } from '../../features/doctors/views/DoctorCreateView';
import { DoctorsView } from '../../features/doctors/views/DoctorsView';
import { HealthCompaniesView } from '../../features/healthCompanies/views/HealthCompaniesView';
import { HealthCompanyDetailView } from '../../features/healthCompanies/views/HealthCompanyDetailView';
import { HealthCompanyCreateView } from '../../features/healthCompanies/views/HealthCompanyCreateView';
import { ProductDetailView } from '../../features/products/views/ProductDetailView';
import { ProductCreateView } from '../../features/products/views/ProductCreateView';
import { ProductsView } from '../../features/products/views/ProductsView';
import { QuotesView } from '../../features/quotes/views/QuotesView';
import { QuoteDetailView } from '../../features/quotes/views/QuoteDetailView';
import { QuoteCreateView } from '../../features/quotes/views/QuoteCreateView';
import { WorkOrdersView } from '../../features/workOrders/views/WorkOrdersView';
import { WorkOrderDetailView } from '../../features/workOrders/views/WorkOrderDetailView';
import { PlaceholderView } from '../../features/placeholders/PlaceholderView';

const placeholder = (title: string) => () => <PlaceholderView title={title} />;

const viewComponents = {
  dashboard: placeholder('Dashboard'),
  clients: ClientsView,
  doctors: DoctorsView,
  'health-companies': HealthCompaniesView,
  products: ProductsView,
  quotes: QuotesView,
  settings: placeholder('Configurazioni'),
  employees: placeholder('Gestione Dipendenti'),
  'work-orders': WorkOrdersView,
  'client-detail': ClientDetailView,
  'client-orthopedic': ClientOrthopedicView,
  'client-create': ClientCreateView,
  'doctor-detail': DoctorDetailView,
  'doctor-create': DoctorCreateView,
  'health-company-detail': HealthCompanyDetailView,
  'health-company-create': HealthCompanyCreateView,
  'product-detail': ProductDetailView,
  'product-create': ProductCreateView,
  'quote-detail': QuoteDetailView,
  'quote-create': QuoteCreateView,
  'work-order-detail': WorkOrderDetailView,
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
