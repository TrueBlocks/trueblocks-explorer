import { Fragment, useState } from 'react';

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
  const toggle = (name: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  return (
    <div className={`detail-table${className ? ` ${className}` : ''}`}>
      {sections.map((s, sectionIndex) => {
        const isCollapsed = collapsed.has(s.name);
        return (
          <Fragment key={s.name}>
            <div
              key={`${s.name}-header`}
              onClick={() => toggle(s.name)}
              className={`detail-section-header ${sectionIndex === 0 ? 'first-section-header' : ''}`}
            >
              <span style={{ fontSize: '0.75em' }}>
                {isCollapsed ? '▶' : '▼'}
              </span>{' '}
              {s.name}
            </div>
            {!isCollapsed &&
              s.rows.map((r, i) => (
                <Fragment key={`${s.name}-${i}`}>
                  <div className="detail-row-prompt">{r.label}</div>
                  <div className="detail-row-value">{r.value}</div>
                </Fragment>
              ))}
            <div className="detail-separator" key={`${s.name}-separator`} />
          </Fragment>
        );
      })}
    </div>
  );
};
