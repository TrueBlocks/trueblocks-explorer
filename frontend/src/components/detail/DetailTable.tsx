import { useState } from 'react';

import {
  DetailPanelContainer,
  DetailRow,
  DetailSection,
  FieldRenderer,
  FormField,
} from '@components';
import { Grid } from '@mantine/core';

import './DetailTable.css';

type Section = {
  name: string;
  rows: FormField[];
  rowData?: Record<string, unknown>;
};
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
          {section.rows.map((row, rowIndex) => {
            const formField = row as FormField;
            return (
              <DetailRow key={`${section.name}-${rowIndex}`}>
                <Grid.Col span={3}>
                  <div className="detail-row-prompt">
                    {formField.label || formField.key || 'Unknown'}
                  </div>
                </Grid.Col>
                <Grid.Col span={9}>
                  <div className="detail-row-value">
                    <FieldRenderer
                      field={formField}
                      mode="display"
                      tableCell={false}
                      rowData={section.rowData}
                    />
                  </div>
                </Grid.Col>
              </DetailRow>
            );
          })}
        </DetailSection>
      ))}
    </DetailPanelContainer>
  );
};
