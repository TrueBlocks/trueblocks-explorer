import { useEffect, useState } from 'react';

import { GetLastFacet, GetMarkdown } from '@app';
import { ChevronButton, StyledText } from '@components';
import { useActiveProject, usePreferences } from '@hooks';
import { AppShell, Stack } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { useLocation } from 'wouter';

export const HelpBar = () => {
  const [markdown, setMarkdown] = useState<string>('Loading...');
  const [currentLocation] = useLocation();
  const { lastView } = useActiveProject();
  const {
    helpCollapsed,
    setHelpCollapsed,
    chromeCollapsed,
    setChromeCollapsed,
  } = usePreferences();

  useEffect(() => {
    var headerText = currentLocation.startsWith('/')
      ? currentLocation.slice(1) || 'Home'
      : currentLocation || 'Home';
    headerText = `${headerText.charAt(0).toUpperCase() + headerText.slice(1)} View`;
    const fetchMarkdown = async () => {
      try {
        const currentFacet = await GetLastFacet(lastView);
        const content = await GetMarkdown(
          'help',
          currentLocation,
          currentFacet,
        );
        setMarkdown(`# ${headerText}\n\n${content}`);
      } catch (rawErr) {
        const errMsg =
          rawErr instanceof Error ? rawErr.message : String(rawErr);
        setMarkdown(`# ${headerText}\n\nError loading help content: ${errMsg}`);
      }
    };

    if (helpCollapsed) {
      setMarkdown(`# ${headerText}\n\nLoading...`);
    } else {
      fetchMarkdown();
    }
  }, [currentLocation, helpCollapsed, lastView]);

  if (chromeCollapsed) {
    return (
      <AppShell.Aside
        style={{
          transition: 'width 0.2s ease',
          width: 25,
          borderLeft: '1px solid var(--mantine-color-gray-4)',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <ChevronButton
          collapsed={chromeCollapsed}
          onToggle={() => setChromeCollapsed(false)}
          direction="right"
          title="Restore layout"
        />
      </AppShell.Aside>
    );
  }

  return (
    <AppShell.Aside p="md" style={{ transition: 'width 0.2s ease' }}>
      <ChevronButton
        collapsed={helpCollapsed}
        onToggle={() => setHelpCollapsed(!helpCollapsed)}
        direction="right"
      />
      {helpCollapsed ? (
        <StyledText
          variant="primary"
          style={{
            transform: 'rotate(90deg)',
            whiteSpace: 'nowrap',
            position: 'absolute',
            top: 'calc(20px + 36px)',
            left: '36px',
            transformOrigin: 'left top',
            size: 'xs',
          }}
        >
          {markdown.split('\n')[0]?.replace('# ', '')}
        </StyledText>
      ) : (
        <Stack gap="sm" style={{ overflowY: 'auto' }}>
          <Markdown>{markdown}</Markdown>
        </Stack>
      )}
    </AppShell.Aside>
  );
};
