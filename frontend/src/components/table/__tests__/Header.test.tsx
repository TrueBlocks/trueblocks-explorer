import { FormField, Header } from '@components';
import { types } from '@models';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock useSorting globally for all tests
let mockSort: any = { fields: [], orders: [] };
let mockSetSorting = vi.fn();
vi.mock('@contexts', () => ({
  useSorting: () => ({ sort: mockSort, setSorting: mockSetSorting }),
}));

const mockViewStateKey = {
  viewName: 'test',
  facetName: types.DataFacet.ALL,
};
describe('Header', () => {
  beforeEach(() => {
    mockSort = { fields: [], orders: [] };
    mockSetSorting = vi.fn();
  });
  it('renders all column headers', () => {
    const columns: FormField<any>[] = [
      { key: 'name', header: 'Name' },
      { key: 'address', header: 'Address' },
      { key: 'tags', header: 'Tags' },
      { key: 'source', header: 'Source' },
      { key: 'status', header: 'Status' },
    ];
    render(
      <table>
        <Header columns={columns} viewStateKey={mockViewStateKey} />
      </table>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
  it('shows sort indicator when a column is sorted', () => {
    const columns: FormField<any>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'address', header: 'Address', sortable: true },
    ];
    mockSort = { fields: ['name'], orders: [true] };
    render(
      <table>
        <Header columns={columns} viewStateKey={mockViewStateKey} />
      </table>,
    );
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it('calls setSorting when sortable header is clicked', () => {
    const columns: FormField<any>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'address', header: 'Address', sortable: true },
    ];
    mockSort = { fields: [], orders: [] };
    render(
      <table>
        <Header columns={columns} viewStateKey={mockViewStateKey} />
      </table>,
    );
    // Use Testing Library's fireEvent on the header cell directly
    const nameHeader = screen.getByRole('button', { name: /name/i });
    fireEvent.click(nameHeader);
    expect(mockSetSorting).toHaveBeenCalled();
  });
});
