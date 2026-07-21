import type { EditMode, EditTarget, EntityKind } from '../editing/types';
import type { NavigationSection, Route } from './types';

export function entityListRoute(type: EntityKind): Route {
  switch (type) {
    case 'client':
      return { name: 'clients' };
    case 'doctor':
      return { name: 'doctors' };
    case 'healthCompany':
      return { name: 'health-companies' };
    case 'product':
      return { name: 'products' };
    case 'quote':
      return { name: 'quotes' };
    case 'workOrder':
      return { name: 'work-orders' };
  }
}

export function entityCreateRoute(type: EntityKind): Route {
  switch (type) {
    case 'client':
      return { name: 'client-create' };
    case 'doctor':
      return { name: 'doctor-create' };
    case 'healthCompany':
      return { name: 'health-company-create' };
    case 'product':
      return { name: 'product-create' };
    case 'quote':
      return { name: 'quote-create' };
    case 'workOrder':
      return { name: 'work-orders' };
  }
}

export function entityDetailRoute(type: EntityKind, id: string): Route {
  switch (type) {
    case 'client':
      return { name: 'client-detail', clientId: id, tab: 'general' };
    case 'doctor':
      return { name: 'doctor-detail', doctorId: id };
    case 'healthCompany':
      return { name: 'health-company-detail', healthCompanyId: id };
    case 'product':
      return { name: 'product-detail', productId: id };
    case 'quote':
      return { name: 'quote-detail', quoteId: id };
    case 'workOrder':
      return { name: 'work-order-detail', workOrderId: id };
  }
}

/** Whether a destination belongs to the edit/create session that is already open. */
export function routeMatchesEditSession(route: Route, target: EditTarget, mode: EditMode): boolean {
  if (mode === 'create') return route.name === entityCreateRoute(target.type).name;
  switch (target.type) {
    case 'client':
      return route.name === 'client-detail' && route.clientId === target.id;
    case 'doctor':
      return route.name === 'doctor-detail' && route.doctorId === target.id;
    case 'healthCompany':
      return route.name === 'health-company-detail' && route.healthCompanyId === target.id;
    case 'product':
      return route.name === 'product-detail' && route.productId === target.id;
    case 'quote':
      return route.name === 'quote-detail' && route.quoteId === target.id;
    case 'workOrder':
      return route.name === 'work-order-detail' && route.workOrderId === target.id;
  }
}

/** Sidebar ownership for every route, kept separate from component rendering. */
export function sectionForRoute(route: Route): NavigationSection {
  switch (route.name) {
    case 'client-create':
    case 'client-detail':
    case 'clients':
      return 'clients';
    case 'doctor-create':
    case 'doctor-detail':
    case 'doctors':
      return 'doctors';
    case 'health-company-create':
    case 'health-company-detail':
    case 'health-companies':
      return 'health-companies';
    case 'product-create':
    case 'product-detail':
    case 'products':
      return 'products';
    case 'quote-create':
    case 'quote-detail':
    case 'quotes':
      return 'quotes';
    case 'work-order-detail':
    case 'work-orders':
      return 'work-orders';
    case 'dashboard':
    case 'settings':
    case 'employees':
      return route.name;
  }
}
