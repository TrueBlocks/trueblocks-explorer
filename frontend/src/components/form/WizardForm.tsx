import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';

import {
  FieldRenderer,
  FormField,
  StyledButton,
  usePreprocessedFields,
} from '@components';
import { useFormHotkeys } from '@components';
import { Group, Stack, Text, Title } from '@mantine/core';

export interface WizardFormProps<T extends Record<string, unknown>> {
  children?: ReactNode;
  title?: string;
  description?: string;
  fields: FormField<T>[];
  onSubmit: (e: FormEvent) => void;
  onBack?: () => void;
  onCancel?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  submitText?: string;
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const WizardForm = <T extends Record<string, unknown>>({
  children,
  title,
  description,
  fields,
  onSubmit,
  onBack,
  onCancel,
  onChange,
  submitText = 'Next',
  submitButtonRef,
}: WizardFormProps<T>) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useFormHotkeys({ onCancel, submitButtonRef });

  const processedFields = usePreprocessedFields<T>(fields, onChange);

  const renderField = (field: FormField<T>, index: number) => (
    <FieldRenderer
      key={field.name || index}
      field={field as FormField<Record<string, unknown>>}
      onChange={onChange}
      loading={loading}
      keyProp={field.name || index}
      autoFocus={index === 0}
    />
  );

  return (
    <Stack>
      {title && <Title order={3}>{title}</Title>}
      {description && (
        <Text variant="primary" size="md">
          {description}
        </Text>
      )}
      {children ? (
        children
      ) : (
        <form role="form" onSubmit={onSubmit}>
          <Stack>
            {processedFields.map((field, index) => renderField(field, index))}
            <Group justify="flex-end" mt="md">
              {onBack && (
                <StyledButton tabIndex={0} variant="outline" onClick={onBack}>
                  Back
                </StyledButton>
              )}
              <StyledButton
                type="submit"
                tabIndex={0}
                ref={submitButtonRef as React.RefObject<HTMLButtonElement>}
              >
                {submitText}
              </StyledButton>
            </Group>
          </Stack>
        </form>
      )}
    </Stack>
  );
};
