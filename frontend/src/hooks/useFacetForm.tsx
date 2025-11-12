import { useMemo } from 'react';

import { FormField } from '@components';
import { FormView } from '@layout';
import { types } from '@models';

import { useFacetRenderer } from './useFacetRenderer';

type RendererCtx<T extends Record<string, unknown>> = {
  data: T[];
  columns: FormField<T>[];
  facet: types.DataFacet;
};

type RendererMap<T extends Record<string, unknown>> = Partial<
  Record<types.DataFacet, (ctx: RendererCtx<T>) => React.ReactNode>
>;

export function useFacetForm<T extends Record<string, unknown>>({
  viewConfig,
  getCurrentDataFacet,
  currentData,
  currentColumns,
  title,
  renderers,
  viewName,
}: {
  viewConfig: types.ViewConfig;
  getCurrentDataFacet: () => types.DataFacet;
  currentData: T[];
  currentColumns: FormField<T>[];
  title?: string;
  renderers?: RendererMap<T>;
  viewName?: string;
}): {
  isCanvas: boolean;
  node: React.ReactNode | null;
  facetConfig?: types.FacetConfig;
} {
  const facet = getCurrentDataFacet();
  const facetConfig = viewConfig?.facets?.[facet];
  const isCanvas = facetConfig?.viewType !== 'table';

  // Use the new facet renderer for canvas views
  const {
    isCanvas: _rendererIsCanvas,
    node: rendererNode,
    facetConfig: rendererFacetConfig,
  } = useFacetRenderer({
    viewConfig,
    getCurrentDataFacet,
    currentData,
    currentColumns,
    renderers,
    viewName: viewName || viewConfig?.viewName || 'unknown',
  });

  const derivedTitle = title || facetConfig?.name || viewConfig?.viewName || '';

  const node = useMemo(() => {
    if (!currentData || currentData.length === 0) {
      return <div>No data available</div>;
    }

    const data = currentData[0];

    // Prefer columns when available; otherwise derive fields from the data object directly (e.g., MANIFEST)
    type ColumnLike = FormField<T> & {
      key?: string;
      detailLabel?: string;
    };
    const columnsToUse: ColumnLike[] =
      currentColumns && currentColumns.length
        ? (currentColumns as ColumnLike[])
        : ((Object.keys(data || {}) as Array<keyof T & string>).map((k) => ({
            key: k,
            name: k,
            header: k,
            label: k,
          })) as unknown as ColumnLike[]);

    const fields = columnsToUse
      .map((column) => {
        const key = (column.name ||
          column.key ||
          column.header ||
          '') as keyof T & string;
        const raw = (data as Record<string, unknown>)[key as string];

        if (raw && typeof raw === 'object') {
          return null;
        }

        let value = '';
        if (typeof raw === 'string') value = raw;
        else if (typeof raw === 'number') value = String(raw);
        else if (typeof raw === 'boolean') value = raw ? 'Yes' : 'No';
        else if (raw !== null && raw !== undefined) value = String(raw);

        const label =
          (column as unknown as { detailLabel?: string }).detailLabel ||
          (column as unknown as { label?: string }).label ||
          (column as unknown as { header?: string }).header ||
          (column as unknown as { key?: string }).key ||
          (column as unknown as { name?: string }).name ||
          '';

        const name = key || String(label);

        return {
          ...column,
          name,
          label,
          value,
          readOnly: true,
        } as FormField<T>;
      })
      .filter((f): f is FormField<T> => Boolean(f));

    if (!fields.length) {
      return (
        <FormView<T>
          formFields={[]}
          title={derivedTitle}
          onSubmit={() => {}}
          description="No simple fields to display"
        />
      );
    }
    return (
      <FormView<T>
        formFields={fields}
        title={derivedTitle}
        onSubmit={() => {}}
      />
    );
  }, [currentData, currentColumns, derivedTitle]);

  // If it's a canvas view, use the renderer result, but fall back to FormView if no renderer
  if (isCanvas) {
    return {
      isCanvas,
      node: rendererNode || node, // Fall back to FormView when renderer is null (escape hatch)
      facetConfig: rendererFacetConfig,
    };
  }

  return { isCanvas: false, node: node, facetConfig };
}
