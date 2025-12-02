import {
  DetailContainer,
  DetailSection,
  FieldRenderer,
  FormField,
} from '@components';

import { PanelRow, PanelTable } from '../renderers';
import './DetailTable.css';

type Section = {
  name: string;
  rows: FormField[];
  rowData?: Record<string, unknown>;
};
interface DetailTableProps {
  facet: string;
  sections: Section[];
  className?: string;
  defaultCollapsedSections?: string[];
}

export const DetailTable = ({
  facet,
  sections,
  className,
  defaultCollapsedSections = [],
}: DetailTableProps) => {
  return (
    <DetailContainer
      className={`detail-panel-componentized${className ? ` ${className}` : ''}`}
    >
      {sections.map((section) => {
        // Check if this section should default to collapsed
        const defaultExpanded = !defaultCollapsedSections.includes(
          section.name,
        );

        return (
          <DetailSection
            facet={facet}
            key={section.name}
            title={section.name}
            defaultExpanded={defaultExpanded}
          >
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
          </DetailSection>
        );
      })}
    </DetailContainer>
  );
};
