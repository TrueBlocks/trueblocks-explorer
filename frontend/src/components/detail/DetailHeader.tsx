import { Text } from '@mantine/core';

export interface DetailHeaderProps {
  children: React.ReactNode;
}

export const DetailHeader = ({ children }: DetailHeaderProps) => {
  return (
    <Text variant="primary" size="md" fw={600}>
      {children}
    </Text>
  );
};
