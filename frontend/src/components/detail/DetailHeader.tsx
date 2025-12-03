import { Box } from '@mantine/core';

export interface DetailHeaderProps {
  children: React.ReactNode;
}

export const DetailHeader = ({ children }: DetailHeaderProps) => {
  return (
    <Box
      component="div"
      style={{
        fontSize: 'var(--mantine-font-size-md)',
        fontWeight: 600,
        color: 'var(--mantine-color-text)',
        marginBottom: 'var(--mantine-spacing-sm)',
      }}
    >
      {children}
    </Box>
  );
};
