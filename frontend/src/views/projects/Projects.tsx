import { useState } from 'react';

import { Action, StyledBadge, StyledButton, StyledText } from '@components';
import { useViewContext } from '@contexts';
import { ProjectInfo, useActiveProject, useIconSets } from '@hooks';
import {
  Card,
  Container,
  Grid,
  Group,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Log } from '@utils';
import { useLocation } from 'wouter';

interface NewProjectForm {
  name: string;
  address: string;
  description: string;
}

export const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { File, Create } = useIconSets();
  const { restoreProjectFilterStates } = useViewContext();
  const { projects, loading, lastView, newProject, switchProject } =
    useActiveProject();
  const [, navigate] = useLocation();

  const form = useForm<NewProjectForm>({
    initialValues: {
      name: '',
      address: '',
      description: '',
    },
    validate: {
      name: (value) => (!value ? 'Project name is required' : null),
      address: (value) => {
        if (!value) return 'Primary address is required';
        if (value.endsWith('.eth')) {
          if (value.length < 5) return 'ENS name too short';
          if (!/^[a-z0-9-]+\.eth$/i.test(value))
            return 'Invalid ENS name format';
          return null;
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return 'Invalid Ethereum address format (use 0x... or .eth name)';
        }
        return null;
      },
    },
  });

  const handleCreateProject = async (values: NewProjectForm) => {
    try {
      setCreating(true);
      await newProject(values.name, values.address);

      // Reset form and hide create form
      form.reset();
      setShowCreateForm(false);
    } catch (err) {
      setError(`Failed to create project: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleSwitchProject = async (projectId: string) => {
    try {
      await switchProject(projectId);
      await restoreProjectFilterStates();

      const targetView = lastView || '/';
      navigate(targetView);
    } catch (err) {
      setError(`Failed to switch to project: ${err}`);
    }
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const renderProject = (project: ProjectInfo) => (
    <Card key={project.id} shadow="sm" padding="md" radius="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" align="center">
              <Title order={5} size="sm">
                {project.name}
              </Title>
              {project.isActive && (
                <StyledBadge variant="filled" size="xs">
                  Active
                </StyledBadge>
              )}
            </Group>

            <StyledText variant="dimmed" size="xs">
              {project.path}
            </StyledText>

            {project.description && (
              <StyledText variant="primary" size="sm">
                {project.description}
              </StyledText>
            )}

            <Group gap="xs" mt="xs">
              <StyledText variant="dimmed" size="xs">
                Last opened: {new Date(project.lastOpened).toLocaleDateString()}
              </StyledText>
              {project.addresses && project.addresses.length > 0 && (
                <StyledBadge variant="light" size="xs">
                  {project.addresses.length} address
                  {project.addresses.length > 1 ? 'es' : ''}
                </StyledBadge>
              )}
            </Group>
          </div>

          <Group gap="xs">
            {!project.isActive && (
              <Action
                icon="Switch"
                title="Switch to this project"
                variant="filled"
                size="sm"
                onClick={() => handleSwitchProject(project.id)}
              />
            )}
            <Action
              icon="Update"
              title="Update project"
              variant="light"
              size="sm"
              onClick={() => {
                // TODO: Implement project editing
                Log('Update project clicked - not implemented yet');
              }}
            />
            <Action
              icon="Delete"
              title="Close project"
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement project closing with confirmation
                Log('Close project clicked - not implemented yet');
              }}
            />
          </Group>
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container size="lg" py="md">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Project Manager</Title>
            <StyledText variant="dimmed" size="md">
              Manage your projects
            </StyledText>
          </div>

          <StyledButton
            leftSection={<Create size={16} />}
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? 'light' : 'filled'}
          >
            {showCreateForm ? 'Cancel' : 'New Project'}
          </StyledButton>
        </Group>

        {/* Error Display */}
        {error && (
          <StyledText variant="error" size="sm">
            {error}
          </StyledText>
        )}

        {/* Create Project Form */}
        {showCreateForm && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Create New Project
            </Title>

            <form onSubmit={form.onSubmit(handleCreateProject)}>
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Project Name"
                      placeholder="My Analysis Project"
                      required
                      {...form.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Primary Address"
                      placeholder="0x... or vitalik.eth"
                      required
                      {...form.getInputProps('address')}
                    />
                  </Grid.Col>
                </Grid>

                <TextInput
                  label="Description (Optional)"
                  placeholder="Brief description of this project"
                  {...form.getInputProps('description')}
                />

                <Group gap="xs">
                  <StyledButton
                    type="submit"
                    loading={creating}
                    leftSection={<Create size={16} />}
                  >
                    Create Project
                  </StyledButton>
                  <StyledButton
                    variant="light"
                    onClick={() => {
                      setShowCreateForm(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </StyledButton>
                </Group>
              </Stack>
            </form>
          </Card>
        )}

        {/* Search */}
        <Group gap="md">
          <TextInput
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        {/* Open Projects */}
        <div>
          <Title order={3} mb="md">
            Open Projects ({filteredProjects.length})
          </Title>

          {loading ? (
            <StyledText variant="primary">Loading projects...</StyledText>
          ) : filteredProjects.length === 0 ? (
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <File size={48} opacity={0.5} />
                <div style={{ textAlign: 'center' }}>
                  <StyledText variant="primary" size="lg" fw={600}>
                    {searchQuery
                      ? 'No projects match your search'
                      : 'No open projects'}
                  </StyledText>
                  <StyledText variant="dimmed" size="sm">
                    {searchQuery
                      ? 'Try a different search term or clear the search'
                      : 'Create a new project to get started with blockchain analysis'}
                  </StyledText>
                </div>
                {!searchQuery && (
                  <StyledButton
                    leftSection={<Create size={16} />}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Create Your First Project
                  </StyledButton>
                )}
              </Stack>
            </Card>
          ) : (
            <Grid>
              {filteredProjects.map((project) => (
                <Grid.Col key={project.id} span={{ base: 12, md: 6, lg: 4 }}>
                  {renderProject(project)}
                </Grid.Col>
              ))}
            </Grid>
          )}
        </div>
      </Stack>
    </Container>
  );
};
