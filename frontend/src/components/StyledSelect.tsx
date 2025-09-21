import { Select, SelectProps } from '@mantine/core';

// Reusable styled Select component that follows the semantic theming system
export const StyledSelect = (props: SelectProps) => (
  <Select
    {...props}
    styles={{
      input: {
        backgroundColor: 'transparent',
        borderColor: 'var(--skin-border-subtle)',
        color: 'var(--mantine-color-text)',
        '&::placeholder': {
          color: 'var(--skin-text-dimmed)',
        },
      },
      dropdown: {
        backgroundColor: 'var(--skin-surface-base)',
        borderColor: 'var(--skin-border-default)',
      },
      option: {
        color: 'var(--skin-text-primary)',
        '&[data-selected]': {
          backgroundColor: 'var(--skin-surface-raised)',
          color: 'var(--skin-text-primary)',
        },
        '&:hover': {
          backgroundColor: 'var(--skin-surface-subtle)',
        },
      },
    }}
  />
);
