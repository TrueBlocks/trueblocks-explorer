import { useState } from 'react';

import { AddAddressModal, StyledSelect, StyledText } from '@components';
import { useActiveProject } from '@hooks';
import { Group, Loader } from '@mantine/core';
import { types } from '@models';
import { PeriodOptions, getDisplayAddress } from '@utils';

export const ProjectContextBar = ({}) => {
  const [addModalOpened, setAddModalOpened] = useState(false);

  const {
    projects,
    activeAddress,
    activeChain,
    activeContract,
    activePeriod,
    setActiveAddress,
    setActiveChain,
    setActiveContract,
    setActivePeriod,
    switchProject,
    loading,
  } = useActiveProject();

  const currentProject = projects.find((p) => p.isActive);

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: `${project.name}`,
  }));

  const addressOptions =
    currentProject?.addresses?.map((address) => ({
      value: address,
      label: getDisplayAddress(address),
    })) || [];

  addressOptions.push({
    value: '__add_address__',
    label: 'Add address...',
  });

  const chainOptions =
    currentProject?.chains?.map((chain) => ({
      value: chain,
      label: chain,
    })) || [];

  const contractOptions = [{ value: '', label: 'No Contract' }];

  const handleProjectChange = async (projectId: string | null) => {
    if (projectId && projectId !== currentProject?.id) {
      await switchProject(projectId);
    }
  };

  const handleAddressChange = async (address: string | null) => {
    if (address === '__add_address__') {
      setAddModalOpened(true);
      return;
    }
    if (address && address !== activeAddress) {
      await setActiveAddress(address);
    }
  };

  const handleChainChange = async (chain: string | null) => {
    if (chain && chain !== activeChain) {
      await setActiveChain(chain);
    }
  };

  const handleContractChange = async (contract: string | null) => {
    const contractValue = contract || '';
    if (contractValue !== activeContract) {
      await setActiveContract(contractValue);
    }
  };

  const handlePeriodChange = (pp: string | null) => {
    if (pp !== null) {
      const period = pp as types.Period;
      setActivePeriod(period);
    }
  };

  if (loading) {
    return (
      <Group justify="center" p="md">
        <Loader size="sm" />
        <StyledText variant="primary" size="sm">
          Loading project context...
        </StyledText>
      </Group>
    );
  }

  return (
    <>
      <Group gap="xs">
        <StyledSelect
          size="xs"
          placeholder="Project"
          value={currentProject?.id || ''}
          data={projectOptions}
          onChange={handleProjectChange}
          w={120}
        />
        <StyledSelect
          size="xs"
          placeholder="Address"
          value={activeAddress}
          data={addressOptions}
          onChange={handleAddressChange}
          w={140}
        />
        <StyledSelect
          size="xs"
          placeholder="Chain"
          value={activeChain}
          data={chainOptions}
          onChange={handleChainChange}
          w={100}
        />
        <StyledSelect
          size="xs"
          placeholder="Contract"
          value={activeContract}
          data={contractOptions}
          onChange={handleContractChange}
          w={140}
        />
        <StyledSelect
          size="xs"
          placeholder="Period"
          value={activePeriod}
          data={PeriodOptions}
          onChange={handlePeriodChange}
          w={110}
        />
      </Group>
      <AddAddressModal
        opened={addModalOpened}
        onSubmit={() => {
          setAddModalOpened(false);
        }}
        onCancel={() => {
          setAddModalOpened(false);
        }}
      />
    </>
  );
};
