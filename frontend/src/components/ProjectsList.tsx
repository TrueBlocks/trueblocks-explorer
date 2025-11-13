import { Action } from '@components';
import { useViewContext } from '@contexts';
import { useActiveProject, useEvent, useIconSets } from '@hooks';
import { Group, List, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import { msgs } from '@models';
import { Log, LogError } from '@utils';
import { useLocation } from 'wouter';

export const ProjectsList = () => {
  const { File } = useIconSets();
  const { restoreProjectFilterStates } = useViewContext();
  const { projects, lastView, switchProject, closeProject } =
    useActiveProject();
  const [, navigate] = useLocation();

  useEvent(msgs.EventType.MANAGER, (_message?: string) => {
    // TODO: BOGUS - DOES NOTHING
    Log('Projects updated via manager event');
  });

  useEvent(msgs.EventType.PROJECT_OPENED, async (lastView: string) => {
    await restoreProjectFilterStates();
    const targetView = lastView || '/projects'; // DEFAULT_ROUTE
    navigate(targetView);
  });

  const handleSwitchProject = async (id: string) => {
    try {
      await switchProject(id);
      await restoreProjectFilterStates();
      const targetView = lastView || '/projects'; // DEFAULT_ROUTE
      navigate(targetView);
    } catch (error) {
      LogError(`Switching projects: ${error}`);
    }
  };

  const handleCloseProject = async (id: string) => {
    try {
      await closeProject(id);
    } catch (error) {
      LogError(`Closing project: ${error}`);
    }
  };

  if (projects.length === 0) {
    return null; // Don't show anything if there are no open projects
  }

  return (
    <Paper withBorder>
      <Title order={4} mb="xs">
        Open Projects
      </Title>
      <List spacing="xs">
        {projects.map((project) => {
          var fw = project.isActive ? 600 : 400;
          return (
            <List.Item
              key={project.id}
              icon={
                <ThemeIcon
                  color={project.isActive ? 'primary' : 'dimmed'}
                  size={24}
                  radius="xl"
                >
                  <File size={16} />
                </ThemeIcon>
              }
            >
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text variant="primary" size="md" fw={fw}>
                    {project.name}
                  </Text>
                  <Text variant="dimmed" size="sm">
                    {project.path}
                  </Text>
                </div>
                <Group gap="xs">
                  {!project.isActive && (
                    <Action
                      icon="Switch"
                      title="Switch to this project"
                      variant="light"
                      onClick={() => handleSwitchProject(project.id)}
                    />
                  )}
                  <Action
                    icon="Delete"
                    title="Close project"
                    variant="light"
                    onClick={() => handleCloseProject(project.id)}
                    c="error.6"
                  />
                </Group>
              </Group>
            </List.Item>
          );
        })}
      </List>
    </Paper>
  );
};
