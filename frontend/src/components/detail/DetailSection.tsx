import { useMemo } from 'react';

import { useViewContext } from '@contexts';
import { usePreferences } from '@hooks';

export interface DetailSectionProps {
  children: React.ReactNode;
  facet: string;
  title: string;
  defaultExpanded?: boolean;
  cond?: boolean;
}

export const DetailSection = ({
  children,
  facet,
  title,
  defaultExpanded = false,
  cond = true,
}: DetailSectionProps) => {
  const { getDetailSectionState, setDetailSectionState } = usePreferences();
  const { currentView } = useViewContext();

  // Auto-generate sectionKey from context and title
  const sectionKey = useMemo(() => {
    const viewName = currentView;
    const facetName = facet;
    const normalizedTitle = title.toLowerCase().replace(/\s+/g, '-');
    return `${viewName}-${facetName}-${normalizedTitle}`;
  }, [currentView, facet, title]);

  const expanded = getDetailSectionState(sectionKey) || defaultExpanded;

  const handleToggle = async () => {
    await setDetailSectionState(sectionKey, !expanded);
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
          {`${expanded ? '▼ ' : '▶ '}${title}`}
        </div>
      </div>
      {expanded && (
        <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
          {children}
        </div>
      )}
    </div>
  );

  return cond ? sectionContent : null;
};

DetailSection.displayName = 'DetailSection';
