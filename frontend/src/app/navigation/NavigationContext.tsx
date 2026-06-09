import { createContext, useContext, useState, type ReactNode } from 'react';
import type { View } from './types';
import { useEntityEdit } from '../editing/EntityEditContext';

type NavigationValue = {
  view: View;
  selectedClientCode: string | null;
  selectedDoctorId: string | null;
  selectedHealthCompanyId: string | null;
  selectedProductId: string | null;
  navigate: (view: View) => void;
  openClientDetail: (clientCode: string) => void;
  openDoctorDetail: (id: string) => void;
  openHealthCompanyDetail: (id: string) => void;
  openProductDetail: (id: string) => void;
  /** Target of a navigation blocked by unsaved edits (drives the confirm dialog). */
  pendingView: View | null;
  keepAndContinue: () => void;
  discardAndContinue: () => void;
  dismissPending: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

const isClientView = (view: View) => view === 'client-detail' || view === 'client-orthopedic';

type NavigationTarget = {
  view: View;
  clientCode?: string | null;
  doctorId?: string | null;
  healthCompanyId?: string | null;
  productId?: string | null;
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const edit = useEntityEdit();
  const [view, setView] = useState<View>('dashboard');
  const [selectedClientCode, setSelectedClientCode] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedHealthCompanyId, setSelectedHealthCompanyId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pendingTarget, setPendingTarget] = useState<NavigationTarget | null>(null);

  const targetForView = (next: View): NavigationTarget => ({
    view: next,
    clientCode: isClientView(next) ? selectedClientCode : null,
    doctorId: next === 'doctor-detail' ? selectedDoctorId : null,
    healthCompanyId: next === 'health-company-detail' ? selectedHealthCompanyId : null,
    productId: next === 'product-detail' ? selectedProductId : null,
  });

  const isSameEditTarget = (target: NavigationTarget) => {
    if (!edit.editTarget) return false;
    if (edit.editTarget.type === 'client') {
      return isClientView(target.view) && target.clientCode === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'doctor') {
      return target.view === 'doctor-detail' && target.doctorId === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'healthCompany') {
      return target.view === 'health-company-detail' && target.healthCompanyId === edit.editTarget.id;
    }
    return target.view === 'product-detail' && target.productId === edit.editTarget.id;
  };

  const applyTarget = (target: NavigationTarget) => {
    setView(target.view);
    setSelectedClientCode(isClientView(target.view) ? target.clientCode ?? null : null);
    setSelectedDoctorId(target.view === 'doctor-detail' ? target.doctorId ?? null : null);
    setSelectedHealthCompanyId(
      target.view === 'health-company-detail' ? target.healthCompanyId ?? null : null,
    );
    setSelectedProductId(target.view === 'product-detail' ? target.productId ?? null : null);
  };

  const guardedApply = (target: NavigationTarget) => {
    if (edit.editing && !isSameEditTarget(target)) {
      if (edit.isDirty) {
        setPendingTarget(target);
        return;
      }
      edit.cancel();
    }
    applyTarget(target);
  };

  const navigate = (next: View) => {
    guardedApply(targetForView(next));
  };

  const openClientDetail = (clientCode: string) => {
    guardedApply({ view: 'client-detail', clientCode });
  };

  const openDoctorDetail = (id: string) => {
    guardedApply({ view: 'doctor-detail', doctorId: id });
  };

  const openHealthCompanyDetail = (id: string) => {
    guardedApply({ view: 'health-company-detail', healthCompanyId: id });
  };

  const openProductDetail = (id: string) => {
    guardedApply({ view: 'product-detail', productId: id });
  };

  const keepAndContinue = async () => {
    const target = pendingTarget;
    const saved = await edit.save();
    setPendingTarget(null);
    if (saved && target) applyTarget(target);
  };

  const discardAndContinue = () => {
    const target = pendingTarget;
    edit.cancel();
    setPendingTarget(null);
    if (target) applyTarget(target);
  };

  const dismissPending = () => setPendingTarget(null);

  return (
    <NavigationContext.Provider
      value={{
        view,
        selectedClientCode,
        selectedDoctorId,
        selectedHealthCompanyId,
        selectedProductId,
        navigate,
        openClientDetail,
        openDoctorDetail,
        openHealthCompanyDetail,
        openProductDetail,
        pendingView: pendingTarget?.view ?? null,
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
