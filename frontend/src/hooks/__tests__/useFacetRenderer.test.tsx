import { MantineProvider } from '@mantine/core';
import { types } from '@models';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFacetRenderer } from '../useFacetRenderer';

// Mock components
const TestComponent = ({
  viewConfig,
  getCurrentDataFacet,
  currentData,
  currentColumns,
  renderers,
  viewName,
}: {
  viewConfig: types.ViewConfig;
  getCurrentDataFacet: () => types.DataFacet;
  currentData: any[];
  currentColumns: any[];
  renderers?: any;
  viewName: string;
}) => {
  const { node } = useFacetRenderer({
    viewConfig,
    getCurrentDataFacet,
    currentData,
    currentColumns,
    renderers,
    viewName,
  });

  return <div>{node}</div>;
};

describe('useFacetRenderer', () => {
  const mockCustomViewConfig = {
    viewName: 'test',
    facets: {
      [types.DataFacet.MANIFEST]: {
        name: 'Manifest',
        viewType: 'custom',
      },
    },
  } as any;

  const mockData = [{ name: 'Test Item', value: 'Test Value' }];
  const mockColumns = [
    { name: 'name', header: 'Name', label: 'Name' },
    { name: 'value', header: 'Value', label: 'Value' },
  ];

  it('should return null when custom renderer expected but missing (no warning in new system)', () => {
    render(
      <MantineProvider>
        <TestComponent
          viewConfig={mockCustomViewConfig}
          getCurrentDataFacet={() => types.DataFacet.MANIFEST}
          currentData={mockData}
          currentColumns={mockColumns}
          viewName="test"
        />
      </MantineProvider>,
    );

    // Should render nothing (will fall back to default FormView in the parent component)
    expect(
      screen.queryByText('Rendering Component Missing'),
    ).not.toBeInTheDocument();
  });

  it('should use custom renderer when provided', () => {
    const mockRenderers = {
      [types.DataFacet.MANIFEST]: ({ data }: { data: any[] }) => (
        <div data-testid="custom-renderer">
          Custom: {data[0]?.name || 'No data'}
        </div>
      ),
    };

    render(
      <TestComponent
        viewConfig={mockCustomViewConfig}
        getCurrentDataFacet={() => types.DataFacet.MANIFEST}
        currentData={mockData}
        currentColumns={mockColumns}
        renderers={mockRenderers}
        viewName="test"
      />,
    );

    // Should render the custom renderer
    expect(screen.getByTestId('custom-renderer')).toBeInTheDocument();
    expect(screen.getByText('Custom: Test Item')).toBeInTheDocument();
  });

  it('should return null for non-canvas views', () => {
    const nonCanvasConfig = {
      viewName: 'test',
      facets: {
        [types.DataFacet.MANIFEST]: {
          name: 'Manifest',
          viewType: 'table', // Not canvas
        },
      },
    } as any;

    render(
      <TestComponent
        viewConfig={nonCanvasConfig}
        getCurrentDataFacet={() => types.DataFacet.MANIFEST}
        currentData={mockData}
        currentColumns={mockColumns}
        viewName="test"
      />,
    );

    // Should render nothing (empty div)
    expect(screen.queryByDisplayValue('Test Item')).not.toBeInTheDocument();
  });

  it('should return null for form views (escape hatch)', () => {
    const formConfig = {
      viewName: 'test',
      facets: {
        [types.DataFacet.MANIFEST]: {
          name: 'Manifest',
          viewType: 'form',
        },
      },
    } as any;

    render(
      <TestComponent
        viewConfig={formConfig}
        getCurrentDataFacet={() => types.DataFacet.MANIFEST}
        currentData={mockData}
        currentColumns={mockColumns}
        viewName="test"
      />,
    );

    // Should render nothing (will fall back to default FormView in the parent component)
    expect(
      screen.queryByText('Rendering Component Missing'),
    ).not.toBeInTheDocument();
  });
});
