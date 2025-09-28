import { types } from '@models';
import { LogError } from '@utils';

// TODO: BOGUS - THIS SHOULD BE AUTO-GENERATE OR REMOVED - I THINK IT'S USED FOR TESTING
export const VIEW_ROUTES = [
  'abis',
  'chunks',
  'comparitoor',
  'contracts',
  'exports',
  'monitors',
  'names',
  'status',
  'dresses',
] as const;

export type ViewRoute = (typeof VIEW_ROUTES)[number];

export const VIEW_ROUTE_SET: Record<ViewRoute, true> = VIEW_ROUTES.reduce(
  (acc, r) => {
    acc[r] = true;
    return acc;
  },
  {} as Record<ViewRoute, true>,
);

export function assertRouteConsistency(
  route: ViewRoute,
  config?: types.ViewConfig,
) {
  if (import.meta.env.DEV && config?.viewName && config.viewName !== route) {
    LogError(
      `ViewConfig.viewName (${config.viewName}) does not match route constant (${route})`,
    );
  }
}
