import { Box } from '@mantine/core';
import { getDebugClass } from '@utils';

interface DetailPanelProps<T extends Record<string, unknown>> {
  selectedRowData: T | null | undefined;
  detailPanel: (rowData: T) => React.ReactNode;
  facetKey?: string;
}

export const DetailPanel = <T extends Record<string, unknown>>({
  selectedRowData,
  detailPanel,
  facetKey,
}: DetailPanelProps<T>) => {
  return (
    <Box
      key={facetKey}
      className={`detail-panel ${getDebugClass(12)}`}
      bg="gray.2"
      c="text"
      m="2px"
      style={{
        flex: '0 0 35%',
        borderRadius: 'var(--mantine-radius-sm)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--mantine-color-gray-3)',
        height: 'auto',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <div className="detail-panel-content">
        {(() => {
          try {
            const result = selectedRowData
              ? detailPanel(selectedRowData)
              : null;
            return result;
          } catch (error) {
            return <div>Error rendering panel: {String(error)}</div>;
          }
        })()}
      </div>
    </Box>
  );
};
