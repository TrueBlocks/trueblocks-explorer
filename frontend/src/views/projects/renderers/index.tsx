import { project, projects, types } from '@models';

import { ManageFacet, ProjectFacet } from './facets';

export * from './facets';

export const renderers = {
  panels: {},
  facets: {
    [types.DataFacet.MANAGE]: ({
      data,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      const pageData = {
        projects: data || [],
      } as unknown as projects.ProjectsPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'projects',
        facetName: types.DataFacet.MANAGE,
      };
      return <ManageFacet pageData={pageData} viewStateKey={viewStateKey} />;
    },

    // Project facets have IDs that are project IDs (not DataFacet enum values)
    default: ({
      data,
      facet,
    }: {
      data: Record<string, unknown>[];
      columns: unknown[];
      facet: types.DataFacet;
    }) => {
      if (facet === types.DataFacet.MANAGE) {
        return null;
      }

      const pageData = {
        addresslist: data || [],
      } as unknown as projects.ProjectsPage;
      const viewStateKey: project.ViewStateKey = {
        viewName: 'projects',
        facetName: facet,
      };

      // Extract project info from facet ID (assuming facet is the project ID)
      const projectId = facet as string;
      const projectName = `Project ${projectId}`; // TODO: Get actual project name

      return (
        <ProjectFacet
          pageData={pageData}
          viewStateKey={viewStateKey}
          projectId={projectId}
          projectName={projectName}
        />
      );
    },
  },
};
