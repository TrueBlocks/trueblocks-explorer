import { useMemo } from 'react';

import { FormField } from '@components';
import { Alert, Stack, Text } from '@mantine/core';
import { types } from '@models';

type RendererCtx<T extends Record<string, unknown>> = {
  data: T;
  columns: FormField<T>[];
  facet: types.DataFacet;
};

type RendererMap<T extends Record<string, unknown>> = Partial<
  Record<types.DataFacet, (ctx: RendererCtx<T>) => React.ReactNode>
>;

interface UseFacetRendererParams<T extends Record<string, unknown>> {
  viewConfig: types.ViewConfig;
  getCurrentDataFacet: () => types.DataFacet;
  currentData: T[];
  currentColumns: FormField<T>[];
  renderers?: RendererMap<T>;
  viewName: string;
}

/**
 * Self-contained hook that handles facet rendering with proper warnings
 * when renderers are expected but missing.
 *
 * Used in auto-generated view files to provide consistent renderer behavior.
 */
export function useFacetRenderer<T extends Record<string, unknown>>({
  viewConfig,
  getCurrentDataFacet,
  currentData,
  currentColumns,
  renderers,
  viewName,
}: UseFacetRendererParams<T>): {
  isCanvas: boolean;
  node: React.ReactNode | null;
  facetConfig?: types.FacetConfig;
} {
  const facet = getCurrentDataFacet();
  const facetConfig = viewConfig?.facets?.[facet];
  const isCanvas = facetConfig?.viewType === 'canvas';

  const node = useMemo(() => {
    if (!isCanvas) return null;

    const data = currentData && currentData.length > 0 ? currentData[0] : null;
    const hasCustomRenderer = renderers && renderers[facet];

    // If renderer is expected but missing, show warning
    if (!hasCustomRenderer && facetConfig?.rendererTypes === 'facet') {
      const facetName = facet.toString();
      const lowerFacetName = facetName.toLowerCase();

      return (
        <Stack gap="md" p="xl">
          <Alert variant="light" color="orange" title="Custom Renderer Missing">
            <Stack gap="sm">
              <Text>
                The <strong>{facetName}</strong> facet is configured with{' '}
                <code>renderer = &quot;facet&quot;</code> but no custom renderer
                was found.
              </Text>

              <Text>To implement the custom renderer for this facet:</Text>

              <Stack gap="xs" ml="md">
                <Text size="sm">
                  1. Create folder:{' '}
                  <code>
                    frontend/src/views/{viewName.toLowerCase()}/renderers/
                    {lowerFacetName}/
                  </code>
                </Text>
                <Text size="sm">
                  2. Add your custom component in that folder
                </Text>
                <Text size="sm">
                  3. Export it from{' '}
                  <code>
                    frontend/src/views/{viewName.toLowerCase()}
                    /renderers/index.tsx
                  </code>{' '}
                  like:
                </Text>
                <Text size="sm" ml="md" fw={500}>
                  {`[types.DataFacet.${facetName.toUpperCase()}]: () => <Your${facetName}Component />`}
                </Text>
              </Stack>

              <Text size="sm" c="dimmed">
                <strong>Alternative:</strong> Set{' '}
                <code>renderer = &quot;&quot;</code> in the backend config to{' '}
                use the default Form renderer instead.
              </Text>
            </Stack>
          </Alert>
        </Stack>
      );
    }

    // Has custom renderer and data - use it
    if (hasCustomRenderer && data) {
      const renderer = renderers[facet];
      return renderer
        ? renderer({ data, columns: currentColumns, facet })
        : null;
    }

    // No custom renderer expected OR no data - return null (fall back to default form handling)
    return null;
  }, [
    isCanvas,
    currentData,
    currentColumns,
    renderers,
    facet,
    facetConfig,
    viewName,
  ]);

  return { isCanvas, node, facetConfig };
}
