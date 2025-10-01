export interface DetailPanelContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

export const DetailPanelContainer = ({
  children,
  className,
  title = '',
}: DetailPanelContainerProps) => {
  return (
    <div
      className={`detail-panel-container${className ? ` ${className}` : ''}`}
    >
      {title && (
        <div className="detail-section-header first-section-header">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
