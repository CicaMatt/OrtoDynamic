import { EntityEditProvider } from './app/editing/EntityEditContext';
import { NavigationProvider } from './app/navigation/NavigationContext';
import { AppLayout } from './app/layout/AppLayout';

export function App() {
  return (
    <EntityEditProvider>
      <NavigationProvider>
        <AppLayout />
      </NavigationProvider>
    </EntityEditProvider>
  );
}
