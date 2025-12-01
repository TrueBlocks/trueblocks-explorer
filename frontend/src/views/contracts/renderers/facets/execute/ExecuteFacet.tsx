// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import { RendererParams } from '@components';
import { useActiveProject } from '@hooks';
import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { types } from '@models';

import { ContractExecute } from '../../components/execute/ContractExecute';

// EXISTING_CODE

export const ExecuteFacet = ({ params }: { params: RendererParams }) => {
  // EXISTING_CODE
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
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
