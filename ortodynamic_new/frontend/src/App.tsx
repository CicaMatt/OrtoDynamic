import { NavigationProvider } from './contexts/NavigationContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <NavigationProvider>
      <AppLayout />
    </NavigationProvider>
  );
}
