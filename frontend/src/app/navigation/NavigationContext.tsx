import { createContext, useContext, useState, type ReactNode } from 'react';
import type { View } from './types';
import { useEntityEdit, type EntityKind } from '../editing/EntityEditContext';

type NavigationValue = {
  view: View;
  selectedClientCode: string | null;
  selectedDoctorId: string | null;
  selectedHealthCompanyId: string | null;
  selectedProductId: string | null;
  selectedQuoteId: string | null;
  selectedWorkOrderId: string | null;
  navigate: (view: View) => void;
  openClientDetail: (clientCode: string) => void;
  openClientCreate: () => void;
  openDoctorDetail: (id: string) => void;
  openDoctorCreate: () => void;
  openHealthCompanyDetail: (id: string) => void;
  openHealthCompanyCreate: () => void;
  openProductDetail: (id: string) => void;
  openProductCreate: () => void;
  openQuoteDetail: (id: string) => void;
  openQuoteCreate: () => void;
  openWorkOrderDetail: (id: string) => void;
  /** Open an entity's detail view by kind — used after a create completes. */
  openEntityDetail: (type: EntityKind, id: string) => void;
  /** Navigate to an entity's list view by kind — used when a create is cancelled. */
  goToEntityList: (type: EntityKind) => void;
  /** Target of a navigation blocked by unsaved edits (drives the confirm dialog). */
  pendingView: View | null;
  keepAndContinue: () => void;
  discardAndContinue: () => void;
  dismissPending: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

const isClientView = (view: View) => view === 'client-detail' || view === 'client-orthopedic';

/** The create-form view for each entity kind. */
const CREATE_VIEW: Partial<Record<EntityKind, View>> = {
  client: 'client-create',
  doctor: 'doctor-create',
  healthCompany: 'health-company-create',
  product: 'product-create',
  quote: 'quote-create',
};

/** The list view for each entity kind. */
const LIST_VIEW: Record<EntityKind, View> = {
  client: 'clients',
  doctor: 'doctors',
  healthCompany: 'health-companies',
  product: 'products',
  quote: 'quotes',
  workOrder: 'work-orders',
};

/** Build the detail-view navigation target for an entity kind + id. */
function detailTargetFor(type: EntityKind, id: string): NavigationTarget {
  switch (type) {
    case 'client':
      return { view: 'client-detail', clientCode: id };
    case 'doctor':
      return { view: 'doctor-detail', doctorId: id };
    case 'healthCompany':
      return { view: 'health-company-detail', healthCompanyId: id };
    case 'product':
      return { view: 'product-detail', productId: id };
    case 'quote':
      return { view: 'quote-detail', quoteId: id };
    case 'workOrder':
      return { view: 'work-order-detail', workOrderId: id };
  }
}

type NavigationTarget = {
  view: View;
  clientCode?: string | null;
  doctorId?: string | null;
  healthCompanyId?: string | null;
  productId?: string | null;
  quoteId?: string | null;
  workOrderId?: string | null;
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const edit = useEntityEdit();
  const [view, setView] = useState<View>('dashboard');
  const [selectedClientCode, setSelectedClientCode] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedHealthCompanyId, setSelectedHealthCompanyId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const [pendingTarget, setPendingTarget] = useState<NavigationTarget | null>(null);

  const targetForView = (next: View): NavigationTarget => ({
    view: next,
    clientCode: isClientView(next) ? selectedClientCode : null,
    doctorId: next === 'doctor-detail' ? selectedDoctorId : null,
    healthCompanyId: next === 'health-company-detail' ? selectedHealthCompanyId : null,
    productId: next === 'product-detail' ? selectedProductId : null,
    quoteId: next === 'quote-detail' ? selectedQuoteId : null,
    workOrderId: next === 'work-order-detail' ? selectedWorkOrderId : null,
  });

  const isSameEditTarget = (target: NavigationTarget) => {
    if (!edit.editTarget) return false;
    if (edit.mode === 'create') {
      return target.view === CREATE_VIEW[edit.editTarget.type];
    }
    if (edit.editTarget.type === 'client') {
      return isClientView(target.view) && target.clientCode === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'doctor') {
      return target.view === 'doctor-detail' && target.doctorId === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'healthCompany') {
      return target.view === 'health-company-detail' && target.healthCompanyId === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'product') {
      return target.view === 'product-detail' && target.productId === edit.editTarget.id;
    }
    if (edit.editTarget.type === 'quote') {
      return target.view === 'quote-detail' && target.quoteId === edit.editTarget.id;
    }
    return target.view === 'work-order-detail' && target.workOrderId === edit.editTarget.id;
  };

  const applyTarget = (target: NavigationTarget) => {
    setView(target.view);
    setSelectedClientCode(isClientView(target.view) ? target.clientCode ?? null : null);
    setSelectedDoctorId(target.view === 'doctor-detail' ? target.doctorId ?? null : null);
    setSelectedHealthCompanyId(
      target.view === 'health-company-detail' ? target.healthCompanyId ?? null : null,
    );
    setSelectedProductId(target.view === 'product-detail' ? target.productId ?? null : null);
    setSelectedQuoteId(target.view === 'quote-detail' ? target.quoteId ?? null : null);
    setSelectedWorkOrderId(target.view === 'work-order-detail' ? target.workOrderId ?? null : null);
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

  const openClientCreate = () => {
    guardedApply({ view: 'client-create' });
  };

  const openDoctorDetail = (id: string) => {
    guardedApply({ view: 'doctor-detail', doctorId: id });
  };

  const openDoctorCreate = () => {
    guardedApply({ view: 'doctor-create' });
  };

  const openHealthCompanyDetail = (id: string) => {
    guardedApply({ view: 'health-company-detail', healthCompanyId: id });
  };

  const openHealthCompanyCreate = () => {
    guardedApply({ view: 'health-company-create' });
  };

  const openProductDetail = (id: string) => {
    guardedApply({ view: 'product-detail', productId: id });
  };

  const openProductCreate = () => {
    guardedApply({ view: 'product-create' });
  };

  const openQuoteDetail = (id: string) => {
    guardedApply({ view: 'quote-detail', quoteId: id });
  };

  const openQuoteCreate = () => {
    guardedApply({ view: 'quote-create' });
  };

  const openWorkOrderDetail = (id: string) => {
    guardedApply({ view: 'work-order-detail', workOrderId: id });
  };

  // These run right after a create session has ended (saved or cancelled), so they
  // apply the target directly — the edit guard would otherwise see the now-stale
  // session state and re-prompt for "unsaved changes".
  const openEntityDetail = (type: EntityKind, id: string) => {
    applyTarget(detailTargetFor(type, id));
  };

  const goToEntityList = (type: EntityKind) => {
    applyTarget({ view: LIST_VIEW[type] });
  };

  const keepAndContinue = async () => {
    const target = pendingTarget;
    const result = await edit.save();
    setPendingTarget(null);
    if (result.ok && target) applyTarget(target);
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
        selectedQuoteId,
        selectedWorkOrderId,
        navigate,
        openClientDetail,
        openClientCreate,
        openDoctorDetail,
        openDoctorCreate,
        openHealthCompanyDetail,
        openHealthCompanyCreate,
        openProductDetail,
        openProductCreate,
        openQuoteDetail,
        openQuoteCreate,
        openWorkOrderDetail,
        openEntityDetail,
        goToEntityList,
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
