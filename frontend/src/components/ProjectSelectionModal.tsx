import { useEffect, useRef, useState } from 'react';

import { AddAddressesToProject, SaveProject } from '@app';
import { Action, AddressInput, StatusIndicator } from '@components';
import { useViewContext } from '@contexts';
import { useActiveProject, useIconSets } from '@hooks';
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocation } from 'wouter';

interface ProjectSelectionModalProps {
  opened: boolean;
  onProjectSelected: () => void;
  onCancel?: () => void;
}

interface NewProjectForm extends Record<string, unknown> {
  name: string;
  addresses: string;
}

export const ProjectSelectionModal = ({
  opened,
  onProjectSelected,
  onCancel,
}: ProjectSelectionModalProps) => {
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { File, Create } = useIconSets();
  const { restoreProjectFilterStates } = useViewContext();
  const { projects, lastView, newProject, openProjectFile, hasActiveProject } =
    useActiveProject();
  const [, navigate] = useLocation();
  const isMounted = useRef(true);

  const form = useForm<NewProjectForm>({
    initialValues: {
      name: '',
      addresses: '',
    },
    validate: {
      name: (value) => (!value ? 'Project name is required' : null),
      addresses: (value) =>
        !value?.trim() ? 'At least one address is required' : null,
    },
  });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleCreateProject = async (values: NewProjectForm) => {
    if (loadingCreate || loadingOpen) return;
    setLoadingCreate(true);
    setError(null);

    try {
      await newProject(values.name, '');
      await AddAddressesToProject(values.addresses);

      // Immediately save the project after creation/updates
      await SaveProject();

      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to create project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleOpenProject = async (projectPath: string) => {
    if (loadingCreate || loadingOpen) return;
    setLoadingOpen(true);
    setError(null);

    try {
      await openProjectFile(projectPath);
      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to open project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingOpen(false);
    }
  };

  const handleOpenFile = async () => {
    if (loadingCreate || loadingOpen) return;
    setLoadingOpen(true);
    setError(null);

    try {
      // This will trigger the native file picker
      await openProjectFile('');
      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);

      onProjectSelected();
    } catch (err) {
      const errorMsg = `Failed to open project: ${err}`;
      setError(errorMsg);
    } finally {
      setLoadingOpen(false);
    }
  };

  const isLoading = loadingCreate || loadingOpen;
  const canCancel = hasActiveProject && !!onCancel;

  return (
    <Modal
      opened={opened}
      onClose={canCancel ? (onCancel ?? (() => {})) : () => {}}
      centered
      size="lg"
      withCloseButton={canCancel}
      closeOnClickOutside={canCancel}
      closeOnEscape={canCancel}
      overlayProps={{
        backgroundOpacity: 0.8,
        blur: 3,
      }}
    >
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          <Title order={2} mb="xs">
            {hasActiveProject
              ? 'Select or Create a Project'
              : 'Project Required'}
          </Title>
          <Text c="dimmed">
            {hasActiveProject
              ? 'Choose a different project or create a new one'
              : 'An active project with at least one address is required to continue'}
          </Text>
        </div>

        {error && (
          <Text c="red" size="sm" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        )}

        <Group gap="xl" align="flex-start" grow>
          {/* Create New Project */}
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <Create size={20} />
                <Title order={4}>Create New Project</Title>
              </Group>

              <form onSubmit={form.onSubmit(handleCreateProject)}>
                <Stack gap="md">
                  <TextInput
                    label="Project Name"
                    placeholder="My Analysis Project"
                    required
                    {...form.getInputProps('name')}
                  />
                  <AddressInput form={form} fieldName="addresses" rows={4} />
                  <Button
                    type="submit"
                    loading={loadingCreate}
                    disabled={isLoading}
                    leftSection={<Create size={16} />}
                    fullWidth
                  >
                    Create Project
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>

          {/* Open Existing Project */}
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <File size={20} />
                <Title order={4}>Open Project</Title>
              </Group>

              <Button
                variant="outline"
                leftSection={<File size={16} />}
                onClick={handleOpenFile}
                loading={loadingOpen}
                disabled={isLoading}
                fullWidth
              >
                Browse for Project File
              </Button>

              {projects.length > 0 && (
                <>
                  <Text size="sm" fw={500} mt="md">
                    Recent Projects
                  </Text>
                  <Stack gap="sm">
                    {projects.map((project, index) => {
                      const isRecent =
                        new Date().getTime() -
                          new Date(project.lastOpened).getTime() <
                        24 * 60 * 60 * 1000; // Within 24 hours

                      return (
                        <Card key={index} withBorder padding="sm" radius="md">
                          <Stack gap="xs">
                            {/* Project Header */}
                            <Group justify="space-between" wrap="nowrap">
                              <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                                <File size={16} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <Group gap="xs" wrap="nowrap">
                                    <Text
                                      size="sm"
                                      fw={project.isActive ? 600 : 500}
                                      style={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {project.name}
                                    </Text>
                                    {project.isActive && (
                                      <Badge
                                        size="xs"
                                        color="blue"
                                        variant="light"
                                      >
                                        Active
                                      </Badge>
                                    )}
                                    {isRecent && (
                                      <Badge
                                        size="xs"
                                        color="green"
                                        variant="light"
                                      >
                                        Recent
                                      </Badge>
                                    )}
                                  </Group>
                                </div>
                              </Group>
                              <Action
                                icon="Switch"
                                size="sm"
                                variant="light"
                                onClick={() => handleOpenProject(project.path)}
                                disabled={isLoading}
                              />
                            </Group>

                            {/* Project Metadata */}
                            <Group
                              justify="space-between"
                              style={{ fontSize: '11px' }}
                            >
                              <Text size="xs" c="dimmed">
                                {new Date(
                                  project.lastOpened,
                                ).toLocaleDateString()}{' '}
                                at{' '}
                                {new Date(
                                  project.lastOpened,
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Text>
                              <StatusIndicator
                                status={
                                  project.isActive ? 'healthy' : 'inactive'
                                }
                                label=""
                                size="xs"
                              />
                            </Group>
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </Modal>
  );
};
