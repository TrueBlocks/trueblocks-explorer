import { RendererParams } from '@components';
import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { types } from '@models';

import { ContractExecute } from '../../components/execute/ContractExecute';

export const ExecuteFacet = ({ params }: { params: RendererParams }) => {
  const { data } = params;
  const pageData = data[0] || {};
  const contractState = pageData as unknown as types.Contract | undefined;

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
          <Text variant="dimmed" size="sm">
            {contractState.name} ({contractState.address?.toString()})
          </Text>
        )}
        <ContractExecute contractState={contractState} functionName="all" />
      </Stack>
    </Container>
  );
};
