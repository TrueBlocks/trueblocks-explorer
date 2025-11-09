import { useCallback, useMemo, useState } from 'react';

import { ProjectCard } from '@components';
import { useActiveProject } from '@hooks';
import { project, projects } from '@models';
import { Log, useEmitters } from '@utils';

export type ManageFacetProps = {
  pageData: projects.ProjectsPage | null;
  viewStateKey: project.ViewStateKey;
};

export const ManageFacet = ({ pageData: _pageData }: ManageFacetProps) => {
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
      Log(`[ManageFacet] Attempting to close project: ${projectId}`);

      try {
        // Find project name for status message
        const project = projectInfos.find((p) => p.id === projectId);
        const projectName = project?.name || projectId;

        await closeProject(projectId);

        Log(`[ManageFacet] Successfully closed project: ${projectId}`);
        emitStatus(`Project "${projectName}" was closed successfully`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        Log(`[ManageFacet] Error closing project ${projectId}: ${errorMsg}`);
        emitError(`Failed to close project: ${errorMsg}`);
      }
    },
    [closeProject, projectInfos, emitStatus, emitError],
  );

  const handleNewProject = useCallback(() => {
    // New project functionality - could navigate to project creation
    Log('Create new project');
    // TODO: Implement new project creation if needed
    // This might require opening a project creation modal or navigating to a creation page
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
