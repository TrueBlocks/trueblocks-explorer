import {
  AddressSelector,
  ChainSelector,
  ContractSelector,
  PeriodSelector,
} from '@components';
import { useActiveProject, useElements } from '@hooks';
import { Group, Loader, Text } from '@mantine/core';

export const ProjectContextBar = ({}) => {
  const { loading } = useActiveProject();
  const {
    hideAddressSelector,
    hideChainSelector,
    hideContractSelector,
    hidePeriodSelector,
  } = useElements();

  if (loading) {
    return (
      <Group justify="center" p="md">
        <Loader size="sm" />
        <Text variant="primary" size="sm">
          Loading project context...
        </Text>
      </Group>
    );
  }

  return (
    <>
      <Group gap="xs" pb="0.5rem">
        {!hideAddressSelector && <AddressSelector label={'Active Address:'} />}
        {!hideChainSelector && <ChainSelector label={'Chain:'} />}
        {!hideContractSelector && <ContractSelector visible={true} />}
        {!hidePeriodSelector && <PeriodSelector label={'Period'} />}
      </Group>
    </>
  );
};
