import { Action } from '@components';
import { usePreferences } from '@hooks';

export const DebugToggle = () => {
  const { setDebugCollapsed, debugCollapsed } = usePreferences();

  return (
    <Action
      icon="DebugOn"
      iconOff="DebugOff"
      isOn={!debugCollapsed}
      onClick={() => setDebugCollapsed(!debugCollapsed)}
      title={
        debugCollapsed
          ? 'Debug mode OFF - Click to enable'
          : 'Debug mode ON - Click to disable'
      }
    />
  );
};
