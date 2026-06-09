import { Icon } from '../../shared/ui/Icon';
import { useNavigation } from '../navigation/NavigationContext';
import type { View } from '../navigation/types';

type NavEntry = {
  view: View;
  icon: string;
  label: string;
  matches: View[];
};

const mainNav: NavEntry[] = [
  { view: 'dashboard', icon: 'dashboard', label: 'Dashboard', matches: ['dashboard'] },
  { view: 'clients', icon: 'group', label: 'Clienti', matches: ['clients', 'client-detail', 'client-orthopedic'] },
  { view: 'doctors', icon: 'medical_services', label: 'Medici', matches: ['doctors', 'doctor-detail'] },
  {
    view: 'health-companies',
    icon: 'local_hospital',
    label: 'Aziende Sanitarie',
    matches: ['health-companies', 'health-company-detail'],
  },
  { view: 'products', icon: 'inventory_2', label: 'Prodotti', matches: ['products'] },
  { view: 'quotes', icon: 'request_quote', label: 'Preventivi', matches: ['quotes'] },
  { view: 'work-orders', icon: 'engineering', label: 'Lavorazioni', matches: ['work-orders'] },
  { view: 'settings', icon: 'settings', label: 'Configurazioni', matches: ['settings'] },
  { view: 'employees', icon: 'badge', label: 'Gestione Dipendenti', matches: ['employees'] },
];

export function SideNavBar() {
  const { view, navigate } = useNavigation();

  return (
    <nav className="fixed left-0 top-0 h-full w-sidebar-width bg-primary-container flex flex-col border-r border-outline-variant/10 z-50">
      <BrandHeader />
      <UserBanner name="Raffaele Pepe" role="Amministratore" initials="RP" />
      <ul className="flex flex-col gap-2 flex-grow">
        {mainNav.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            active={item.matches.includes(view)}
            onClick={() => navigate(item.view)}
          />
        ))}
      </ul>
      <SideNavFooter />
    </nav>
  );
}

function BrandHeader() {
  return (
    <div className="p-6">
      <h1 className="font-headline-md text-headline-md font-bold text-on-primary">OrtoDynamic</h1>
    </div>
  );
}

function UserBanner({ name, role, initials }: { name: string; role: string; initials: string }) {
  return (
    <div className="px-6 py-5 flex items-center gap-4 border-b border-on-primary-fixed-variant mb-5">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-headline-md text-headline-md">
        {initials}
      </div>
      <div>
        <p className="text-[15px] leading-6 text-on-primary font-bold">{name}</p>
        <p className="font-body-sm text-body-sm text-on-primary-container">{role}</p>
      </div>
    </div>
  );
}

type NavItemProps = {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
};

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  const base =
    'flex items-center gap-3 text-left mx-2 py-2.5 text-[15px] leading-6 font-medium rounded-lg hover:bg-on-primary-fixed-variant/50 transition-colors duration-200';
  const tone = active
    ? 'text-on-primary bg-on-primary-fixed-variant'
    : 'text-[#9fafbf] hover:text-white';

  return (
    <li>
      <button className={`${base} px-4 ${tone}`} style={{ width: 'calc(100% - 1rem)' }} onClick={onClick}>
        <Icon name={icon} filled={active} className="text-[22px]" />
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

function SideNavFooter() {
  return (
    <div className="mt-auto pb-4">
      <ul className="flex flex-col gap-2">
        <FooterItem icon="settings" label="Impostazioni" />
      </ul>
    </div>
  );
}

function FooterItem({ icon, label }: { icon: string; label: string }) {
  return (
    <li>
      <button
        className="flex items-center gap-3 text-left text-[15px] leading-6 font-medium text-[#9fafbf] hover:text-white mx-2 px-4 py-2.5 rounded-lg hover:bg-on-primary-fixed-variant/50 transition-colors duration-200"
        style={{ width: 'calc(100% - 1rem)' }}
      >
        <Icon name={icon} className="text-[22px]" />
        {label}
      </button>
    </li>
  );
}
