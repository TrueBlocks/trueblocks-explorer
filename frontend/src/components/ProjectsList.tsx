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
    const targetView = lastView || '/';
    navigate(targetView);
  });

  const handleSwitchProject = async (id: string) => {
    try {
      await switchProject(id);
      await restoreProjectFilterStates();
      const targetView = lastView || '/';
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
    <Paper p="md" withBorder radius="md" mb="md">
      <Title order={4} mb="sm">
        Open Projects
      </Title>
      <List spacing="xs">
        {projects.map((project) => (
          <List.Item
            key={project.id}
            icon={
              <ThemeIcon
                color={project.isActive ? 'blue' : 'gray'}
                size={24}
                radius="xl"
              >
                <File size={16} />
              </ThemeIcon>
            }
          >
            <Group justify="space-between" wrap="nowrap">
              <div>
                <Text fw={project.isActive ? 700 : 400}>{project.name}</Text>
                <Text size="xs" c="dimmed">
                  {project.path}
                </Text>
              </div>
              <Group gap="xs">
                {!project.isActive && (
                  <Action
                    icon="Switch"
                    title="Switch to this project"
                    color="blue"
                    variant="light"
                    onClick={() => handleSwitchProject(project.id)}
                  />
                )}
                <Action
                  icon="Delete"
                  title="Close project"
                  color="red"
                  variant="light"
                  onClick={() => handleCloseProject(project.id)}
                />
              </Group>
            </Group>
          </List.Item>
        ))}
      </List>
    </Paper>
  );
};
