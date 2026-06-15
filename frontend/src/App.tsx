import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LoginView } from './features/auth/views/LoginView';
import { EntityEditProvider } from './app/editing/EntityEditContext';
import { NavigationProvider } from './app/navigation/NavigationContext';
import { AppLayout } from './app/layout/AppLayout';

export function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

/** Renders the app only for an authenticated session; otherwise the login screen. */
function AuthGate() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-body-md text-body-md text-on-surface-variant">Caricamento…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <LoginView />;
  }

  return (
    <EntityEditProvider>
      <NavigationProvider>
        <AppLayout />
      </NavigationProvider>
    </EntityEditProvider>
  );
}
