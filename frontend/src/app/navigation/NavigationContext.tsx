import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { useEntityEdit } from '../editing/EntityEditContext';
import {
  destinationForBack,
  destinationForNavigation,
  destinationForReplacement,
  initialNavigationState,
  navigationReducer,
  type NavigationDestination,
} from './navigationState';
import { routeMatchesEditSession } from './routes';
import type { Route, RouteName, RouteWithName } from './types';

type NavigationValue = {
  route: Route;
  navigate: (route: Route) => void;
  back: (fallback: Route) => void;
  /** Replace the current destination after an edit session has already ended. */
  replace: (route: Route) => void;
  pendingRoute: Route | null;
  keepAndContinue: () => void;
  discardAndContinue: () => void;
  dismissPending: () => void;
};

const NavigationContext = createContext<NavigationValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const edit = useEntityEdit();
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);

  const belongsToCurrentEdit = (route: Route) =>
    Boolean(edit.editTarget && routeMatchesEditSession(route, edit.editTarget, edit.mode));

  const guardedApply = (destination: NavigationDestination) => {
    if (edit.editing && !belongsToCurrentEdit(destination.route)) {
      if (edit.isDirty) {
        dispatch({ type: 'defer', destination });
        return;
      }
      edit.cancel();
    }
    dispatch({ type: 'apply', destination });
  };

  const navigate = (route: Route) => guardedApply(destinationForNavigation(state, route));
  const back = (fallback: Route) => guardedApply(destinationForBack(state, fallback));
  const replace = (route: Route) =>
    dispatch({ type: 'apply', destination: destinationForReplacement(state, route) });

  const keepAndContinue = async () => {
    const destination = state.pending;
    const result = await edit.save();
    if (result.ok && destination) dispatch({ type: 'apply', destination });
    else dispatch({ type: 'dismiss-pending' });
  };

  const discardAndContinue = () => {
    edit.cancel();
    dispatch({ type: 'apply-pending' });
  };

  return (
    <NavigationContext.Provider
      value={{
        route: state.route,
        navigate,
        back,
        replace,
        pendingRoute: state.pending?.route ?? null,
        keepAndContinue,
        discardAndContinue,
        dismissPending: () => dispatch({ type: 'dismiss-pending' }),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used inside NavigationProvider');
  return context;
}

/** Read the route expected by the rendered view without nullable selected-id state. */
export function useRoute<N extends RouteName>(name: N): RouteWithName<N> {
  const { route } = useNavigation();
  if (route.name !== name) throw new Error(`Expected route ${name}, received ${route.name}`);
  return route as RouteWithName<N>;
}
