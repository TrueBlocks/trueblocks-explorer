import { Textarea } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { ADDRESS_DESCRIPTION, ADDRESS_PLACEHOLDER } from '@utils';

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
