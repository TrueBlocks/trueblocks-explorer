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
  const [appName, setAppName] = useState('AppName');
  const { setDebugCollapsed, debugCollapsed, chromeCollapsed } =
    usePreferences();

  useEffect(() => {
    GetAppId().then((id) => {
      setAppName(id.appName);
    });
  }, []);

  if (chromeCollapsed) return <></>;

  return (
    <AppShell.Header>
      <Group justify="space-between" p="md" h="100%">
        <Text size="xl" fw={700}>
          {appName}
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
            variant="default"
            color={debugCollapsed ? 'gray' : 'red'}
          />
          <SkinSwitcher collapsed />
          <WalletConnectButton />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
