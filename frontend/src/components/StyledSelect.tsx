import { Select, SelectProps } from '@mantine/core';

// Reusable Select component that follows Mantine's semantic theming system
export const StyledSelect = (props: SelectProps) => (
  <Select
    {...props}
    styles={{
      input: {
        backgroundColor: 'var(--mantine-color-gray-2)',
        borderColor: 'var(--mantine-color-gray-4)',
      },
      dropdown: {
        backgroundColor: 'var(--mantine-color-gray-2)',
        borderColor: 'var(--mantine-color-gray-4)',
      },
      option: {
        color: 'var(--mantine-color-text)',
        '&[dataSelected]': {
          backgroundColor: 'var(--mantine-color-gray-3)',
          color: 'var(--mantine-color-text)',
        },
        '&:hover': {
          backgroundColor: 'var(--mantine-color-gray-3)',
        },
      },
    }}
  />
);
