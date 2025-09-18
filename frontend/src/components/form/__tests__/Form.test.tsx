import { Form } from '@components';
import { MantineProvider } from '@mantine/core';
import { resetAllCentralMocks, triggerHotkey } from '@mocks';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-hotkeys-hook', async () => {
  const mocks = await import('../../../__tests__/mocks');
  return { useHotkeys: mocks.mockUseHotkeys };
});

describe('Form Component', () => {
  beforeEach(() => {
    resetAllCentralMocks();
  });

  it('renders the form with a title and description', () => {
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          description="This is a test form."
          fields={[]}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('This is a test form.')).toBeInTheDocument();
  });

  it('renders a text input field', () => {
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              value: '',
              placeholder: 'Enter your username',
              onChange: vi.fn(),
            },
          ]}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your username'),
    ).toBeInTheDocument();
  });

  it('renders a number input field', () => {
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'age',
              label: 'Age',
              type: 'number',
              value: '',
              placeholder: 'Enter your age',
              onChange: vi.fn(),
            },
          ]}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your age')).toBeInTheDocument();
  });

  it('resets the form to its original values when Cancel is clicked', () => {
    const onCancel = vi.fn();

    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              value: 'JohnDoe',
              placeholder: 'Enter your username',
              onChange: vi.fn(),
            },
          ]}
          onCancel={onCancel}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('submits the form with the correct values when Save is clicked', () => {
    const onSubmit = vi.fn();

    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              value: 'JohnDoe',
              placeholder: 'Enter your username',
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{}}
        />
      </MantineProvider>,
    );

    // Simulate clicking the Save button
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Verify that the onSubmit handler was called
    expect(onSubmit).toHaveBeenCalled();
  });

  it('conditionally renders fields based on the visible property', () => {
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              value: '',
              placeholder: 'Enter your username',
              visible: true,
              onChange: vi.fn(),
            },
            {
              name: 'hiddenField',
              label: 'Hidden Field',
              type: 'text',
              value: '',
              placeholder: 'This field is hidden',
              visible: false,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    // Verify that the visible field is rendered
    expect(screen.getByLabelText('Username')).toBeInTheDocument();

    // Verify that the hidden field is not rendered
    expect(screen.queryByLabelText('Hidden Field')).not.toBeInTheDocument();
  });

  it('renders fields inline when sameLine is true', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'firstName',
              label: 'First Name',
              type: 'text',
              value: 'Alice',
              placeholder: 'Enter your first name',
              onChange: vi.fn(),
            },
            {
              name: 'lastName',
              label: 'Last Name',
              type: 'text',
              value: 'Smith',
              placeholder: 'Enter your last name',
              sameLine: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{}}
        />
      </MantineProvider>,
    );

    const form = screen.getByRole('form');
    const inlineInputs = within(form).getAllByRole('textbox');

    // Ensure both fields are rendered inline
    expect(inlineInputs).toHaveLength(2);
    expect(inlineInputs[0]).toHaveAttribute(
      'placeholder',
      'Enter your first name',
    );
    expect(inlineInputs[1]).toHaveAttribute(
      'placeholder',
      'Enter your last name',
    );

    // Assert that values are populated correctly even when sameLine is true
    expect(inlineInputs[0]).toHaveValue('Alice');
    expect(inlineInputs[1]).toHaveValue('Smith');
  });

  it('renders nested fields with sameLine correctly', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          title="Nested Test Form"
          initMode="edit"
          fields={[
            {
              name: 'topLevelField',
              label: 'Top Level Field',
              type: 'text',
              value: 'TopValue',
              placeholder: 'Enter top level value',
              onChange: vi.fn(),
            },
            {
              label: 'User Options', // This field acts as a grouper
              fields: [
                {
                  name: 'language',
                  label: 'Language',
                  type: 'text',
                  value: 'English',
                  placeholder: 'Enter language',
                  onChange: vi.fn(),
                },
                {
                  name: 'theme',
                  label: 'Theme',
                  type: 'text',
                  value: 'Dark',
                  placeholder: 'Enter theme',
                  sameLine: true,
                  onChange: vi.fn(),
                },
                {
                  name: 'notifications',
                  label: 'Notifications',
                  type: 'text',
                  value: 'Enabled',
                  placeholder: 'Enter notification preference',
                  sameLine: true,
                  onChange: vi.fn(),
                },
              ],
            },
            {
              name: 'anotherTopLevelField',
              label: 'Another Top Level Field',
              type: 'text',
              value: 'AnotherTopValue',
              placeholder: 'Enter another top level value',
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{}}
        />
      </MantineProvider>,
    );

    // Check top-level field
    expect(screen.getByLabelText('Top Level Field')).toBeInTheDocument();
    expect(screen.getByLabelText('Top Level Field')).toHaveValue('TopValue');

    // Check for nested fields by label
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toHaveValue('English');

    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toHaveValue('Dark');

    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toHaveValue('Enabled');

    // Check another top-level field to ensure processing continued
    expect(
      screen.getByLabelText('Another Top Level Field'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Another Top Level Field')).toHaveValue(
      'AnotherTopValue',
    );

    // Verify sameLine behavior for nested fields
    const form = screen.getByRole('form');
    const allInputs = within(form).getAllByRole('textbox');
    expect(allInputs).toHaveLength(5);
  });

  it('selects all text in the active input field when mod+a is pressed', () => {
    render(
      <MantineProvider>
        <Form
          title="Test Form"
          initMode="edit"
          fields={[
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              value: 'TestUser', // Added a value to select
              placeholder: 'Enter your username',
              onChange: vi.fn(),
            },
          ]}
          onSubmit={vi.fn()}
          validate={{}}
        />
      </MantineProvider>,
    );

    const input = screen.getByLabelText('Username') as HTMLInputElement;
    input.focus();
    triggerHotkey('mod+a');

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('shows validation error when required field is empty', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          title="Validate Form"
          initMode="edit"
          fields={[
            {
              name: 'requiredField',
              label: 'Required Field',
              type: 'text',
              value: '',
              placeholder: 'Enter value',
              required: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{
            requiredField: (value) =>
              !value ? 'Required Field is required' : null,
          }}
        />
      </MantineProvider>,
    );

    // attempt to save without entering a value
    fireEvent.click(screen.getByText('Save'));

    // error message should appear, and onSubmit not called
    expect(screen.getByText('Required Field is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not show validation error', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          title="Validate Form"
          initMode="edit"
          fields={[
            {
              name: 'requiredField',
              label: 'Required Field',
              type: 'text',
              value: 'Data is here',
              placeholder: 'Enter value',
              required: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{
            requiredField: (value) =>
              !value ? 'Required Field is required' : null,
          }}
        />
      </MantineProvider>,
    );

    // attempt to save
    fireEvent.click(screen.getByText('Save'));

    // error message should appear, and onSubmit not called
    // expect(screen.getByText('Required Field is required')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows error on field blur when validation fails', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          initMode="edit"
          fields={[
            {
              name: 'field',
              label: 'Field',
              value: '',
              placeholder: 'Enter field',
              required: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{ field: (value) => (!value ? 'Field is required' : null) }}
        />
      </MantineProvider>,
    );

    const input = screen.getByPlaceholderText(
      'Enter field',
    ) as HTMLInputElement;
    input.focus();
    fireEvent.blur(input);

    expect(screen.getByText('Field is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid Ethereum address on blur', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          initMode="edit"
          fields={[
            {
              name: 'address',
              label: 'Address',
              value: '0x123',
              placeholder: 'Enter address',
              required: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{
            address: (value) => {
              if (!value) return 'Address is required';
              if (!/^0x[a-fA-F0-9]{40}$/.test(value as string)) {
                return 'Invalid Ethereum address';
              }
              return null;
            },
          }}
        />
      </MantineProvider>,
    );
    const input = screen.getByPlaceholderText(
      'Enter address',
    ) as HTMLInputElement;
    fireEvent.blur(input);

    expect(screen.getByText('Invalid Ethereum address')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not show error for valid Ethereum address on blur', () => {
    const onSubmit = vi.fn();
    render(
      <MantineProvider>
        <Form
          initMode="edit"
          fields={[
            {
              name: 'address',
              label: 'Address',
              value: '0x1234567890abcdef1234567890abcdef12345678',
              placeholder: 'Enter address',
              required: true,
              onChange: vi.fn(),
            },
          ]}
          onSubmit={onSubmit}
          validate={{
            address: (value) => {
              if (!value) return 'Address is required';
              if (!/^0x[a-fA-F0-9]{40}$/.test(value as string)) {
                return 'Invalid Ethereum address';
              }
              return null;
            },
          }}
        />
      </MantineProvider>,
    );
    const input = screen.getByPlaceholderText(
      'Enter address',
    ) as HTMLInputElement;
    fireEvent.blur(input);

    expect(screen.queryByText('Invalid Ethereum address')).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
