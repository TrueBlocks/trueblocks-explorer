import { ModalHeader, ModalHeaderProps } from '@mantine/core';

export const StyledModalHeader = ({ ...props }: ModalHeaderProps) => {
  return (
    <ModalHeader
      {...props}
      style={{
        backgroundColor: 'var(--skin-surface-raised)',
        borderBottom: '1px solid var(--skin-border-subtle)',
        color: 'var(--skin-text-primary)',
        ...props.style,
      }}
    />
  );
};
