import {
  DetailContainer,
  DetailSection,
  FieldRenderer,
  FormField,
  PanelRow,
  PanelTable,
  StyledLabel,
  StyledValue,
} from '@components';

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
                      <StyledLabel variant="blue">
                        {formField.label || formField.key || 'Unknown'}
                      </StyledLabel>
                    }
                    value={
                      <StyledValue>
                        <FieldRenderer
                          field={formField}
                          mode="display"
                          tableCell={true}
                          rowData={section.rowData}
                        />
                      </StyledValue>
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
