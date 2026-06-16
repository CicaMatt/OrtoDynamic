import { Icon } from '../../shared/ui/Icon';
import { useAuth } from '../../features/auth/AuthContext';
import type { AuthUser } from '../../features/auth/types';
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
  { view: 'clients', icon: 'group', label: 'Clienti', matches: ['clients', 'client-detail', 'client-orthopedic', 'client-create'] },
  { view: 'doctors', icon: 'medical_services', label: 'Medici', matches: ['doctors', 'doctor-detail', 'doctor-create'] },
  {
    view: 'health-companies',
    icon: 'local_hospital',
    label: 'Aziende Sanitarie',
    matches: ['health-companies', 'health-company-detail', 'health-company-create'],
  },
  { view: 'products', icon: 'inventory_2', label: 'Prodotti', matches: ['products', 'product-detail', 'product-create'] },
  { view: 'quotes', icon: 'request_quote', label: 'Preventivi', matches: ['quotes', 'quote-detail'] },
  { view: 'work-orders', icon: 'engineering', label: 'Lavorazioni', matches: ['work-orders', 'work-order-detail'] },
  { view: 'settings', icon: 'settings', label: 'Configurazioni', matches: ['settings'] },
  { view: 'employees', icon: 'badge', label: 'Gestione Dipendenti', matches: ['employees'] },
];

/**
 * Permanent navigation rail on large viewports; an off-canvas drawer below `lg`,
 * shown when `open` and dismissed via the backdrop or after a navigation.
 */
export function SideNavBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { view, navigate } = useNavigation();
  const { user, logout } = useAuth();

  // Selecting a destination (or logging out) also dismisses the mobile drawer.
  const handleNavigate = (next: View) => {
    navigate(next);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`fixed left-0 top-0 h-full w-sidebar-width bg-primary-container flex flex-col border-r border-outline-variant/10 z-50 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <BrandHeader />
        <UserBanner user={user} />
        <ul className="flex flex-col gap-2 flex-grow">
          {mainNav.map((item) => (
            <NavItem
              key={item.view}
              icon={item.icon}
              label={item.label}
              active={item.matches.includes(view)}
              onClick={() => handleNavigate(item.view)}
            />
          ))}
        </ul>
        <SideNavFooter onLogout={handleLogout} />
      </nav>
    </>
  );
}

function BrandHeader() {
  return (
    <div className="p-6">
      <h1 className="font-headline-md text-headline-md font-bold text-on-primary">OrtoDynamic</h1>
    </div>
  );
}

/** First letters of the first two words, or the first two characters of a single word. */
function initialsOf(text: string): string {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return text.trim().slice(0, 2).toUpperCase();
}

function UserBanner({ user }: { user: AuthUser | null }) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const primary = fullName || user?.username || '';
  const secondary = fullName ? `@${user?.username}` : user?.email || '';
  const initials = primary ? initialsOf(primary) : '';

  return (
    <div className="px-6 py-5 flex items-center gap-4 border-b border-on-primary-fixed-variant mb-5">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-headline-md text-headline-md">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-[15px] leading-6 text-on-primary font-bold truncate">{primary}</p>
        <p className="font-body-sm text-body-sm text-on-primary-container truncate">{secondary}</p>
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

function SideNavFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="mt-auto pb-4">
      <ul className="flex flex-col gap-2">
        <FooterItem icon="logout" label="Logout" onClick={onLogout} />
      </ul>
    </div>
  );
}

function FooterItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center gap-3 text-left text-[15px] leading-6 font-medium text-[#9fafbf] hover:text-white mx-2 px-4 py-2.5 rounded-lg hover:bg-on-primary-fixed-variant/50 transition-colors duration-200"
        style={{ width: 'calc(100% - 1rem)' }}
      >
        <Icon name={icon} className="text-[22px]" />
        {label}
      </button>
    </li>
  );
}
