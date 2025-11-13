import { Action, StyledBadge, StyledButton } from '@components';
import { ProjectInfo, useIconSets } from '@hooks';
import {
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

interface ProjectCardProps {
  projects: ProjectInfo[];
  onSwitchProject: (projectId: string) => Promise<void>;
  onUpdateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
  loading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProjectCard = ({
  projects,
  onSwitchProject,
  onUpdateProject,
  onDeleteProject,
  onNewProject,
  loading = false,
  searchQuery,
  onSearchChange,
}: ProjectCardProps) => {
  const { File, Create } = useIconSets();

  // Filter projects based on search query
  const filteredProjects = projects
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description &&
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => a.path.localeCompare(b.path));

  // Render individual project card with optimized re-rendering
  const renderProject = (project: ProjectInfo) => {
    const cardStyle =
      filteredProjects.length === 1 ? { minWidth: '300px' } : {};

    // Enhanced styling for active projects
    const activeCardStyle = project.isActive
      ? {
          ...cardStyle,
          borderColor: 'var(--mantine-color-blue-6)',
          borderWidth: '2px',
          backgroundColor: 'var(--mantine-color-blue-0)',
        }
      : {
          ...cardStyle,
          cursor: 'pointer', // Show clickable cursor for non-active projects
        };

    const handleCardClick = () => {
      // Only allow activation of non-active projects
      if (!project.isActive) {
        onSwitchProject(project.id);
      }
    };

    return (
      <Card
        key={project.id}
        shadow={project.isActive ? 'md' : 'sm'}
        padding="md"
        radius="md"
        withBorder
        style={activeCardStyle}
        onClick={handleCardClick}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Group gap="xs" align="center">
                <Title order={5} size="sm" fw={project.isActive ? 700 : 500}>
                  {project.name}
                </Title>
                {project.isActive && (
                  <StyledBadge variant="filled" size="sm">
                    ● Active
                  </StyledBadge>
                )}
              </Group>

              <Text variant="dimmed" size="sm">
                {project.path}
              </Text>

              {project.description && (
                <Text variant="primary" size="sm">
                  {project.description}
                </Text>
              )}

              <Group gap="xs" mt="xs">
                <Text variant="dimmed" size="sm">
                  Last opened:{' '}
                  {new Date(project.lastOpened).toLocaleDateString()}
                </Text>
                {project.addresses && project.addresses.length > 0 && (
                  <StyledBadge variant="light" size="xs">
                    {project.addresses.length} address
                    {project.addresses.length > 1 ? 'es' : ''}
                  </StyledBadge>
                )}
              </Group>
            </div>

            <Group
              gap="xs"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking actions
            >
              <Action
                icon="DebugOn"
                title="View project"
                variant="light"
                size="sm"
                onClick={() => onSwitchProject(project.id)}
              />
              <Action
                icon="Update"
                title="Update project"
                variant="light"
                size="sm"
                onClick={() => onUpdateProject(project.id)}
              />
              <Action
                icon="Delete"
                title="Close project"
                variant="outline"
                size="sm"
                onClick={() => onDeleteProject(project.id)}
              />
            </Group>
          </Group>
        </Stack>
      </Card>
    );
  };

  return (
    <Container size="lg" py="md">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Project Manager</Title>
            <Text variant="dimmed" size="md">
              Manage your projects
            </Text>
          </div>

          <StyledButton
            leftSection={<Create size={16} />}
            onClick={onNewProject}
            variant="filled"
          >
            New Project
          </StyledButton>
        </Group>

        <Group gap="md">
          <TextInput
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        {/* Project List */}
        <div>
          <Title order={3}>Open Projects ({filteredProjects.length})</Title>

          {loading ? (
            <Text variant="primary" size="md">
              Loading projects...
            </Text>
          ) : filteredProjects.length === 0 ? (
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <File size={48} opacity={0.5} />
                <div style={{ textAlign: 'center' }}>
                  <Text variant="primary" size="md" fw={600}>
                    {searchQuery
                      ? 'No projects match your search'
                      : 'No open projects'}
                  </Text>
                  <Text variant="dimmed" size="sm">
                    {searchQuery
                      ? 'Try a different search term or clear the search'
                      : 'Create a new project to get started with blockchain analysis'}
                  </Text>
                </div>
                {!searchQuery && (
                  <StyledButton
                    leftSection={<Create size={16} />}
                    onClick={onNewProject}
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
