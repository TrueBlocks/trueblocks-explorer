import { Modal, ModalProps } from '@mantine/core';

export const StyledModal = ({ ...props }: ModalProps) => {
  return (
    <Modal
      {...props}
      styles={{
        content: {
          backgroundColor: 'var(--skin-surface-base)',
          border: '1px solid var(--skin-border-default)',
          color: 'var(--skin-text-primary)',
        },
        header: {
          backgroundColor: 'var(--skin-surface-raised)',
          borderBottom: '1px solid var(--skin-border-subtle)',
          color: 'var(--skin-text-primary)',
        },
        title: {
          color: 'var(--skin-text-primary)',
          fontWeight: 600,
        },
        close: {
          color: 'var(--skin-text-secondary)',
          '&:hover': {
            backgroundColor: 'var(--skin-surface-hover)',
          },
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        ...props.styles,
      }}
    />
  );
};
