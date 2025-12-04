import { useEffect, useState } from 'react';

import { GetContracts } from '@app';
import { StyledSelect } from '@components';
import { useActiveProject } from '@hooks';
import { Text } from '@mantine/core';
import { types } from '@models';

interface ContractSelectorProps {
  label?: string;
  visible?: boolean;
}

export const ContractSelector = ({
  label,
  visible = true,
}: ContractSelectorProps) => {
  const [contracts, setContracts] = useState<types.Contract[]>([]);
  const { activeContract, setActiveContract } = useActiveProject();

  useEffect(() => {
    GetContracts().then((contracts) => {
      setContracts(contracts);
    });
  }, []);

  const contractOptions = contracts.map((contract) => ({
    value: contract.address?.toString() || '',
    label: `${contract.name} (${contract.address?.toString().slice(0, 6)}...${contract.address?.toString().slice(-4)})`,
  }));

  const handleContractChange = async (contract: string | null) => {
    const contractValue = contract || '';
    if (contractValue !== activeContract) {
      await setActiveContract(contractValue);
    }
  };

  if (!visible) return null;
  return (
    <>
      {label && <Text size="sm">{label}</Text>}
      <StyledSelect
        size="sm"
        placeholder="Contract"
        value={activeContract}
        data={contractOptions}
        onChange={handleContractChange}
        w={140}
      />
    </>
  );
};
