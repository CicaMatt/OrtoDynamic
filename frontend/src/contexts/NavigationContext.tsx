import { createContext, useContext, useState, type ReactNode } from 'react';
import type { View } from '../types';
import { useClientEdit } from './ClientEditContext';

type NavigationValue = {
  view: View;
  selectedWorkOrderId: string | null;
  selectedClientCode: string | null;
  navigate: (view: View) => void;
  openWorkDetail: (orderId: string) => void;
  openClientDetail: (clientCode: string) => void;
  /** Target of a navigation blocked by unsaved edits (drives the confirm dialog). */
  pendingView: View | null;
  keepAndContinue: () => void;
  discardAndContinue: () => void;
  dismissPending: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

const isClientView = (view: View) => view === 'client-detail' || view === 'client-orthopedic';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const edit = useClientEdit();
  const [view, setView] = useState<View>('dashboard');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [selectedClientCode, setSelectedClientCode] = useState<string | null>(null);
  const [pendingView, setPendingView] = useState<View | null>(null);

  const applyNavigate = (next: View) => {
    setView(next);
    if (next !== 'work-detail') setSelectedWorkOrderId(null);
    if (next !== 'client-detail' && next !== 'client-orthopedic') setSelectedClientCode(null);
  };

  const navigate = (next: View) => {
    // Moving between the client detail/orthopedic pair stays within the edit session.
    if (edit.editing && !isClientView(next)) {
      if (edit.isDirty) {
        setPendingView(next);
        return;
      }
      edit.cancel();
    }
    applyNavigate(next);
  };

  const openWorkDetail = (orderId: string) => {
    setSelectedWorkOrderId(orderId);
    setView('work-detail');
  };

  const openClientDetail = (clientCode: string) => {
    setSelectedClientCode(clientCode);
    setView('client-detail');
  };

  const keepAndContinue = async () => {
    const target = pendingView;
    const saved = await edit.save();
    setPendingView(null);
    if (saved && target) applyNavigate(target);
  };

  const discardAndContinue = () => {
    const target = pendingView;
    edit.cancel();
    setPendingView(null);
    if (target) applyNavigate(target);
  };

  const dismissPending = () => setPendingView(null);

  return (
    <NavigationContext.Provider
      value={{
        view,
        selectedWorkOrderId,
        selectedClientCode,
        navigate,
        openWorkDetail,
        openClientDetail,
        pendingView,
        keepAndContinue,
        discardAndContinue,
        dismissPending,
      }}
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
