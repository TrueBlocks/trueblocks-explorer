import './PanelComponents.css';

export interface PanelTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PanelTable renders an HTML table with consistent InfoXxx styling.
 * Replaces the inline table styles used across InfoXxx renderers.
 */
export const PanelTable = ({ children, className }: PanelTableProps) => {
  return (
    <table className={`panel-table ${className || ''}`}>
      <tbody>{children}</tbody>
    </table>
  );
};

PanelTable.displayName = 'PanelTable';
