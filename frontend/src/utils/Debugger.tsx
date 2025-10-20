import { ActionDefinition, useActiveProject } from '@hooks';
import { usePreferences } from '@hooks';
import { Badge, Group } from '@mantine/core';
import { types } from '@models';

import { StateDisplay } from './';

const debuggerStyle = {
  backgroundColor: 'var(--skin-surface-elevated)',
  color: '#2e2e2e',
  padding: '10px',
  margin: '5px 0',
  fontSize: '12px',
  fontFamily: 'monospace',
  border: '1px solid var(--skin-border-secondary)',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  fontWeight: 'bold',
} as const;

interface DebuggerProps {
  facetName: string;
  rowActions: ActionDefinition[];
  headerActions: ActionDefinition[];
  count: number;
  state: types.StoreState;
  totalItems?: number;
}

export const Debugger: React.FC<DebuggerProps> = ({
  rowActions,
  headerActions,
  count,
  facetName,
  state,
  totalItems,
}) => {
  const { activeChain, activeAddress, activeContract } = useActiveProject();
  const { debugCollapsed, lastSkin, isDarkMode } = usePreferences();
  if (debugCollapsed) {
    return <></>;
  }

  return (
    <>
      <Group style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <ActionDebugger
            rowActions={rowActions}
            headerActions={headerActions}
          />
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <StateDisplay
            style={debuggerStyle}
            facetName={facetName}
            state={state}
            totalItems={totalItems}
          />
        </div>
      </Group>
      <div style={debuggerStyle}>
        {`Renders: ${count} [${activeChain || 'N/A'}] [${activeAddress || 'N/A'}] [${activeContract || 'N/A'}] [${lastSkin || 'N/A'}] [${isDarkMode ? 'dark' : 'light'}]`}
      </div>
    </>
  );
};

interface ActionDebuggerProps {
  rowActions: ActionDefinition[];
  headerActions: ActionDefinition[];
}

export const ActionDebugger: React.FC<ActionDebuggerProps> = ({
  rowActions,
  headerActions,
}) => {
  const { debugCollapsed } = usePreferences();
  if (debugCollapsed) {
    return <></>;
  }

  return (
    <div style={debuggerStyle}>
      <ActionsList prompt="Row Actions" actions={rowActions} />{' '}
      <ActionsList prompt="Header Actions" actions={headerActions} />
    </div>
  );
};

const ActionsList: React.FC<{
  prompt: string;
  actions: ActionDefinition[];
}> = ({ prompt, actions }) => {
  return (
    <>
      <strong style={{ color: '#2e2e2e' }}>{prompt}:</strong>{' '}
      {actions.length === 0 ? (
        <span style={{ color: '#2e2e2e', fontStyle: 'italic' }}>None</span>
      ) : (
        actions.map((action) => {
          const actionTypeColors: Record<string, string> = {
            delete: 'red',
            remove: 'red',
            create: 'green',
            update: 'green',
            autoname: 'orange',
            publish: 'grape',
            pin: 'grape',
          };

          const color = actionTypeColors[action.type] || 'blue';

          return (
            <Badge
              key={action.type}
              color={color}
              variant="filled"
              size="sm"
              style={{ margin: '0 5px' }}
            >
              {action.type}
            </Badge>
          );
        })
      )}
    </>
  );
};
