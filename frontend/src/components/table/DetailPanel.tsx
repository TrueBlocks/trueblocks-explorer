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
    <div className={`detail-panel ${getDebugClass(12)}`}>
      <div className="detail-panel-content">
        {detailPanel(selectedRowData || null)}
      </div>
    </div>
  );
};
