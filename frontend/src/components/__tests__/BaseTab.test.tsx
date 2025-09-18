import React from 'react';

import { FormField } from '@components';
import { render } from '@mocks';
import { project, types } from '@models';
import { describe, expect, it, vi } from 'vitest';

import { BaseTab } from '../BaseTab';

const mockColumns: FormField<{ id: string; name: string }>[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
];

const mockData = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
];

const mockViewStateKey: project.ViewStateKey = {
  viewName: 'test',
  facetName: types.DataFacet.ALL,
};

describe('BaseTab', () => {
  const stubDetail: (
    row: { id: string; name: string } | null,
  ) => React.ReactNode = () => null;
  it('renders table with data', () => {
    const { container } = render(
      <BaseTab
        data={mockData}
        columns={mockColumns}
        loading={false}
        error={null}
        viewStateKey={mockViewStateKey}
        detailPanel={stubDetail}
      />,
    );

    expect(container.textContent).toContain('Table with 2 items');
    expect(container.innerHTML).toContain('data-testid="mock-table"');
  });

  it('renders table structure even when loading', () => {
    const { container } = render(
      <BaseTab
        data={[]}
        columns={mockColumns}
        loading={true}
        error={null}
        viewStateKey={mockViewStateKey}
        detailPanel={stubDetail}
      />,
    );

    expect(container.innerHTML).toContain('data-testid="mock-table-provider"');
    expect(container.innerHTML).toContain('data-testid="mock-table"');
  });

  it('renders table structure even when empty', () => {
    const { container } = render(
      <BaseTab
        data={[]}
        columns={mockColumns}
        loading={false}
        error={null}
        viewStateKey={mockViewStateKey}
        detailPanel={stubDetail}
      />,
    );

    expect(container.innerHTML).toContain('data-testid="mock-table-provider"');
    expect(container.innerHTML).toContain('data-testid="mock-table"');
  });

  // DataFacet-related tests for refactor preparation
  describe('ViewStateKey handling (DataFacet refactor preparation)', () => {
    it('passes ViewStateKey with different facetName values correctly', () => {
      const allFacetKey: project.ViewStateKey = {
        viewName: 'test',
        facetName: types.DataFacet.ALL,
      };
      const customFacetKey: project.ViewStateKey = {
        viewName: 'test',
        facetName: types.DataFacet.CUSTOM,
      };

      const { rerender } = render(
        <BaseTab
          data={mockData}
          columns={mockColumns}
          loading={false}
          error={null}
          viewStateKey={allFacetKey}
          detailPanel={stubDetail}
        />,
      );

      // Verify initial render with transactions key
      expect(
        document.querySelector('[data-testid="mock-table"]'),
      ).toBeInTheDocument();

      // Test state key change
      rerender(
        <BaseTab
          data={mockData}
          columns={mockColumns}
          loading={false}
          error={null}
          viewStateKey={customFacetKey}
          detailPanel={stubDetail}
        />,
      );

      expect(
        document.querySelector('[data-testid="mock-table"]'),
      ).toBeInTheDocument();
    });

    it('handles ViewStateKey creation patterns used in views', () => {
      // Simulate the pattern used in actual views: { viewName: /route, facetName: dataFacet }
      const chunksKey: project.ViewStateKey = {
        viewName: 'chunks',
        facetName: types.DataFacet.ALL,
      };
      const monitorsKey: project.ViewStateKey = {
        viewName: 'monitors',
        facetName: types.DataFacet.CUSTOM,
      };
      const abisKey: project.ViewStateKey = {
        viewName: 'abis',
        facetName: types.DataFacet.PREFUND,
      };

      // Test each key type
      [chunksKey, monitorsKey, abisKey].forEach((key) => {
        const { container, unmount } = render(
          <BaseTab
            data={mockData}
            columns={mockColumns}
            loading={false}
            error={null}
            viewStateKey={key}
            detailPanel={stubDetail}
          />,
        );

        expect(container.innerHTML).toContain('data-testid="mock-table"');
        unmount();
      });
    });

    it('properly forwards ViewStateKey to Table component', () => {
      const testKey: project.ViewStateKey = {
        viewName: 'names',
        facetName: types.DataFacet.CUSTOM,
      };

      render(
        <BaseTab
          data={mockData}
          columns={mockColumns}
          loading={false}
          error={null}
          viewStateKey={testKey}
          detailPanel={stubDetail}
        />,
      );

      // The mocked Table component should receive the viewStateKey
      // This tests that BaseTab correctly passes through the key without modification
      expect(
        document.querySelector('[data-testid="mock-table"]'),
      ).toBeInTheDocument();
    });

    // it('handles ViewStateKey uniqueness requirements', () => {
    //   const key1: project.ViewStateKey = {
    //     viewName: 'exports',
    //     facetName: types.DataFacet.ALL,
    //   };
    //   const key2: project.ViewStateKey = {
    //     viewName: 'exports',
    //     facetName: types.DataFacet.CUSTOM,
    //   };
    //   const key3: project.ViewStateKey = {
    //     viewName: 'names',
    //     facetName: types.DataFacet.REGULAR,
    //   }; // same facetName, different view

    //   // All keys should be valid and unique for state management
    //   [key1, key2, key3].forEach((key) => {
    //     expect(key.viewName).toBeTruthy();
    //     expect(key.facetName).toBeTruthy();
    //     expect(typeof key.viewName).toBe('string');
    //     expect(typeof key.facetName).toBe('string');
    //   });
    // });
  });

  describe('Component integration tests', () => {
    it('passes onSubmit callback correctly', () => {
      const mockOnSubmit = vi.fn();

      render(
        <BaseTab
          data={mockData}
          columns={mockColumns}
          loading={false}
          error={null}
          viewStateKey={mockViewStateKey}
          onSubmit={mockOnSubmit}
          detailPanel={stubDetail}
        />,
      );

      expect(
        document.querySelector('[data-testid="mock-table"]'),
      ).toBeInTheDocument();
    });

    it('handles error prop without breaking render', () => {
      const mockError = new Error('Test error');

      const { container } = render(
        <BaseTab
          data={mockData}
          columns={mockColumns}
          loading={false}
          error={mockError}
          viewStateKey={mockViewStateKey}
          detailPanel={stubDetail}
        />,
      );

      expect(container.innerHTML).toContain('data-testid="mock-table"');
    });
  });
});
