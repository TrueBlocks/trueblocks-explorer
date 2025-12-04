import { StyledSelect } from '@components';
import { useActiveProject } from '@hooks';
import { Text } from '@mantine/core';

interface ChainSelectorProps {
  label?: string;
  visible?: boolean;
}

export const ChainSelector = ({
  label,
  visible = true,
}: ChainSelectorProps) => {
  const { activeChain, setActiveChain } = useActiveProject();
  const { projects } = useActiveProject();

  const currentProject = projects.find((p) => p.isActive);

  const chainOptions =
    currentProject?.chains?.map((chain) => ({
      value: chain,
      label: chain,
    })) || [];

  const handleChainChange = async (chain: string | null) => {
    if (chain && chain !== activeChain) {
      await setActiveChain(chain);
    }
  };

  if (!visible) return null;

  return (
    <>
      {label && <Text size="sm">{label}</Text>}
      <StyledSelect
        size="sm"
        placeholder="Chain"
        value={activeChain}
        data={chainOptions}
        onChange={handleChainChange}
        w={120}
      />
    </>
  );
};
