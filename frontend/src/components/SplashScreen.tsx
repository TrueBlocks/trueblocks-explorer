import { Center, Loader, Stack } from '@mantine/core';
import { StyledText } from 'src/components/StyledText';

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
        <StyledText variant="secondary">{message}</StyledText>
      </Stack>
    </Center>
  );
};
