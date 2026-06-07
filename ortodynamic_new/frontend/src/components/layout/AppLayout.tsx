import { useNavigation } from '../../contexts/NavigationContext';
import { SideNavBar } from './SideNavBar';
import { DashboardView } from '../../views/DashboardView';
import { ClientsView } from '../../views/ClientsView';
import { WorkOrdersView } from '../../views/WorkOrdersView';
import { WorkDetailView } from '../../views/WorkDetailView';
import { ClientDetailView } from '../../views/ClientDetailView';
import { EmployeesView } from '../../views/EmployeesView';
import { PlaceholderView } from '../../views/PlaceholderView';

const viewComponents = {
  dashboard: DashboardView,
  clients: ClientsView,
  doctors: () => <PlaceholderView title="Medici" />,
  'health-companies': () => <PlaceholderView title="Aziende Sanitarie" />,
  products: () => <PlaceholderView title="Prodotti" />,
  quotes: () => <PlaceholderView title="Preventivi" />,
  settings: () => <PlaceholderView title="Configurazioni" />,
  employees: EmployeesView,
  'work-orders': WorkOrdersView,
  'client-detail': ClientDetailView,
  'work-detail': WorkDetailView,
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
    </div>
  );
}
