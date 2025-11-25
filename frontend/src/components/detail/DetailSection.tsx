import { useState } from 'react';

export interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  cond?: boolean;
}

export const DetailSection = ({
  title,
  children,
  cond = true,
}: DetailSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sectionContent = (
    <div>
      <div className="detail-separator" />
      <div
        onClick={handleToggle}
        style={{
          cursor: 'pointer',
        }}
      >
        <div className="detail-section-header">
          {`${isCollapsed ? '▶ ' : '▼ '}${title}`}
        </div>
      </div>
      {!isCollapsed && (
        <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
          {children}
        </div>
      )}
    </div>
  );

  return cond ? sectionContent : null;
};

DetailSection.displayName = 'DetailSection';
