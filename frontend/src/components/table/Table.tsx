import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import {
  ChevronButton,
  StyledModal,
  useTableContext,
  useTableKeys,
} from '@components';
import { Form, FormField } from '@components';
import { useFiltering } from '@contexts';
import { usePreferences } from '@hooks';
import { project } from '@models';
import { getDebugClass } from '@utils';

import {
  Body,
  DetailPanel,
  Header,
  Pagination,
  PerPage,
  Stats,
  processColumns,
  usePagination,
} from '.';
import { SearchBox } from './SearchBox';
import './Table.css';

export interface TableProps<T extends Record<string, unknown>> {
  columns: FormField<T>[];
  data: T[];
  loading: boolean;
  viewStateKey: project.ViewStateKey;
  onSubmit: (data: T) => void;
  onDelete?: (rowData: T) => void;
  onRemove?: (rowData: T) => void;
  onAutoname?: (rowData: T) => void;
  validate?: Record<
    string,
    (value: unknown, values: Record<string, unknown>) => string | null
  >;
  onModalOpen?: (openModal: (data: T) => void) => void;
  headerActions?: React.ReactNode;
  detailPanel: (rowData: T | null) => React.ReactNode;
}

export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  viewStateKey,
  onSubmit,
  onDelete,
  onRemove,
  onAutoname,
  validate,
  onModalOpen,
  headerActions,
  detailPanel,
}: TableProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRowData, setCurrentRowData] = useState<T | null>(null);

  const { detailCollapsed, setDetailCollapsed } = usePreferences();

  const processedColumns = processColumns(columns);

  // When detailCollapsed is false, the detail panel is showing, so show fewer columns
  const displayColumns = detailCollapsed
    ? processedColumns
    : processedColumns.slice(0, 3);

  const { pagination } = usePagination(viewStateKey);
  const { filter, setFiltering } = useFiltering(viewStateKey);
  const { currentPage, pageSize, totalItems } = pagination;
  const totalPages = Math.ceil(totalItems / pageSize);

  const {
    tableRef,
    selectedRowIndex,
    setSelectedRowIndex,
    focusTable,
    focusControls,
  } = useTableContext();

  const isModalOpenRef = useRef(false);

  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    focusTable();
  };

  const handleModalFormSubmit = (values: T) => {
    setIsModalOpen(false);
    onSubmit(values);
    focusTable();
  };

  const { handleKeyDown } = useTableKeys({
    itemCount: data.length,
    currentPage,
    totalPages,
    viewStateKey,
    onEnter: () => {
      if (selectedRowIndex >= 0 && selectedRowIndex < data.length) {
        const rowData = data[selectedRowIndex] || null;
        setCurrentRowData(rowData);
        setIsModalOpen(true);
      }
    },
    onEscape: () => {
      setIsModalOpen(false);
    },
    onDelete: () => {
      if (selectedRowIndex >= 0 && selectedRowIndex < data.length) {
        const rowData = data[selectedRowIndex];
        if (rowData) {
          const isDeleted = Boolean(rowData.deleted);
          if (!isDeleted && onDelete) {
            onDelete(rowData);
          } else if (isDeleted && onRemove) {
            onRemove(rowData);
          }
        }
      }
    },
    onCmdDelete: () => {
      if (selectedRowIndex >= 0 && selectedRowIndex < data.length) {
        const rowData = data[selectedRowIndex];
        if (rowData) {
          const isDeleted = Boolean(rowData.deleted);
          if (isDeleted && onDelete) {
            onDelete(rowData);
          }
        }
      }
    },
    onAutoname: () => {
      if (
        selectedRowIndex >= 0 &&
        selectedRowIndex < data.length &&
        onAutoname
      ) {
        const rowData = data[selectedRowIndex];
        if (rowData) {
          onAutoname(rowData);
        }
      }
    },
  });

  useEffect(() => {
    const tableElement = tableRef.current;
    if (tableElement) {
      const nativeKeyDownHandler = (e: KeyboardEvent) => {
        handleKeyDown({
          key: e.key,
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
        } as React.KeyboardEvent);
      };

      tableElement.addEventListener('keydown', nativeKeyDownHandler);
      return () => {
        tableElement.removeEventListener('keydown', nativeKeyDownHandler);
      };
    }
  }, [handleKeyDown, tableRef]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentRowData((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (data.length > 0 && !loading) {
      const safeFocusTable = () => {
        // Check if table's own modal is open
        if (isModalOpenRef.current) {
          return;
        }

        // Check for any modal overlay in the DOM (more comprehensive)
        const modalOverlay = document.querySelector('.mantine-Modal-overlay');
        if (modalOverlay) {
          return;
        }

        // Check if focus is already intentionally placed somewhere specific
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement !== document.body &&
          activeElement.tagName !== 'HTML' &&
          activeElement.closest('.mantine-Modal-content')
        ) {
          return;
        }

        focusTable();
      };

      const timer = setTimeout(() => {
        safeFocusTable();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [data, loading, focusTable]);

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    const navigationKeys = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ];
    if (navigationKeys.includes(e.key)) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    focusTable();
  }, [currentPage, focusTable]);

  useEffect(() => {
    if (selectedRowIndex === -1 || selectedRowIndex >= data.length) {
      setSelectedRowIndex(Math.max(0, data.length - 1));
    }
  }, [data, selectedRowIndex, setSelectedRowIndex]);

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(index);
    setCurrentRowData(data[index] || null);
  };

  // Get current selected row data for the detail panel
  const selectedRowData =
    selectedRowIndex >= 0 && selectedRowIndex < data.length
      ? data[selectedRowIndex]
      : null;

  const openModalWithData = useCallback((rowData: T) => {
    setCurrentRowData(rowData);
    setIsModalOpen(true);
  }, []);

  // Expose the openModalWithData function to parent component
  useEffect(() => {
    if (onModalOpen) {
      onModalOpen(openModalWithData);
    }
  }, [onModalOpen, openModalWithData]);

  return (
    <div className="table-container">
      <div className="top-pagination-container">
        <ChevronButton
          collapsed={!detailCollapsed} // we reverse the logic here so the button make sense
          onToggle={() => setDetailCollapsed(!detailCollapsed)}
          direction="none"
        />
        <div className="pagination-controls">
          <SearchBox value={filter} onChange={setFiltering} />
          <PerPage
            viewStateKey={viewStateKey}
            pageSize={pageSize}
            focusTable={focusTable}
            focusControls={focusControls}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            viewStateKey={viewStateKey}
            focusControls={focusControls}
          />
          {headerActions}
        </div>
      </div>

      <div
        className={`table-main-content ${!detailCollapsed ? 'with-detail-panel' : ''} ${getDebugClass(2)}`}
      >
        <table
          className={`data-table ${getDebugClass(4)}`}
          ref={tableRef}
          tabIndex={0}
          aria-label="Table with keyboard navigation"
          onClick={focusTable}
        >
          <Header columns={displayColumns} viewStateKey={viewStateKey} />
          <tbody className={getDebugClass(5)}>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={displayColumns.length}
                  style={{
                    textAlign: 'left',
                    padding: '20px',
                    color: loading
                      ? 'var(--skin-primary)'
                      : 'var(--skin-text-secondary)',
                  }}
                >
                  {loading ? 'Loading...' : 'No data found.'}
                </td>
              </tr>
            ) : (
              <Body
                columns={displayColumns}
                data={data}
                selectedRowIndex={selectedRowIndex}
                handleRowClick={handleRowClick}
                noDataMessage={loading ? 'Loading...' : 'No data found.'}
              />
            )}
          </tbody>
          <Stats
            nRecords={data.length}
            nCols={displayColumns.length}
            viewStateKey={viewStateKey}
          />
        </table>

        {!detailCollapsed && (
          <DetailPanel
            selectedRowData={selectedRowData}
            detailPanel={detailPanel}
          />
        )}
      </div>

      <StyledModal
        opened={isModalOpen}
        onClose={closeModal}
        centered
        size="lg"
        closeOnClickOutside={true}
        closeOnEscape={true}
        styles={{
          header: { display: 'none' },
          overlay: {
            backgroundColor: 'var(--skin-surface-sunken)',
            backdropFilter: 'blur(1px)', // Optional slight blur effect
          },
          inner: {
            padding: '20px',
          },
          content: {
            // Target the modal content itself
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Add a subtle box shadow
            border: '1px solid var(--skin-border-default)', // Add a light border, theme-aware
          },
        }}
      >
        <div onKeyDown={handleFormKeyDown}>
          <Form
            title={`Edit ${viewStateKey.facetName.replace(/\b\w/g, (char) =>
              char.toUpperCase(),
            )} ${viewStateKey.viewName
              .replace(/^\//, '')
              .replace(/\b\w/g, (char) => char.toUpperCase())}`}
            fields={columns.map((col) => {
              const fieldDefinition: FormField<T> = {
                ...col,
                name: col.name || col.key,
                label: col.label || col.header || col.name || col.key,
                placeholder:
                  col.placeholder ||
                  `Enter ${col.label || col.header || col.name || col.key}`,
                value:
                  currentRowData && (col.name || col.key) !== undefined
                    ? String(
                        (currentRowData as Record<string, unknown>)[
                          (col.name || col.key) as string
                        ] ?? '',
                      )
                    : '',
              };
              return fieldDefinition;
            })}
            onSubmit={handleModalFormSubmit}
            onCancel={closeModal}
            onChange={handleFieldChange}
            initMode="edit"
            compact
            validate={validate}
          />
        </div>
      </StyledModal>
    </div>
  );
};
