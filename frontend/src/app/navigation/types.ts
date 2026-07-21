/** Every valid in-memory destination. Detail routes always carry their required id. */
export type Route =
  | { name: 'dashboard' }
  | { name: 'clients' }
  | { name: 'client-create' }
  | { name: 'client-detail'; clientId: string; tab: 'general' | 'orthopedic' }
  | { name: 'doctors' }
  | { name: 'doctor-create' }
  | { name: 'doctor-detail'; doctorId: string }
  | { name: 'health-companies' }
  | { name: 'health-company-create' }
  | { name: 'health-company-detail'; healthCompanyId: string }
  | { name: 'products' }
  | { name: 'product-create' }
  | { name: 'product-detail'; productId: string }
  | { name: 'quotes' }
  | { name: 'quote-create'; clientId?: string }
  | { name: 'quote-detail'; quoteId: string }
  | { name: 'work-orders' }
  | { name: 'work-order-detail'; workOrderId: string }
  | { name: 'settings' }
  | { name: 'employees' };

export type RouteName = Route['name'];
export type RouteWithName<N extends RouteName> = Extract<Route, { name: N }>;

export type NavigationSection =
  | 'dashboard'
  | 'clients'
  | 'quotes'
  | 'work-orders'
  | 'settings'
  | 'products'
  | 'doctors'
  | 'health-companies'
  | 'employees';
