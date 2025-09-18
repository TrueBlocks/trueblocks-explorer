import { Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface AddressInputProps<T = Record<string, unknown>> {
  form: UseFormReturnType<T>;
  fieldName: string;
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  required?: boolean;
}

export const AddressInput = <T extends Record<string, unknown>>({
  form,
  fieldName,
  label = 'Addresses',
  placeholder = '0x... or vitalik.eth (one per line or comma-separated)',
  description = 'Enter Ethereum addresses or ENS names, separated by commas or new lines',
  rows = 4,
  required = true,
}: AddressInputProps<T>) => {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      required={required}
      rows={rows}
      description={description}
      {...form.getInputProps(fieldName)}
    />
  );
};
