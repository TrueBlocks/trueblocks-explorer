import { ChangeEvent, useCallback, useMemo } from 'react';

import { FormField } from '@components';
import { TextInput } from '@mantine/core';

export const usePreprocessedFields = <T extends Record<string, unknown>>(
  fields: FormField<T>[],
  formOnChangeHandler?: (e: ChangeEvent<HTMLInputElement>) => void,
  formData: T = {} as T,
): FormField<T>[] => {
  const combineOnOneLine = useCallback(
    (fieldsToCombine: (FormField<T> & { flex?: number })[]): FormField<T> => ({
      customRender: (
        <div style={{ display: 'flex', gap: '1rem' }}>
          {fieldsToCombine.map((field) => {
            const fieldNameStr = String(field.name); // field.name could be symbol, number, string
            let inputValue: string | number | undefined = undefined;

            if (
              formData &&
              typeof formData === 'object' &&
              fieldNameStr in formData
            ) {
              const formValue = formData[fieldNameStr as keyof T];
              if (
                typeof formValue === 'string' ||
                typeof formValue === 'number'
              ) {
                inputValue = formValue;
              } else if (formValue !== null && formValue !== undefined) {
                inputValue = String(formValue); // Convert other types to string
              }
            }

            return (
              <TextInput
                key={fieldNameStr}
                label={field.label}
                placeholder={field.placeholder}
                withAsterisk={field.required}
                value={inputValue === undefined ? '' : inputValue}
                name={fieldNameStr}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (!field.readOnly && formOnChangeHandler) {
                    formOnChangeHandler(event);
                  }
                }}
                error={field.error}
                rightSection={field.rightSection}
                onBlur={field.onBlur}
                readOnly={field.readOnly}
                style={{
                  flex: field.flex || 1,
                }}
              />
            );
          })}
        </div>
      ),
    }),
    [formData, formOnChangeHandler],
  );

  const preprocessFields = useCallback(
    (fieldsToProcess: FormField<T>[]): FormField<T>[] => {
      const acceptedFields: FormField<T>[] = [];
      let currentLineItems: (FormField<T> & { flex?: number })[] = [];

      const finalizeCurrentLineGroup = () => {
        if (currentLineItems.length > 0) {
          const groupToAdd =
            currentLineItems.length > 1
              ? combineOnOneLine(currentLineItems)
              : currentLineItems[0];
          if (groupToAdd) {
            acceptedFields.push(groupToAdd);
          }
          currentLineItems = [];
        }
      };

      fieldsToProcess.forEach((field) => {
        if (!field) return; // Skip undefined fields

        // Visibility and Editable checks (apply early)
        if (typeof field.editable === 'undefined') field.editable = true;
        if (!field.editable) return; // Skip non-editable fields

        const isVisible =
          typeof field.visible === 'function'
            ? field.visible(formData)
            : field.visible !== false;
        if (!isVisible) return; // Skip non-visible fields

        // Handle nested fields (these are block items and finalize any current line)
        if (field.fields && field.fields.length > 0) {
          finalizeCurrentLineGroup(); // Finalize any pending line before this nested section
          acceptedFields.push({
            ...field, // This is the group header field
            fields: preprocessFields(field.fields), // Recursively process children
          });
          return; // Move to the next top-level field
        }

        // Handle fields without a name (these are also block items and finalize any current line)
        // These fields cannot participate in sameLine grouping.
        if (String(field.name || '').trim() === '') {
          finalizeCurrentLineGroup(); // Finalize any pending line
          acceptedFields.push(field); // Add unnamed field directly as its own item
          return; // Move to the next top-level field
        }

        // At this point, 'field' is a named, visible, editable, non-nested field.
        // Apply sameLine logic:
        if (!field.sameLine) {
          // This field starts a new line.
          finalizeCurrentLineGroup(); // Finalize the previous line of items.
          currentLineItems.push(field as FormField<T> & { flex?: number }); // Add this field as the start of a new line.
        } else {
          // This field continues the current line or starts a new one if currentLineItems is empty.
          currentLineItems.push(field as FormField<T> & { flex?: number });
        }
      });

      // After iterating through all fields, finalize any remaining items in currentLineItems.
      finalizeCurrentLineGroup();

      return acceptedFields;
    },
    [combineOnOneLine, formData],
  );

  return useMemo(() => preprocessFields(fields), [preprocessFields, fields]);
};
