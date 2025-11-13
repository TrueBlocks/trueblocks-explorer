import { Box, Stack, Text, Title } from '@mantine/core';

interface PanelDataWarningProps {
  facet: string;
}

export const PanelDataWarning = ({ facet }: PanelDataWarningProps) => {
  return (
    <Box p="md" style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}>
      <Stack gap="sm">
        <Title order={4}>No Panel Data Available</Title>
        <Text variant="primary" size="sm">
          No bucket data was received for this custom panel.
        </Text>
        <Text variant="primary" size="sm">
          This may indicate a store scoping configuration issue. Verify that
          getStoreKey() returns consistent scoping for facet: {facet}
        </Text>
      </Stack>
    </Box>
  );
};
