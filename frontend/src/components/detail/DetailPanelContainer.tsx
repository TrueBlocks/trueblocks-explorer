export interface DetailPanelContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode; // Optional title displayed at the top (string or ReactNode)
}

/**
 * DetailPanelContainer is the top-level container component for the new
 * componentized detail panel system. It provides a consistent wrapper
 * for the hierarchical structure:
 * DetailPanelContainer > DetailSection > DetailRow > DetailField
 *
 * This component is intentionally simple - it just provides a container
 * that can be used both for:
 * - New componentized detail panels (using DetailSection/DetailRow/DetailField)
 * - As a wrapper for existing custom panels (like Statement renderer)
 *
 * Note: This is separate from the existing detailPanel.tsx factory functions
 * which create detail panel functions for the current system.
 */
export const DetailPanelContainer = ({
  children,
  className,
  style,
  title,
}: DetailPanelContainerProps) => {
  return (
    <div
      className={`detail-panel-container${className ? ` ${className}` : ''}`}
      style={style}
    >
      {title && (
        <div
          className="detail-section-header first-section-header"
          style={{ color: 'var(--skin-text-primary)' }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

DetailPanelContainer.displayName = 'DetailPanelContainer';

export default DetailPanelContainer;
