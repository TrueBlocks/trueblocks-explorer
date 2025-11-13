import { Text } from '@mantine/core';

export const ShouldNotHappen = ({ message }: { message: string }) => (
  <Text variant="error" size="sm">
    Error: {message}
  </Text>
);
