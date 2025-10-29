import { Box, Stack, Text, Title } from '@mantine/core';

interface PanelDataWarningProps {
  facet: string;
}

export const PanelDataWarning = ({ facet }: PanelDataWarningProps) => {
  return (
    <Box p="md" style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}>
      <Stack gap="sm">
        <Title order={4}>No Panel Data Available</Title>
        <Text
          size="sm"
          style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
        >
          No bucket data was received for this custom panel.
        </Text>
        <Text
          size="xs"
          style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
        >
          This may indicate a store scoping configuration issue. Verify that
          getStoreKey() returns consistent scoping for facet: {facet}
        </Text>
      </Stack>
    </Box>
  );
};
