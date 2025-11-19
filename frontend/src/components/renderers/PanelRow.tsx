import './PanelComponents.css';

export interface PanelRowProps {
  label?: React.ReactNode;
  value?: React.ReactNode;
  children?: React.ReactNode;
  layout?: 'standard' | 'wide' | 'full';
  className?: string;
  colSpan?: number;
}

export const PanelRow = ({
  label,
  value,
  children,
  layout = 'standard',
  className,
  colSpan,
}: PanelRowProps) => {
  const rowClass = `panel-row ${className || ''}`;

  if (children || colSpan) {
    return (
      <tr className={rowClass}>
        <td
          className={
            layout === 'full' ? 'panel-cell-full' : 'panel-cell-full-no-border'
          }
          colSpan={colSpan || 2}
        >
          {children}
        </td>
      </tr>
    );
  }

  const labelClass =
    layout === 'wide' ? 'panel-cell-label-wide' : 'panel-cell-label';
  const valueClass =
    layout === 'wide' ? 'panel-cell-value-wide' : 'panel-cell-value';

  return (
    <tr className={rowClass}>
      {label && <td className={labelClass}>{label}</td>}
      <td className={valueClass}>{value}</td>
    </tr>
  );
};

PanelRow.displayName = 'PanelRow';
