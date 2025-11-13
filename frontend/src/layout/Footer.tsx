import { useEffect, useState } from 'react';

import { GetFilename, GetOrgPreferences } from '@app';
import { ChevronButton, Socials, getBarSize } from '@components';
import { useEvent, usePreferences } from '@hooks';
import { AppShell, Flex, Text } from '@mantine/core';
import { msgs, preferences, project } from '@models';

export const Footer = () => {
  var [org, setOrg] = useState<preferences.OrgPreferences>({});
  const { menuCollapsed, chromeCollapsed, setChromeCollapsed } =
    usePreferences();

  useEffect(() => {
    const fetchOrgName = async () => {
      GetOrgPreferences().then((data) => {
        setOrg(data);
      });
    };
    fetchOrgName();
  }, []);

  return (
    <AppShell.Footer ml={getBarSize('menu', menuCollapsed) - 1} p={0}>
      <Flex
        h="100%"
        px={chromeCollapsed ? 4 : 'md'}
        align="center"
        w="100%"
        gap={chromeCollapsed ? 4 : 'md'}
      >
        <Flex align="center" gap={4} style={{ flex: 1 }}>
          <ChevronButton
            collapsed={chromeCollapsed}
            onToggle={() => setChromeCollapsed(!chromeCollapsed)}
            direction="down"
            title="Restore layout"
          />
          {!chromeCollapsed && <FilePanel />}
        </Flex>
        <Flex align="center" justify="center" style={{ flex: 1 }}>
          {!chromeCollapsed && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Text variant="primary" size="sm">
                {org.developerName} © 2025
              </Text>
            </div>
          )}
        </Flex>
        <Flex align="center" justify="flex-end" style={{ flex: 1 }}>
          {!chromeCollapsed && <Socials />}
        </Flex>
      </Flex>
    </AppShell.Footer>
  );
};

export const FilePanel = () => {
  const [status, setStatus] = useState<project.Project | null>(null);

  useEffect(() => {
    const fetchFilename = async () => {
      setStatus(await GetFilename());
    };
    fetchFilename();
  }, []);

  useEvent(msgs.EventType.MANAGER, async (_message?: string) => {
    setStatus(await GetFilename());
  });

  return (
    <>
      <Text variant="primary" size="md">
        {status ? status.name : 'No Open Project'}
      </Text>
    </>
  );
};
