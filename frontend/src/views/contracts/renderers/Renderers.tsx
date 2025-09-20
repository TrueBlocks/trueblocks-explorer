import { ReactElement } from 'react';

import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { contracts, types } from '@models';

import { ContractDashboard } from './dashboard/ContractDashboard';
import { ContractExecute } from './execute/ContractExecute';

function Dashboard({
  contractState,
  onRefresh,
}: {
  contractState?: types.Contract;
  onRefresh: () => void;
}) {
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
          <Text size="sm" color="dimmed">
            {contractState.name} ({contractState.address?.toString()})
          </Text>
        )}
        <ContractDashboard
          contractState={contractState}
          onRefresh={onRefresh}
        />
      </Stack>
    </Container>
  );
}

function Execute({ contractState }: { contractState?: types.Contract }) {
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
        <Title order={3}>Contract Interactions</Title>
        {contractState.name && (
          <Text size="sm" color="dimmed">
            {contractState.name} ({contractState.address?.toString()})
          </Text>
        )}
        <ContractExecute contractState={contractState} functionName="all" />
      </Stack>
    </Container>
  );
}

export function renderers(
  pageData: contracts.ContractsPage | null,
  fetchData: () => void,
) {
  return {
    [types.DataFacet.DASHBOARD]: () => {
      const contractState = pageData?.contracts?.[0];
      return (
        <Dashboard
          contractState={contractState as unknown as types.Contract | undefined}
          onRefresh={() => fetchData()}
        />
      );
    },
    [types.DataFacet.EXECUTE]: () => {
      const contractState = pageData?.contracts?.[0];
      return (
        <Execute
          contractState={contractState as unknown as types.Contract | undefined}
        />
      );
    },
  } as Record<types.DataFacet, () => ReactElement>;
}
