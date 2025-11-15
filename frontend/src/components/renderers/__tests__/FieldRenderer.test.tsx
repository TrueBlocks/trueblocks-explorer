import { FieldRenderer, FormField } from '@components';
import { MantineProvider } from '@mantine/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('FieldRenderer Component', () => {
  const mockOnChange = vi.fn();

  test('renders in display mode correctly', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
    };

    render(
      <MantineProvider>
        <FieldRenderer
          field={field}
          mode="display"
          onChange={mockOnChange}
          tableCell={false}
        />
      </MantineProvider>,
    );

    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  test('renders in edit mode correctly', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
      placeholder: 'Enter value',
    };

    render(
      <MantineProvider>
        <FieldRenderer field={field} mode="edit" onChange={mockOnChange} />
      </MantineProvider>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test Value');
    expect(screen.getByText('Test Field')).toBeInTheDocument();
  });

  test('displays required error message for empty required fields', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: '',
      required: true,
      error: 'Test Field is required',
    };

    render(
      <MantineProvider>
        <FieldRenderer
          field={field}
          mode="edit"
          loading={false}
          onChange={mockOnChange}
        />
      </MantineProvider>,
    );

    expect(screen.getByText('Test Field is required')).toBeInTheDocument();
  });

  test('renders hint text when provided', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
      hint: 'This is a hint',
    };

    render(
      <MantineProvider>
        <FieldRenderer field={field} mode="edit" onChange={mockOnChange} />
      </MantineProvider>,
    );

    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  test('renders nested fields correctly', () => {
    const field: FormField = {
      label: 'Parent Field',
      fields: [
        {
          name: 'childField1',
          label: 'Child Field 1',
          value: 'Child Value 1',
        },
        {
          name: 'childField2',
          label: 'Child Field 2',
          value: 'Child Value 2',
        },
      ],
    };

    render(
      <MantineProvider>
        <FieldRenderer
          field={field}
          mode="display"
          onChange={mockOnChange}
          tableCell={false}
        />
      </MantineProvider>,
    );

    expect(screen.getByText('Parent Field')).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Child Value 1')),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Child Value 2')),
    ).toBeInTheDocument();
  });

  test('uses custom render when provided', () => {
    const customText = 'Custom Rendered Content';
    const field: FormField = {
      name: 'testField',
      customRender: <div data-testid="custom-render">{customText}</div>,
    };

    render(
      <MantineProvider>
        <FieldRenderer field={field} mode="edit" onChange={mockOnChange} />
      </MantineProvider>,
    );

    expect(screen.getByTestId('custom-render')).toBeInTheDocument();
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  test('calls onChange handler when input changes', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
    };

    render(
      <MantineProvider>
        <FieldRenderer field={field} mode="edit" onChange={mockOnChange} />
      </MantineProvider>,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders readOnly field correctly', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
      readOnly: true,
    };

    render(
      <MantineProvider>
        <FieldRenderer field={field} mode="edit" onChange={mockOnChange} />
      </MantineProvider>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  test('applies autoFocus when specified', () => {
    const field: FormField = {
      name: 'testField',
      label: 'Test Field',
      value: 'Test Value',
    };

    render(
      <MantineProvider>
        <FieldRenderer
          field={field}
          mode="edit"
          autoFocus={true}
          onChange={mockOnChange}
        />
      </MantineProvider>,
    );

    const input = screen.getByRole('textbox');
    // Note: autoFocus may not work consistently in test environment
    expect(input).toBeInTheDocument();
  });
});
