import { Form, FormField, FormProps } from '@components';
import { Container, useMantineColorScheme } from '@mantine/core';

export interface FormViewProps<T> {
  formFields: FormField<T>[];
  title?: string;
  description?: string;
  onSubmit: FormProps<T>['onSubmit'];
  onChange?: FormProps<T>['onChange'];
  onCancel?: FormProps<T>['onCancel'];
}

export const FormView = <T extends Record<string, unknown>>({
  formFields,
  title,
  description,
  onSubmit,
  onChange,
  onCancel,
}: FormViewProps<T>) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Container
      size="md"
      mt="xl"
      style={{
        backgroundColor: isDark
          ? 'rgba(255, 255, 255, 0.1)'
          : 'var(--skin-surface-raised)',
        padding: '1rem',
        borderRadius: '8px',
        color: 'var(--skin-text-primary)',
      }}
    >
      <Form<T>
        title={title}
        description={description}
        fields={formFields}
        onSubmit={onSubmit}
        onChange={onChange}
        onCancel={onCancel}
        submitText="Save"
      />
    </Container>
  );
};
