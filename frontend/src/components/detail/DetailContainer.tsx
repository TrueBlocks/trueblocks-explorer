export interface DetailContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
}

export const DetailContainer = ({
  children,
  className,
  title = '',
}: DetailContainerProps) => {
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
