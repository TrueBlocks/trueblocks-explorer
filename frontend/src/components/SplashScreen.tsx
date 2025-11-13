import { Center, Loader, Stack, Text } from '@mantine/core';

interface SplashScreenProps {
  message?: string;
  showSpinner?: boolean;
}

export const SplashScreen = ({
  message = 'Loading TrueBlocks Explorer...',
  showSpinner = true,
}: SplashScreenProps) => {
  return (
    <Center
      bg="body"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      <Stack align="center" gap="md">
        {showSpinner && <Loader size="lg" color="primary.6" />}
        <Text variant="secondary" size="md">
          {message}
        </Text>
      </Stack>
    </Center>
  );
};
