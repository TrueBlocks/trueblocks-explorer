import { ActionDefinition, useActiveProject } from '@hooks';
import { usePreferences } from '@hooks';

interface DebuggerProps {
  rowActions: ActionDefinition[];
  headerActions: ActionDefinition[];
  count: number;
}

export const Debugger: React.FC<DebuggerProps> = ({
  rowActions,
  headerActions,
  count,
}) => {
  const { activeChain, activeAddress, activeContract } = useActiveProject();
  const { debugCollapsed, lastSkin, isDarkMode } = usePreferences();
  if (debugCollapsed) {
    return <></>;
  }

  return (
    <>
      <ActionDebugger rowActions={rowActions} headerActions={headerActions} />
      <div
        style={{
          backgroundColor: 'var(--skin-surface-elevated)',
          color: '#2e2e2e',
          padding: '8px 12px',
          margin: '5px 0',
          fontSize: '12px',
          fontFamily: 'monospace',
          border: '1px solid var(--skin-primary)',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          display: 'inline-block',
          fontWeight: 'bold',
        }}
      >
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
    <div
      style={{
        backgroundColor: 'var(--skin-surface-elevated)',
        color: '#2e2e2e',
        padding: '10px',
        marginBottom: '10px',
        fontSize: '13px',
        fontFamily: 'monospace',
        border: '1px solid var(--skin-border-secondary)',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <ActionsList prompt="Row Actions:" actions={rowActions} />{' '}
        <ActionsList prompt="Header Actions:" actions={headerActions} />
      </div>
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
          const actionTypeStyles: Record<
            string,
            { bgColor: string; textColor: string }
          > = {
            delete: { bgColor: '#e74c3c', textColor: 'white' },
            remove: { bgColor: '#e74c3c', textColor: 'white' },
            create: { bgColor: '#2ecc71', textColor: 'white' },
            update: { bgColor: '#2ecc71', textColor: 'white' },
            autoname: { bgColor: '#f39c12', textColor: 'white' },
            publish: { bgColor: '#9b59b6', textColor: 'white' },
            pin: { bgColor: '#9b59b6', textColor: 'white' },
          };

          const { bgColor, textColor } = actionTypeStyles[action.type] || {
            bgColor: '#3498db',
            textColor: '#2e2e2e',
          };

          return (
            <span
              key={action.type}
              style={{
                display: 'inline-block',
                backgroundColor: bgColor,
                color: textColor,
                padding: '3px 8px',
                margin: '0 5px',
                borderRadius: '3px',
                fontWeight: 'bold',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              {action.type}
            </span>
          );
        })
      )}
    </>
  );
};
