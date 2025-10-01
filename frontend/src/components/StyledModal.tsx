import { Modal, ModalProps } from '@mantine/core';

export const StyledModal = ({ ...props }: ModalProps) => {
  return (
    <Modal
      {...props}
      styles={{
        content: {
          backgroundColor: 'var(--mantine-color-body)',
          border: '1px solid var(--mantine-color-gray-4)',
          color: 'var(--mantine-color-text)',
        },
        header: {
          backgroundColor: 'var(--mantine-color-gray-1)',
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          color: 'var(--mantine-color-text)',
        },
        title: {
          color: 'var(--mantine-color-text)',
          fontWeight: 600,
        },
        close: {
          color: 'var(--mantine-color-dimmed)',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-1)',
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
