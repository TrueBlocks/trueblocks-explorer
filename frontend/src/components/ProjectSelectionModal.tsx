import { useEffect, useRef, useState } from 'react';

import { AddAddressesToProject, SaveProject } from '@app';
import {
  Action,
  AddressInput,
  StatusIndicator,
  StyledBadge,
  StyledButton,
  StyledModal,
  StyledText,
} from '@components';
import { useViewContext } from '@contexts';
import { useActiveProject, useIconSets } from '@hooks';
import { Card, Group, Paper, Stack, TextInput, Title } from '@mantine/core';
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
      const trimmedValues = {
        ...values,
        addresses: values.addresses?.trim() || '',
      };
      await newProject(values.name, '');
      await AddAddressesToProject(trimmedValues.addresses);

      // Immediately save the project after creation/updates
      await SaveProject();

      await restoreProjectFilterStates();

      const targetView = lastView || '/projects'; // DEFAULT_ROUTE
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

      const targetView = lastView || '/projects'; // DEFAULT_ROUTE
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

      const targetView = lastView || '/projects'; // DEFAULT_ROUTE
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
    <StyledModal
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
          <StyledText variant="dimmed" size="md">
            {hasActiveProject
              ? 'Choose a different project or create a new one'
              : 'An active project with at least one address is required to continue'}
          </StyledText>
        </div>

        {error && (
          <StyledText variant="error" size="sm">
            {error}
          </StyledText>
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
                  <StyledButton
                    type="submit"
                    loading={loadingCreate}
                    disabled={isLoading}
                    leftSection={<Create size={16} />}
                    fullWidth
                  >
                    Create Project
                  </StyledButton>
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

              <StyledButton
                variant="outline"
                leftSection={<File size={16} />}
                onClick={handleOpenFile}
                loading={loadingOpen}
                disabled={isLoading}
                fullWidth
              >
                Browse for Project File
              </StyledButton>

              {projects.length > 0 && (
                <>
                  <StyledText variant="primary" size="sm" fw={600}>
                    Recent Projects
                  </StyledText>
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
                                    <StyledText
                                      variant="primary"
                                      size="sm"
                                      fw={project.isActive ? 600 : 400}
                                    >
                                      {project.name}
                                    </StyledText>
                                    {project.isActive && (
                                      <StyledBadge variant="filled" size="xs">
                                        Active
                                      </StyledBadge>
                                    )}
                                    {isRecent && (
                                      <StyledBadge variant="light" size="xs">
                                        Recent
                                      </StyledBadge>
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
                              <StyledText variant="dimmed" size="xs">
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
                              </StyledText>
                              <StatusIndicator
                                status={
                                  project.isActive ? 'healthy' : 'inactive'
                                }
                                label=""
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
    </StyledModal>
  );
};
