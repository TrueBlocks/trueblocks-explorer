import { ProjectInfo } from '@hooks';
import { render, screen } from '@mocks';
import { describe, expect, it, vi } from 'vitest';

import { ProjectCard } from './ProjectCard';

const mockProjects: ProjectInfo[] = [
  {
    id: 'project-1',
    name: 'Test Project 1',
    path: '/path/to/project1',
    isActive: true,
    isDirty: false,
    lastOpened: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    description: 'Test project description',
    addresses: ['0x123', '0x456'],
    chains: ['mainnet'],
  },
  {
    id: 'project-2',
    name: 'Test Project 2',
    path: '/path/to/project2',
    isActive: false,
    isDirty: false,
    lastOpened: '2024-01-02T00:00:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    addresses: ['0x789'],
    chains: ['mainnet'],
  },
];

const defaultProps = {
  projects: mockProjects,
  onSwitchProject: vi.fn(),
  onUpdateProject: vi.fn(),
  onDeleteProject: vi.fn(),
  onNewProject: vi.fn(),
  searchQuery: '',
  onSearchChange: vi.fn(),
};

describe('ProjectCard', () => {
  it('renders project list correctly', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('Open Projects (2)')).toBeInTheDocument();
  });

  it('shows active badge for active project', () => {
    render(<ProjectCard {...defaultProps} />);

    expect(screen.getByText('● Active')).toBeInTheDocument();
  });

  it('shows empty state when no projects', () => {
    render(<ProjectCard {...defaultProps} projects={[]} />);

    expect(screen.getByText('No open projects')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Project')).toBeInTheDocument();
  });

  it('filters projects based on search query', () => {
    render(<ProjectCard {...defaultProps} searchQuery="Project 1" />);

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
    expect(screen.getByText('Open Projects (1)')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ProjectCard {...defaultProps} loading={true} />);

    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });
});
