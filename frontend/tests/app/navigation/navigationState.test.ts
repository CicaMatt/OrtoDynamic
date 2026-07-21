import { describe, expect, it } from 'vitest';

import {
  destinationForBack,
  destinationForNavigation,
  initialNavigationState,
  navigationReducer,
  routeKey,
} from '../../../src/app/navigation/navigationState';
import { routeMatchesEditSession, sectionForRoute } from '../../../src/app/navigation/routes';

describe('navigation state', () => {
  it('distinguishes ids and client tabs in route identity', () => {
    expect(routeKey({ name: 'client-detail', clientId: '1', tab: 'general' })).not.toBe(
      routeKey({ name: 'client-detail', clientId: '1', tab: 'orthopedic' }),
    );
    expect(routeKey({ name: 'product-detail', productId: '1' })).not.toBe(
      routeKey({ name: 'product-detail', productId: '2' }),
    );
  });

  it('pushes distinct routes and restores them through back navigation', () => {
    const client = { name: 'client-detail', clientId: 'C-1', tab: 'general' } as const;
    const onClient = navigationReducer(initialNavigationState, {
      type: 'apply',
      destination: destinationForNavigation(initialNavigationState, client),
    });
    const onQuote = navigationReducer(onClient, {
      type: 'apply',
      destination: destinationForNavigation(onClient, { name: 'quote-create' }),
    });

    expect(destinationForBack(onQuote, { name: 'dashboard' })).toEqual({
      route: client,
      history: [{ name: 'dashboard' }],
    });
  });

  it('defers, dismisses, and later applies a destination without losing history', () => {
    const destination = destinationForNavigation(initialNavigationState, { name: 'products' });
    const deferred = navigationReducer(initialNavigationState, { type: 'defer', destination });

    expect(navigationReducer(deferred, { type: 'dismiss-pending' })).toEqual(
      initialNavigationState,
    );
    expect(navigationReducer(deferred, { type: 'apply-pending' })).toEqual({
      route: { name: 'products' },
      history: [{ name: 'dashboard' }],
      pending: null,
    });
  });

  it('treats both client tabs as one edit target and derives sidebar ownership', () => {
    const orthopedic = { name: 'client-detail', clientId: 'C-1', tab: 'orthopedic' } as const;

    expect(routeMatchesEditSession(orthopedic, { type: 'client', id: 'C-1' }, 'edit')).toBe(true);
    expect(routeMatchesEditSession(orthopedic, { type: 'client', id: 'C-2' }, 'edit')).toBe(false);
    expect(sectionForRoute(orthopedic)).toBe('clients');
    expect(sectionForRoute({ name: 'quote-create' })).toBe('quotes');
  });
});
