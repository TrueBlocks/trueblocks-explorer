import { useState } from 'react';

import {
  DetailContainer,
  DetailSection,
  FieldRenderer,
  FormField,
} from '@components';
import { Text } from '@mantine/core';

import { PanelRow, PanelTable } from '../renderers';
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

  const handleToggle = (sectionName: string, isCollapsed: boolean) => {
    if (isCollapsed) {
      setCollapsed((prev) => new Set([...prev, sectionName]));
    } else {
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(sectionName);
        return next;
      });
    }
  };

  return (
    <DetailContainer
      className={`detail-panel-componentized${className ? ` ${className}` : ''}`}
    >
      {sections.map((section, sectionIndex) => {
        const isCollapsed = collapsed.has(section.name);

        return (
          <DetailSection key={section.name}>
            <div
              onClick={() => handleToggle(section.name, !isCollapsed)}
              style={{ cursor: 'pointer' }}
            >
              <Text variant="primary" size="sm">
                <div
                  className={`detail-section-header ${
                    sectionIndex === 0 ? 'first-section-header' : ''
                  }`}
                >
                  {`${isCollapsed ? '▶ ' : '▼ '}${section.name}`}
                </div>
              </Text>
            </div>
            {!isCollapsed && (
              <PanelTable>
                {section.rows.map((row, rowIndex) => {
                  const formField = row as FormField;
                  return (
                    <PanelRow
                      key={`${section.name}-${rowIndex}`}
                      label={
                        <div className="detail-row-prompt">
                          {formField.label || formField.key || 'Unknown'}
                        </div>
                      }
                      value={
                        <div className="detail-row-value">
                          <FieldRenderer
                            field={formField}
                            mode="display"
                            tableCell={false}
                            rowData={section.rowData}
                          />
                        </div>
                      }
                    />
                  );
                })}
              </PanelTable>
            )}
          </DetailSection>
        );
      })}
    </DetailContainer>
  );
};
