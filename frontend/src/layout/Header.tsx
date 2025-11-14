import { useEffect, useState } from 'react';

import { GetAppId } from '@app';
import {
  DebugToggle,
  LightDarkToggle,
  ProjectContextBar,
  SkinSwitcher,
  WalletConnectButton,
} from '@components';
import { usePreferences } from '@hooks';
import { AppShell, Group, Title } from '@mantine/core';

export const Header = () => {
  const [baseName, setBaseName] = useState('');
  const { chromeCollapsed } = usePreferences();

  useEffect(() => {
    GetAppId().then((id) => {
      setBaseName(id.baseName);
    });
  }, []);

  if (chromeCollapsed) return <></>;

  return (
    <AppShell.Header>
      <Group justify="space-between" p="md" h="100%">
        <Title order={2}>{baseName}</Title>
        <ProjectContextBar />
        <Group justify="flex-end" align="center" gap="xs">
          <DebugToggle />
          <LightDarkToggle />
          <SkinSwitcher collapsed />
          <WalletConnectButton />
        </Group>
      </Group>
    </AppShell.Header>
  );
};
