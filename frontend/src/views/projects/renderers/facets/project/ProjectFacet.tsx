import { useMemo } from 'react';

import { BaseTab, createDetailPanel } from '@components';
import { useFacetColumns, useViewConfig } from '@hooks';
import { project, projects, types } from '@models';

export type ProjectFacetProps = {
  pageData: projects.ProjectsPage | null;
  viewStateKey: project.ViewStateKey;
  projectId: string;
  projectName: string;
};

export const ProjectFacet = ({
  pageData,
  viewStateKey,
  projectId: _projectId,
  projectName: _projectName,
}: ProjectFacetProps) => {
  // Get view configuration for columns
  const { config: viewConfig } = useViewConfig({ viewName: 'projects' });

  // Create detail panel for the project facet
  const detailPanel = useMemo(
    () => createDetailPanel(viewConfig, () => viewStateKey.facetName, {}),
    [viewConfig, viewStateKey.facetName],
  );

  // Get columns configuration for the project facet
  const currentColumns = useFacetColumns(
    viewConfig,
    () => viewStateKey.facetName,
    {
      showActions: false,
      actions: [],
      getCanRemove: () => false,
    },
    {},
    pageData,
    { rowActions: [] },
  );

  // Render project facet with BaseTab
  return (
    <BaseTab<Record<string, unknown>>
      data={
        (pageData?.addresslist || []) as unknown as Record<string, unknown>[]
      }
      columns={currentColumns}
      state={pageData?.state || types.StoreState.STALE}
      error={null}
      viewStateKey={viewStateKey}
      headerActions={null}
      detailPanel={detailPanel}
    />
  );
};
