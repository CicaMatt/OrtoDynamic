import { createContext, useContext, useState, type ReactNode } from 'react';
import type { View } from './types';
import { useEntityEdit } from '../editing/EntityEditContext';
import type { EntityKind } from '../editing/types';

type NavigationValue = {
  view: View;
  selectedClientCode: string | null;
  selectedDoctorId: string | null;
  selectedHealthCompanyId: string | null;
  selectedProductId: string | null;
  selectedQuoteId: string | null;
  selectedWorkOrderId: string | null;
  navigate: (view: View) => void;
  goBack: (fallback: View) => void;
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
  /** Open an entity's detail view by kind - used after a create completes. */
  openEntityDetail: (type: EntityKind, id: string) => void;
  /** Navigate to an entity's list view by kind - used when a create is cancelled. */
  goToEntityList: (type: EntityKind) => void;
  /** Target of a navigation blocked by unsaved edits (drives the confirm dialog). */
  pendingView: View | null;
  keepAndContinue: () => void;
  discardAndContinue: () => void;
  dismissPending: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

type NavParamKey =
  | 'clientCode'
  | 'doctorId'
  | 'healthCompanyId'
  | 'productId'
  | 'quoteId'
  | 'workOrderId';

type NavigationTarget = {
  view: View;
  params?: Partial<Record<NavParamKey, string>>;
};

type EntityNavigationConfig = {
  listView: View;
  createView?: View;
  detailView: View;
  detailViews?: readonly View[];
  paramKey: NavParamKey;
};

const ENTITY_NAVIGATION: Record<EntityKind, EntityNavigationConfig> = {
  client: {
    listView: 'clients',
    createView: 'client-create',
    detailView: 'client-detail',
    detailViews: ['client-detail', 'client-orthopedic'],
    paramKey: 'clientCode',
  },
  doctor: {
    listView: 'doctors',
    createView: 'doctor-create',
    detailView: 'doctor-detail',
    paramKey: 'doctorId',
  },
  healthCompany: {
    listView: 'health-companies',
    createView: 'health-company-create',
    detailView: 'health-company-detail',
    paramKey: 'healthCompanyId',
  },
  product: {
    listView: 'products',
    createView: 'product-create',
    detailView: 'product-detail',
    paramKey: 'productId',
  },
  quote: {
    listView: 'quotes',
    createView: 'quote-create',
    detailView: 'quote-detail',
    paramKey: 'quoteId',
  },
  workOrder: {
    listView: 'work-orders',
    detailView: 'work-order-detail',
    paramKey: 'workOrderId',
  },
};

function viewsFor(config: EntityNavigationConfig): readonly View[] {
  return config.detailViews ?? [config.detailView];
}

function detailConfigForView(view: View): EntityNavigationConfig | null {
  for (const config of Object.values(ENTITY_NAVIGATION)) {
    if (viewsFor(config).includes(view)) return config;
  }
  return null;
}

function targetParam(target: NavigationTarget, key: NavParamKey): string | null {
  return target.params?.[key] ?? null;
}

function detailTargetFor(type: EntityKind, id: string): NavigationTarget {
  const config = ENTITY_NAVIGATION[type];
  return { view: config.detailView, params: { [config.paramKey]: id } };
}

function createTargetFor(type: EntityKind): NavigationTarget {
  const view = ENTITY_NAVIGATION[type].createView;
  if (!view) return { view: ENTITY_NAVIGATION[type].listView };
  return { view };
}

function targetForView(view: View, current: NavigationTarget): NavigationTarget {
  const config = detailConfigForView(view);
  if (!config) return { view };
  const id = targetParam(current, config.paramKey);
  return id ? { view, params: { [config.paramKey]: id } } : { view };
}

function targetKey(target: NavigationTarget): string {
  const config = detailConfigForView(target.view);
  if (!config) return target.view;
  return `${target.view}:${targetParam(target, config.paramKey) ?? ''}`;
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const edit = useEntityEdit();
  const [currentTarget, setCurrentTarget] = useState<NavigationTarget>({ view: 'dashboard' });
  const [pendingTarget, setPendingTarget] = useState<NavigationTarget | null>(null);
  const [pendingHistory, setPendingHistory] = useState<NavigationTarget[] | null>(null);
  const [history, setHistory] = useState<NavigationTarget[]>([]);

  const view = currentTarget.view;
  const selectedClientCode =
    detailConfigForView(view)?.paramKey === 'clientCode' ? targetParam(currentTarget, 'clientCode') : null;
  const selectedDoctorId =
    detailConfigForView(view)?.paramKey === 'doctorId' ? targetParam(currentTarget, 'doctorId') : null;
  const selectedHealthCompanyId =
    detailConfigForView(view)?.paramKey === 'healthCompanyId'
      ? targetParam(currentTarget, 'healthCompanyId')
      : null;
  const selectedProductId =
    detailConfigForView(view)?.paramKey === 'productId' ? targetParam(currentTarget, 'productId') : null;
  const selectedQuoteId =
    detailConfigForView(view)?.paramKey === 'quoteId' ? targetParam(currentTarget, 'quoteId') : null;
  const selectedWorkOrderId =
    detailConfigForView(view)?.paramKey === 'workOrderId' ? targetParam(currentTarget, 'workOrderId') : null;

  const isSameEditTarget = (target: NavigationTarget) => {
    if (!edit.editTarget) return false;
    const config = ENTITY_NAVIGATION[edit.editTarget.type];
    if (edit.mode === 'create') return target.view === config.createView;
    return viewsFor(config).includes(target.view) && targetParam(target, config.paramKey) === edit.editTarget.id;
  };

  const applyTarget = (target: NavigationTarget) => {
    setCurrentTarget(target);
  };

  const pushHistoryFor = (target: NavigationTarget) =>
    targetKey(currentTarget) === targetKey(target) ? history : [...history, currentTarget];

  const guardedApply = (target: NavigationTarget, nextHistory = pushHistoryFor(target)) => {
    if (edit.editing && !isSameEditTarget(target)) {
      if (edit.isDirty) {
        setPendingTarget(target);
        setPendingHistory(nextHistory);
        return;
      }
      edit.cancel();
    }
    setHistory(nextHistory);
    applyTarget(target);
  };

  const navigate = (next: View) => {
    guardedApply(targetForView(next, currentTarget));
  };

  const goBack = (fallback: View) => {
    const target = history[history.length - 1] ?? targetForView(fallback, currentTarget);
    guardedApply(target, history.slice(0, -1));
  };

  const openEntityCreate = (type: EntityKind) => {
    guardedApply(createTargetFor(type));
  };

  const openClientDetail = (clientCode: string) => {
    guardedApply(detailTargetFor('client', clientCode));
  };

  const openDoctorDetail = (id: string) => {
    guardedApply(detailTargetFor('doctor', id));
  };

  const openHealthCompanyDetail = (id: string) => {
    guardedApply(detailTargetFor('healthCompany', id));
  };

  const openProductDetail = (id: string) => {
    guardedApply(detailTargetFor('product', id));
  };

  const openQuoteDetail = (id: string) => {
    guardedApply(detailTargetFor('quote', id));
  };

  const openWorkOrderDetail = (id: string) => {
    guardedApply(detailTargetFor('workOrder', id));
  };

  // These run right after a create session has ended (saved or cancelled), so they
  // apply the target directly - the edit guard would otherwise see stale session state.
  const openEntityDetail = (type: EntityKind, id: string) => {
    applyTarget(detailTargetFor(type, id));
  };

  const goToEntityList = (type: EntityKind) => {
    applyTarget({ view: ENTITY_NAVIGATION[type].listView });
  };

  const keepAndContinue = async () => {
    const target = pendingTarget;
    const result = await edit.save();
    setPendingTarget(null);
    const nextHistory = pendingHistory;
    setPendingHistory(null);
    if (result.ok && target) applyTarget(target);
    if (result.ok && nextHistory) setHistory(nextHistory);
  };

  const discardAndContinue = () => {
    const target = pendingTarget;
    const nextHistory = pendingHistory;
    edit.cancel();
    setPendingTarget(null);
    setPendingHistory(null);
    if (nextHistory) setHistory(nextHistory);
    if (target) applyTarget(target);
  };

  const dismissPending = () => {
    setPendingTarget(null);
    setPendingHistory(null);
  };

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
        goBack,
        openClientDetail,
        openClientCreate: () => openEntityCreate('client'),
        openDoctorDetail,
        openDoctorCreate: () => openEntityCreate('doctor'),
        openHealthCompanyDetail,
        openHealthCompanyCreate: () => openEntityCreate('healthCompany'),
        openProductDetail,
        openProductCreate: () => openEntityCreate('product'),
        openQuoteDetail,
        openQuoteCreate: () => openEntityCreate('quote'),
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
