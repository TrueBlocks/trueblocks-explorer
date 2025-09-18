import { FormField, usePreprocessedFields } from '@components';
import { AllTheProviders, resetAllCentralMocks } from '@mocks';
import { renderHook } from '@testing-library/react';

describe('usePreprocessedFields Hook', () => {
  beforeEach(() => {
    resetAllCentralMocks();
  });

  test('filters out fields with visible=false', () => {
    const fields: FormField[] = [
      {
        name: 'visibleField',
        label: 'Visible Field',
        value: 'value1',
      },
      {
        name: 'hiddenField',
        label: 'Hidden Field',
        value: 'value2',
        visible: false,
      },
    ];

    const { result } = renderHook(() => usePreprocessedFields(fields), {
      wrapper: AllTheProviders, // Use AllTheProviders
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.name).toBe('visibleField');
  });

  test('processes nested fields correctly', () => {
    const fields: FormField[] = [
      {
        label: 'Parent Field',
        fields: [
          {
            name: 'childField1',
            label: 'Child Field 1',
          },
          {
            name: 'childField2',
            label: 'Child Field 2',
          },
        ],
      },
    ];

    const { result } = renderHook(() => usePreprocessedFields(fields), {
      wrapper: AllTheProviders, // Use AllTheProviders
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.fields).toHaveLength(2);
    expect(result.current[0]?.fields?.[0]?.name).toBe('childField1');
    expect(result.current[0]?.fields?.[1]?.name).toBe('childField2');
  });

  test('combines fields with sameLine=true', () => {
    const fields: FormField[] = [
      {
        name: 'field1',
        label: 'Field 1',
        sameLine: true,
      },
      {
        name: 'field2',
        label: 'Field 2',
        sameLine: true,
      },
      {
        name: 'field3',
        label: 'Field 3',
      },
    ];

    const { result } = renderHook(() => usePreprocessedFields(fields), {
      wrapper: AllTheProviders, // Use AllTheProviders
    });

    expect(result.current).toHaveLength(2);
    expect(result.current[0]?.customRender).toBeDefined();
    expect(result.current[1]?.name).toBe('field3');
  });

  test('handles complex nesting and visibility conditions', () => {
    const fields: FormField[] = [
      {
        label: 'Parent Field',
        fields: [
          {
            name: 'visibleChild',
            label: 'Visible Child',
          },
          {
            name: 'hiddenChild',
            label: 'Hidden Child',
            visible: false,
          },
        ],
      },
      {
        name: 'standalone',
        label: 'Standalone Field',
      },
    ];

    const { result } = renderHook(() => usePreprocessedFields(fields), {
      wrapper: AllTheProviders, // Use AllTheProviders
    });

    expect(result.current).toHaveLength(2);
    expect(result.current[0]?.fields).toHaveLength(1);
    expect(result.current[0]?.fields?.[0]?.name).toBe('visibleChild');
    expect(result.current[1]?.name).toBe('standalone');
  });

  test('handles function-based visibility conditions', () => {
    const fields: FormField[] = [
      {
        name: 'field1',
        label: 'Field 1',
        visible: () => true,
      },
      {
        name: 'field2',
        label: 'Field 2',
        visible: () => false,
      },
    ];

    const { result } = renderHook(() => usePreprocessedFields(fields), {
      wrapper: AllTheProviders, // Use AllTheProviders
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.name).toBe('field1');
  });
});
