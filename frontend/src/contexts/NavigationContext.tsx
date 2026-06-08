import { createContext, useContext, useState, type ReactNode } from 'react';
import type { View } from '../types';

type NavigationValue = {
  view: View;
  selectedWorkOrderId: string | null;
  selectedClientCode: string | null;
  navigate: (view: View) => void;
  openWorkDetail: (orderId: string) => void;
  openClientDetail: (clientCode: string) => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('dashboard');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [selectedClientCode, setSelectedClientCode] = useState<string | null>(null);

  const navigate = (next: View) => {
    setView(next);
    if (next !== 'work-detail') setSelectedWorkOrderId(null);
    if (next !== 'client-detail') setSelectedClientCode(null);
  };

  const openWorkDetail = (orderId: string) => {
    setSelectedWorkOrderId(orderId);
    setView('work-detail');
  };

  const openClientDetail = (clientCode: string) => {
    setSelectedClientCode(clientCode);
    setView('client-detail');
  };

  return (
    <NavigationContext.Provider
      value={{ view, selectedWorkOrderId, selectedClientCode, navigate, openWorkDetail, openClientDetail }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used inside NavigationProvider');
  return ctx;
}
