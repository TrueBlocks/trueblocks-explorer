import { useEffect, useState } from 'react';

import { GetAppId } from '@app';
import {
  DebugToggle,
  LightDarkToggle,
  ProjectContextBar,
  SkinSwitcher,
  StyledText,
  WalletConnectButton,
} from '@components';
import { usePreferences } from '@hooks';
import { AppShell, Group } from '@mantine/core';

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
        <StyledText variant="primary" size="36px" fw={600}>
          {baseName}
        </StyledText>
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
