import { ModalTitle, ModalTitleProps } from '@mantine/core';

export const StyledModalTitle = ({ ...props }: ModalTitleProps) => {
  return (
    <ModalTitle
      {...props}
      style={{
        color: 'var(--skin-text-primary)',
        fontWeight: 600,
        fontSize: 'var(--mantine-font-size-lg)',
        ...props.style,
      }}
    />
  );
};
