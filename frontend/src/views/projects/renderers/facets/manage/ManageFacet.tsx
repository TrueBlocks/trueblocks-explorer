import { useCallback, useMemo, useState } from 'react';

import { ProjectCard, RendererParams } from '@components';
import { useActiveProject } from '@hooks';
import { msgs, project, projects, types } from '@models';
import { emitEvent, useEmitters } from '@utils';

export const ManageFacet = ({ params }: { params: RendererParams }) => {
  const { data } = params;
  const _pageData = {
    projects: data || [],
  } as unknown as projects.ProjectsPage;
  const _viewStateKey: project.ViewStateKey = useMemo(
    () => ({
      viewName: 'projects',
      facetName: types.DataFacet.MANAGE,
    }),
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const {
    projects: projectInfos,
    switchProject,
    closeProject,
    loading,
  } = useActiveProject();
  const { emitStatus, emitError } = useEmitters();

  // Use the project data from useActiveProject which has the correct structure
  // The pageData from the backend uses the core project.Project type but
  // ProjectCard expects the ProjectInfo structure with id, path, isActive etc.

  const handleSwitchProject = useCallback(
    async (projectId: string) => {
      await switchProject(projectId);
    },
    [switchProject],
  );

  const handleUpdateProject = useCallback(
    async (projectId: string) => {
      // Switch to the project's dynamic facet for editing
      await switchProject(projectId);
    },
    [switchProject],
  );

  const handleDeleteProject = useCallback(
    async (projectId: string) => {
      try {
        // Find project name for status message
        const project = projectInfos.find((p) => p.id === projectId);
        const projectName = project?.name || projectId;
        await closeProject(projectId);
        emitStatus(`Project "${projectName}" was closed successfully`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        emitError(`Failed to close project: ${errorMsg}`);
      }
    },
    [closeProject, projectInfos, emitStatus, emitError],
  );

  const handleNewProject = useCallback(() => {
    emitEvent(msgs.EventType.PROJECT_MODAL, 'show_project_modal');
  }, []);

  // Memoize the props to prevent unnecessary re-renders of ProjectCard
  const projectCardProps = useMemo(
    () => ({
      projects: projectInfos,
      onSwitchProject: handleSwitchProject,
      onUpdateProject: handleUpdateProject,
      onDeleteProject: handleDeleteProject,
      onNewProject: handleNewProject,
      loading,
      searchQuery,
      onSearchChange: setSearchQuery,
    }),
    [
      projectInfos,
      handleSwitchProject,
      handleUpdateProject,
      handleDeleteProject,
      handleNewProject,
      loading,
      searchQuery,
    ],
  );

  return <ProjectCard {...projectCardProps} />;
};
