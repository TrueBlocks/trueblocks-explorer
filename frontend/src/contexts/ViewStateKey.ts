import { project } from '@models';

export const viewStateKeyToString = (key: project.ViewStateKey): string => {
  return `${key.viewName}/${key.facetName}/`;
};
