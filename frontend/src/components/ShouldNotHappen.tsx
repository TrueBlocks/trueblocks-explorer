import { StyledText } from './StyledText';

export const ShouldNotHappen = ({ message }: { message: string }) => (
  <StyledText variant="error" size="xs">
    ERROR: {message}
  </StyledText>
);
