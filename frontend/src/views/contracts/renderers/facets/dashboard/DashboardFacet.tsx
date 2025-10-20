import { StyledText } from '@components';
import { Alert, Container, Stack, Title } from '@mantine/core';
import { types } from '@models';

import { ContractDashboard } from '../../components/dashboard/ContractDashboard';

interface DashboardFacetProps {
  data: Record<string, unknown>;
}

export const DashboardFacet = ({ data }: DashboardFacetProps) => {
  const contractState = data as unknown as types.Contract | undefined;

  if (!contractState) {
    return (
      <Container size="lg" py="xl">
        <Alert variant="light" title="No contract data">
          No contract data available
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3}>Contract Dashboard</Title>
        {contractState.name && (
          <StyledText variant="dimmed" size="sm">
            {contractState.name} ({contractState.address?.toString()})
          </StyledText>
        )}
        <ContractDashboard contractState={contractState} />
      </Stack>
    </Container>
  );
};
