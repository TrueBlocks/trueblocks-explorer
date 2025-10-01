import { useState } from 'react';

import {
  DetailField,
  DetailPanelContainer,
  DetailRow,
  DetailSection,
} from '@components';

import './DetailTable.css';

type Row = { label: string; value: React.ReactNode };

type Section = { name: string; rows: Row[] };

interface DetailTableProps {
  sections: Section[];
  className?: string;
  defaultCollapsedSections?: string[];
}

export const DetailTable = ({
  sections,
  className,
  defaultCollapsedSections = [],
}: DetailTableProps) => {
  const [collapsed, setCollapsed] = useState<Set<string>>(
    new Set(defaultCollapsedSections),
  );

  return (
    <DetailPanelContainer
      className={`detail-panel-componentized${className ? ` ${className}` : ''}`}
    >
      {sections.map((section, sectionIndex) => (
        <DetailSection
          key={section.name}
          title={section.name}
          defaultCollapsed={collapsed.has(section.name)}
          onToggle={(isCollapsed) => {
            if (isCollapsed) {
              setCollapsed((prev) => new Set([...prev, section.name]));
            } else {
              setCollapsed((prev) => {
                const next = new Set(prev);
                next.delete(section.name);
                return next;
              });
            }
          }}
          headerProps={{
            className: sectionIndex === 0 ? 'first-section-header' : undefined,
          }}
        >
          {section.rows.map((row, rowIndex) => (
            <DetailRow key={`${section.name}-${rowIndex}`}>
              <DetailField label={row.label} value={row.value} type="custom" />
            </DetailRow>
          ))}
        </DetailSection>
      ))}
    </DetailPanelContainer>
  );
};
