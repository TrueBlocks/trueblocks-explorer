import {
  AddressSelector,
  ChainSelector,
  ContractSelector,
  PeriodSelector,
} from '@components';
import { useActiveProject } from '@hooks';
import { Group, Loader, Text } from '@mantine/core';

export const ProjectContextBar = ({}) => {
  const { loading } = useActiveProject();

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
        <AddressSelector label={'Active Address:'} />
        <ChainSelector label={'Chain:'} />
        <ContractSelector visible={false} />
        <PeriodSelector label={'Period'} />
      </Group>
    </>
  );
};
