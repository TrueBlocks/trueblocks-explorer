import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import {
  FieldRenderer,
  FormField,
  StyledButton,
  convertFormValue,
  usePreprocessedFields,
} from '@components';
import { useFormHotkeys } from '@components';
import { Group, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

// Helper function to recursively extract initial values
const extractAllInitialValues = <T extends Record<string, unknown>>(
  fieldsToExtract: FormField<T>[],
  currentValues: Record<string, unknown> = {},
): Record<string, unknown> => {
  fieldsToExtract.forEach((field) => {
    // If the field has a name and a defined value, add it.
    if (field.name && typeof field.value !== 'undefined') {
      currentValues[String(field.name)] = field.value;
    }
    // If the field itself has nested fields, recurse.
    if (field.fields && field.fields.length > 0) {
      extractAllInitialValues(field.fields, currentValues);
    }
  });
  return currentValues;
};

export interface FormProps<T = Record<string, unknown>> {
  title?: string;
  description?: string;
  fields: FormField<T>[];
  onSubmit: (values: T) => void; // Changed from (e: FormEvent) => void
  onBack?: () => void;
  onCancel?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  submitText?: string;
  submitButtonRef?: React.RefObject<HTMLButtonElement | null>;
  initMode?: 'display' | 'edit';
  compact?: boolean;
  validate?: Record<
    string,
    (value: unknown, values: Record<string, unknown>) => string | null
  >;
}

export const Form = <
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  onChange,
  submitButtonRef,
  initMode = 'display',
  compact = false,
  validate = {},
}: FormProps<T>) => {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'display' | 'edit'>(initMode);
  const timeoutRef = useRef<number | null>(null);

  // Initialize Mantine form
  const form = useForm({
    initialValues: {}, // Start with an empty object
    validate,
  });

  // Initialize form values from fields
  useEffect(() => {
    // Build new initial values object from fields, now recursively
    const newInitialValues = extractAllInitialValues(fields);

    // Update Mantine form's initial values and current values
    // This ensures that if the `fields` prop changes, the form reflects these new definitions.
    form.setInitialValues(newInitialValues);
    form.setValues(newInitialValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]); // form.setInitialValues and form.setValues are stable, fields is the key dependency

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleEdit = () => {
    setMode('edit');
  };

  const convertFormValues = (values: Record<string, unknown>): T => {
    const convertedValues = { ...values };

    const processFields = (fieldsToProcess: FormField<T>[]) => {
      fieldsToProcess.forEach((field) => {
        if (field.name && field.name in convertedValues) {
          const value = convertedValues[field.name];
          // Use centralized conversion based on field data type or input type
          const typeToUse = field.type || field.inputType;
          convertedValues[field.name] = convertFormValue(value, typeToUse);
        }

        if (field.fields && field.fields.length > 0) {
          processFields(field.fields);
        }
      });
    };

    processFields(fields);
    return convertedValues as T;
  };

  // Handle form submission
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setMode('display');
      const convertedValues = convertFormValues(
        form.values as Record<string, unknown>,
      );
      onSubmit(convertedValues);
    } else {
      // Auto-focus the first field with an error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (typeof document !== 'undefined') {
          const firstErrorInput = document.querySelector(
            '.mantine-TextInput-input[aria-invalid="true"]',
          ) as HTMLInputElement;
          if (firstErrorInput) {
            firstErrorInput.focus();
          }
        }
        timeoutRef.current = null;
      }, 100);
    }
  };

  const handleCancel = () => {
    setMode('display');
    if (onCancel) onCancel();
  };

  // Handle field changes - using Mantine's form state management exclusively
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Update only Mantine form values - this is now our single source of truth
    if (name) {
      form.setFieldValue(name, fieldValue);
    }

    // Call parent onChange if provided (for backward compatibility)
    if (onChange) {
      onChange(e);
    }
  };

  // Handle field blur - validate the field when it loses focus
  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name && validate[name] && (value || form.isDirty(name))) {
      form.validateField(name);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useFormHotkeys({
    mode,
    setMode,
    onCancel,
    submitButtonRef,
  });

  const processedFields = usePreprocessedFields<T>(
    fields,
    handleFieldChange,
    form.values as T,
  );

  const renderField = (field: FormField<T>, index: number) => {
    // Create a new field with error information from Mantine form
    const fieldWithError = {
      ...field,
      // Use Mantine form values instead of the field's own value
      value:
        field.name && field.name in form.values
          ? (form.values as Record<string, unknown>)[field.name]
          : field.value,
      error: field.name ? form.errors[field.name] : undefined,
      onBlur: handleFieldBlur, // Add onBlur handler for real-time validation
    };

    return (
      <FieldRenderer
        key={field.name || index}
        field={fieldWithError as FormField<Record<string, unknown>>}
        mode={mode}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        loading={loading}
        keyProp={field.name || index}
        autoFocus={index === 0}
      />
    );
  };

  return (
    <Stack gap={compact ? 'xs' : 'md'}>
      {title && (
        <Title order={3} mt="md">
          {title}
        </Title>
      )}
      {description && (
        <Text variant="primary" size="md">
          {description}
        </Text>
      )}
      <form role="form" onSubmit={handleFormSubmit}>
        <Stack gap={compact ? 'xs' : 'md'}>
          {processedFields.map((field, index) => renderField(field, index))}
          <Group justify="flex-end" mt={compact ? 'xs' : 'md'}>
            {mode === 'display' && (
              <StyledButton tabIndex={0} variant="outline" onClick={handleEdit}>
                Edit
              </StyledButton>
            )}
            {mode === 'edit' && (
              <>
                <StyledButton
                  tabIndex={0}
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  type="submit"
                  tabIndex={0}
                  ref={submitButtonRef as React.RefObject<HTMLButtonElement>}
                >
                  Save
                </StyledButton>
              </>
            )}
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};
