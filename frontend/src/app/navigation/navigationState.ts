import type { Route } from './types';

export type NavigationDestination = {
  route: Route;
  history: Route[];
};

export type NavigationState = {
  route: Route;
  history: Route[];
  pending: NavigationDestination | null;
};

export const initialNavigationState: NavigationState = {
  route: { name: 'dashboard' },
  history: [],
  pending: null,
};

export function routeKey(route: Route): string {
  switch (route.name) {
    case 'quotes':
      return `${route.name}:${route.status ?? ''}`;
    case 'client-detail':
      return `${route.name}:${route.clientId}:${route.tab}`;
    case 'doctor-detail':
      return `${route.name}:${route.doctorId}`;
    case 'health-company-detail':
      return `${route.name}:${route.healthCompanyId}`;
    case 'product-detail':
      return `${route.name}:${route.productId}`;
    case 'quote-detail':
      return `${route.name}:${route.quoteId}`;
    case 'work-order-detail':
      return `${route.name}:${route.workOrderId}`;
    default:
      return route.name;
  }
}

export function destinationForNavigation(
  state: NavigationState,
  route: Route,
): NavigationDestination {
  const history =
    routeKey(state.route) === routeKey(route) ? state.history : [...state.history, state.route];
  return { route, history };
}

export function destinationForBack(state: NavigationState, fallback: Route): NavigationDestination {
  return {
    route: state.history[state.history.length - 1] ?? fallback,
    history: state.history.slice(0, -1),
  };
}

export function destinationForReplacement(
  state: NavigationState,
  route: Route,
): NavigationDestination {
  return { route, history: state.history };
}

type NavigationAction =
  | { type: 'apply'; destination: NavigationDestination }
  | { type: 'defer'; destination: NavigationDestination }
  | { type: 'dismiss-pending' };

export function navigationReducer(
  state: NavigationState,
  action: NavigationAction,
): NavigationState {
  switch (action.type) {
    case 'apply':
      return { ...action.destination, pending: null };
    case 'defer':
      return { ...state, pending: action.destination };
    case 'dismiss-pending':
      return { ...state, pending: null };
  }
}
