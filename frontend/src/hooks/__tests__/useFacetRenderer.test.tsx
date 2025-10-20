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
  const mockViewConfig = {
    viewName: 'test',
    facets: {
      [types.DataFacet.MANIFEST]: {
        name: 'Manifest',
        viewType: 'canvas',
        rendererTypes: 'facet', // Expects custom renderer
      },
    },
  } as any;

  const mockData = [{ name: 'Test Item', value: 'Test Value' }];
  const mockColumns = [
    { name: 'name', header: 'Name', label: 'Name' },
    { name: 'value', header: 'Value', label: 'Value' },
  ];

  it('should show warning when custom renderer expected but missing for canvas view', () => {
    render(
      <MantineProvider>
        <TestComponent
          viewConfig={mockViewConfig}
          getCurrentDataFacet={() => types.DataFacet.MANIFEST}
          currentData={mockData}
          currentColumns={mockColumns}
          viewName="test"
        />
      </MantineProvider>,
    );

    // Should render a warning message
    expect(screen.getByText('Custom Renderer Missing')).toBeInTheDocument();
    expect(screen.getByText('manifest')).toBeInTheDocument();
    expect(screen.getByText('renderer = "facet"')).toBeInTheDocument();
    expect(screen.getByText('renderer = ""')).toBeInTheDocument();
  });

  it('should use custom renderer when provided', () => {
    const mockRenderers = {
      [types.DataFacet.MANIFEST]: ({ data }: { data: any }) => (
        <div data-testid="custom-renderer">Custom: {data.name}</div>
      ),
    };

    render(
      <TestComponent
        viewConfig={mockViewConfig}
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

  it('should return null when renderer is empty (escape hatch)', () => {
    const escapeHatchConfig = {
      viewName: 'test',
      facets: {
        [types.DataFacet.MANIFEST]: {
          name: 'Manifest',
          viewType: 'canvas',
          rendererTypes: '', // Empty renderer = escape hatch
        },
      },
    } as any;

    render(
      <TestComponent
        viewConfig={escapeHatchConfig}
        getCurrentDataFacet={() => types.DataFacet.MANIFEST}
        currentData={mockData}
        currentColumns={mockColumns}
        viewName="test"
      />,
    );

    // Should render nothing (will fall back to default FormView in the parent component)
    expect(
      screen.queryByText('Custom Renderer Missing'),
    ).not.toBeInTheDocument();
  });
});
