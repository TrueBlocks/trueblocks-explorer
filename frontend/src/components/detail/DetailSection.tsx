import { useState } from 'react';

import { Grid } from '@mantine/core';

export interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean; // Whether the section can be collapsed (default: true)
  defaultCollapsed?: boolean; // Initial collapsed state (default: false)
  onToggle?: (collapsed: boolean) => void; // Callback when section is toggled
  headerProps?: React.HTMLProps<HTMLDivElement>;
  className?: string;
  span?: number; // Grid span for horizontal layouts (when used within DetailRow)
}

/**
 * DetailSection creates a collapsible section with a header and content area.
 * It reuses the existing CSS classes (detail-section-header, detail-separator)
 * for visual consistency with the current DetailTable styling.
 *
 * Features:
 * - Collapsible sections with expand/collapse arrows
 * - Consistent header styling with existing DetailTable
 * - Optional separators between sections
 * - Controlled or uncontrolled collapsed state
 */
export const DetailSection = ({
  title,
  children,
  collapsible = true,
  defaultCollapsed = false,
  onToggle,
  headerProps = {},
  className,
  span,
}: DetailSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    if (!collapsible) return;

    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  const sectionContent = (
    <>
      <div className="detail-separator" />
      <div
        className={`detail-section-header${className ? ` ${className}` : ''}`}
        onClick={handleToggle}
        style={{
          cursor: collapsible ? 'pointer' : 'default',
        }}
        {...headerProps}
      >
        {collapsible && (
          <span style={{ fontSize: '0.75em' }}>{isCollapsed ? '▶' : '▼'}</span>
        )}{' '}
        {title}
      </div>
      {!isCollapsed && children}
    </>
  );

  // If span is provided, wrap in Grid.Col for horizontal layouts
  if (span) {
    return <Grid.Col span={span}>{sectionContent}</Grid.Col>;
  }

  // Default vertical stacking
  return sectionContent;
};

DetailSection.displayName = 'DetailSection';
