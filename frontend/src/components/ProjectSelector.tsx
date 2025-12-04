import { StyledSelect } from '@components';
import { useActiveProject, useEvent } from '@hooks';
import { Text } from '@mantine/core';
import { msgs } from '@models';

interface ProjectSelectorProps {
  label?: string;
  visible?: boolean;
}

export const ProjectSelector = ({
  label,
  visible = true,
}: ProjectSelectorProps) => {
  const { projects, switchProject } = useActiveProject();

  const currentProject = projects.find((p) => p.isActive);

  useEvent(msgs.EventType.MANAGER, async (_message?: string) => {
    // Refresh project data when manager events occur
    // The useActiveProject hook will handle the refresh internally
  });

  const projectOptions = projects.map((project) => {
    const count = project.addresses?.length || 0;
    const addressText = count === 1 ? 'address' : 'addresses';
    return {
      value: project.id,
      label: `${project.name} (${count} ${addressText})`,
    };
  });

  const handleProjectChange = async (projectId: string | null) => {
    if (projectId && projectId !== currentProject?.id) {
      await switchProject(projectId);
    }
  };

  if (!visible) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {label && (
        <Text size="sm" style={{ whiteSpace: 'nowrap' }}>
          {label}
        </Text>
      )}
      <StyledSelect
        size="sm"
        placeholder="Project"
        value={currentProject?.id || ''}
        data={projectOptions}
        onChange={handleProjectChange}
        w={400}
        style={{
          height: '24px',
          margin: 0,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
        }}
        renderOption={({ option, checked }) => (
          <div
            style={{
              fontSize: checked ? '14px' : '12px',
              fontWeight: checked ? 'bold' : 'normal',
            }}
          >
            {option.label}
          </div>
        )}
        checkIconPosition="right"
        withCheckIcon={false}
      />
    </div>
  );
};
