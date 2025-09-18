import { types } from '@models';

interface ProjectsFacetConfig {
  facet: types.DataFacet;
  label: string;
  description: string;
}

export const projectsFacets: ProjectsFacetConfig[] = [
  {
    facet: types.DataFacet.ALL,
    label: 'All Projects',
    description: 'All projects in your workspace',
  },
  {
    facet: types.DataFacet.CUSTOM,
    label: 'Recent Projects',
    description: 'Recently accessed projects',
  },
];

export const getProjectsFacetConfig = (
  facet: types.DataFacet,
): ProjectsFacetConfig => {
  const found = projectsFacets.find((f) => f.facet === facet);
  if (found) return found;

  // Fallback to first facet, with safety check
  const defaultFacet = projectsFacets[0];
  if (!defaultFacet) {
    throw new Error('No project facets configured');
  }
  return defaultFacet;
};
