import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// TableFocusState represents the possible focus states for the table: either the table itself or its controls.
export type TableFocusState = 'table' | 'controls';

// TableContextProps defines the shape of the context used for managing table focus and selection.
export interface TableContextProps {
  focusState: TableFocusState;
  selectedRowIndex: number;
  tableRef: React.RefObject<HTMLTableElement | null>;
  setSelectedRowIndex: (index: number) => void;
  focusTable: () => void;
  focusControls: () => void;
}

const TableContext = createContext<TableContextProps>({
  focusState: 'table',
  selectedRowIndex: -1,
  tableRef: { current: null },
  setSelectedRowIndex: () => {},
  focusTable: () => {},
  focusControls: () => {},
});

// TableProvider provides the table context to its children, managing focus and selection state.
export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [focusState, setFocusState] = useState<TableFocusState>('table');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const tableRef = useRef<HTMLTableElement | null>(null);

  const focusTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.focus();
      setFocusState('table');
    }
  }, []);

  const focusControls = useCallback(() => {
    setFocusState('controls');
  }, []);

  const value: TableContextProps = useMemo(
    () => ({
      focusState,
      selectedRowIndex,
      tableRef,
      setSelectedRowIndex,
      focusTable,
      focusControls,
    }),
    [
      focusState,
      selectedRowIndex,
      tableRef,
      setSelectedRowIndex,
      focusTable,
      focusControls,
    ],
  );

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};

// useTableContext provides access to the table context for focus and selection management.
export const useTableContext = () => useContext(TableContext);
