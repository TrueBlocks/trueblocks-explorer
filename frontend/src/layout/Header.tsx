import { useEffect, useState } from 'react';

import { GetAppId } from '@app';
import {
  Action,
  ProjectContextBar,
  SkinSwitcher,
  WalletConnectButton,
} from '@components';
import { usePreferences } from '@hooks';
import { AppShell, Group, Text } from '@mantine/core';

export const Header = () => {
  const [baseName, setBaseName] = useState('');
  const {
    setDebugCollapsed,
    debugCollapsed,
    chromeCollapsed,
    toggleTheme,
    isDarkMode,
  } = usePreferences();

  useEffect(() => {
    GetAppId().then((id) => {
      setBaseName(id.baseName);
    });
  }, []);

  if (chromeCollapsed) return <></>;

  return (
    <AppShell.Header>
      <Group justify="space-between" p="md" h="100%">
        <Text size="36px" fw={700} style={{ lineHeight: 1 }}>
          {baseName}
        </Text>
        <ProjectContextBar />
        <Group justify="flex-end" align="center" gap="xs">
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
            variant={debugCollapsed ? 'default' : 'filled'}
          />
          <Action
            icon="Light"
            iconOff="Dark"
            isOn={!isDarkMode}
            onClick={() => toggleTheme()}
            title={
              isDarkMode
                ? 'Dark mode ON - Click for light mode'
                : 'Light mode ON - Click for dark mode'
            }
            variant={isDarkMode ? 'default' : 'filled'}
          />
          <SkinSwitcher collapsed />
          <WalletConnectButton />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
