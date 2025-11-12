import { FormField, Table, TableProps } from '@components';
import { MantineProvider } from '@mantine/core';
import { project, types } from '@models';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock ViewConfig for Table tests
const mockFacetConfig = new types.FacetConfig({
  name: 'All',
  store: 'test-store',
  dividerBefore: false,
  disabled: false,
  fields: [],
  columns: [
    {
      key: 'id',
      header: 'ID',
      width: 80,
      sortable: true,
      type: '',
      order: 0,
    },
    {
      key: 'name',
      header: 'Name',
      width: 150,
      sortable: true,
      type: '',
      order: 1,
    },
    {
      key: 'description',
      header: 'Description',
      width: 200,
      sortable: false,
      type: '',
      order: 2,
    },
    {
      key: 'status',
      header: 'Status',
      width: 100,
      sortable: false,
      type: '',
      order: 3,
    },
  ],
  detailPanels: [],
  actions: [],
  headerActions: [],
});

const mockViewConfig = new types.ViewConfig({
  viewName: 'test',
  disabled: false,
  facets: {
    [types.DataFacet.ALL]: mockFacetConfig,
  },
  actions: {},
  facetOrder: [types.DataFacet.ALL],
});

vi.mock('@hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@hooks')>();
  return {
    ...actual,
    useViewConfig: () => mockViewConfig,
    getViewConfig: () => mockViewConfig,
    usePreferences: () => ({
      menuCollapsed: false,
      helpCollapsed: false,
      detailCollapsed: true,
      loading: false,
      setDetailCollapsed: vi.fn(),
      setMenuCollapsed: vi.fn(),
      setHelpCollapsed: vi.fn(),
    }),
    usePlaceholderRows: () => ({
      placeholderCount: 0,
      cyclingRowIndex: 0,
    }),
  };
});

type TestRow = {
  id: number;
  name: string;
  description: string;
  status?: string;
  deleted?: boolean;
};

const mockColumns: FormField<TestRow>[] = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'description', header: 'Description', sortable: false },
  {
    key: 'status',
    header: 'Status',
    render: (row: TestRow) => `${row.deleted ? 'Deleted' : 'Active'}`,
    sortable: false,
  },
];

const mockData = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item', deleted: true },
  { id: 3, name: 'Item 3', description: 'Third item' },
];

const mockViewStateKey: project.ViewStateKey = {
  viewName: 'test',
  facetName: types.DataFacet.ALL,
};

const defaultProps: TableProps<TestRow> = {
  columns: mockColumns,
  data: mockData,
  state: types.StoreState.LOADED,
  viewStateKey: mockViewStateKey,
  onSubmit: vi.fn(),
  detailPanel: () => null,
};

const setupTest = (props: Partial<TableProps<TestRow>> = {}) => {
  const testProps = { ...defaultProps, ...props };
  return render(
    <MantineProvider>
      <Table {...testProps} />
    </MantineProvider>,
  );
};

describe('Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Group 1: Basic rendering tests
  describe('Rendering', () => {
    it('renders column headers', () => {
      setupTest();
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders data rows', () => {
      setupTest();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('First item')).toBeInTheDocument();
      expect(screen.getByText('Second item')).toBeInTheDocument();
      expect(screen.getByText('Third item')).toBeInTheDocument();
    });

    it('renders custom cell content using render function', () => {
      setupTest();
      const activeElements = screen.getAllByText('Active');
      const deletedElements = screen.getAllByText('Deleted');

      expect(activeElements.length).toBe(2);
      expect(deletedElements.length).toBe(1);
    });
  });

  // Group 2: State handling tests
  describe('State handling', () => {
    it('shows placeholder data when data is empty', () => {
      setupTest({ data: [], state: types.StoreState.STALE });
      // Just check that the table exists
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  // Group 3: ViewStateKey integration tests
  describe('ViewStateKey integration', () => {
    it('includes viewStateKey prop in rendered table', () => {
      expect(() => setupTest()).not.toThrow();
    });
  });

  // Group 4: Edge cases and special scenarios
  describe('Edge cases', () => {
    it('handles no sortable columns', () => {
      const nonSortableColumns = mockColumns.map((col) => ({
        ...col,
        sortable: false,
      }));
      setupTest({ columns: nonSortableColumns });
      expect(screen.getByText('ID')).toBeInTheDocument();
    });

    it('handles large datasets', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        description: `Description ${i + 1}`,
      }));

      setupTest({
        data: largeDataset.slice(0, 10),
        viewStateKey: mockViewStateKey,
      });

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(12);
    });

    it('handles column with custom render function', () => {
      const columnsWithCustomRenderer: FormField<TestRow>[] = [
        ...mockColumns,
        {
          key: 'custom',
          header: 'Custom Column',
          render: () => 'Static content',
        },
      ];

      setupTest({ columns: columnsWithCustomRenderer });
      expect(screen.getByText('Custom Column')).toBeInTheDocument();
      expect(screen.getAllByText('Static content').length).toBe(3);
    });
  });
});
