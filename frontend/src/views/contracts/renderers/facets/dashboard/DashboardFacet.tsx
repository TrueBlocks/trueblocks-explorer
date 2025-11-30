import { RendererParams } from '@components';
import { useActiveProject } from '@hooks';
import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { types } from '@models';

import { ContractDashboard } from '../../components/dashboard/ContractDashboard';

export const DashboardFacet = ({ params }: { params: RendererParams }) => {
  const { data } = params;
  const contracts = (data || []) as unknown as types.Contract[];
  const { activeContract } = useActiveProject();

  if (!contracts || contracts.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Alert variant="light" title="No contract data">
          No contract data available
        </Alert>
      </Container>
    );
  }

  const contractState = activeContract
    ? contracts.find((c) => c.address?.toString() === activeContract) ||
      contracts[0]
    : contracts[0];

  if (!contractState) {
    return (
      <Container size="lg" py="xl">
        <Alert variant="light" title="No contract data">
          Selected contract not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Title order={3}>Contract Dashboard</Title>
        {contractState.name && (
          <Text variant="dimmed" size="sm">
            {contractState.name} ({contractState.address?.toString()})
          </Text>
        )}
        <ContractDashboard contractState={contractState} />
      </Stack>
    </Container>
  );
};
