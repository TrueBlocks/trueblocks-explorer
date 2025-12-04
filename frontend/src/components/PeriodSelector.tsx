import { StyledSelect } from '@components';
import { useActiveProject } from '@hooks';
import { Text } from '@mantine/core';
import { types } from '@models';
import { PeriodOptions } from '@utils';

interface PeriodSelectorProps {
  label?: string;
  visible?: boolean;
}

export const PeriodSelector = ({
  label,
  visible = true,
}: PeriodSelectorProps) => {
  const { activePeriod, setActivePeriod } = useActiveProject();

  const handlePeriodChange = (pp: string | null) => {
    if (pp !== null) {
      const period = pp as types.Period;
      setActivePeriod(period);
    }
  };

  if (!visible) return null;
  return (
    <>
      {label && <Text size="sm">{label}</Text>}
      <StyledSelect
        size="sm"
        placeholder="Period"
        value={activePeriod}
        data={PeriodOptions}
        onChange={handlePeriodChange}
        w={110}
      />
    </>
  );
};
