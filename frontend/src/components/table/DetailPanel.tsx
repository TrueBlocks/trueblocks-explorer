import { Box } from '@mantine/core';
import { getDebugClass } from '@utils';

interface DetailPanelProps<T extends Record<string, unknown>> {
  selectedRowData: T | null | undefined;
  detailPanel: (rowData: T | null) => React.ReactNode;
}

export const DetailPanel = <T extends Record<string, unknown>>({
  selectedRowData,
  detailPanel,
}: DetailPanelProps<T>) => {
  return (
    <Box
      className={`detail-panel ${getDebugClass(12)}`}
      bg="gray.2"
      c="text"
      style={{
        flex: '0 0 35%',
        borderRadius: 'var(--mantine-radius-sm)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--mantine-color-gray-4)',
        height: 'auto',
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <div className="detail-panel-content">
        {detailPanel(selectedRowData || null)}
      </div>
    </Box>
  );
};
