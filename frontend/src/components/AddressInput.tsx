import { Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

const ADDRESS_PLACEHOLDER = '0x1234...5678 or vitalik.eth';
const ADDRESS_DESCRIPTION = 'Enter one or more addresses or ENS names';

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
  placeholder = ADDRESS_PLACEHOLDER,
  description = ADDRESS_DESCRIPTION,
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
