import { ClientEditProvider } from './contexts/ClientEditContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <ClientEditProvider>
      <NavigationProvider>
        <AppLayout />
      </NavigationProvider>
    </ClientEditProvider>
  );
}
