import { useEffect, useState } from 'react';

import { GetOrgPreferences } from '@app';
import {
  ChevronButton,
  ProjectSelector,
  Socials,
  getBarSize,
} from '@components';
import { useElements, usePreferences } from '@hooks';
import { AppShell, Flex, Text } from '@mantine/core';
import { preferences } from '@models';

export const Footer = () => {
  var [org, setOrg] = useState<preferences.OrgPreferences>({});
  const { menuCollapsed, chromeCollapsed, setChromeCollapsed } =
    usePreferences();
  const { hideProjectSelector } = useElements();

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
        <Flex align="center" gap={4} style={{ flex: 1, minWidth: 0 }}>
          <ChevronButton
            collapsed={chromeCollapsed}
            onToggle={() => setChromeCollapsed(!chromeCollapsed)}
            direction="down"
            title="Restore layout"
          />
          {!chromeCollapsed && !hideProjectSelector && (
            <div style={{ minWidth: '500px' }}>
              <ProjectSelector label="Active Project:" />
            </div>
          )}
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
