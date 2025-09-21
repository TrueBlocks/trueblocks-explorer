import { CloseButton, CloseButtonProps } from '@mantine/core';

export const StyledModalCloseButton = ({ ...props }: CloseButtonProps) => {
  return (
    <CloseButton
      {...props}
      style={{
        color: 'var(--skin-text-secondary)',
        backgroundColor: 'transparent',
        border: 'none',
        ...props.style,
      }}
      styles={{
        root: {
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
            color: 'var(--skin-text-primary)',
          },
        },
      }}
    />
  );
};
