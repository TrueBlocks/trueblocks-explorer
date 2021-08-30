import React, { ReactNode } from 'react';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { PanelDirection, PanelHeader } from './PanelHeader';

export { PanelDirection };

export type PanelProps = {
  children: ReactNode;
  collapsibleContent?: boolean;
  customCollapseIcon?: ReactNode;
  customExpandIcon?: ReactNode;
  dir: PanelDirection;
  expanded?: boolean;
  header: ReactNode;
  onToggle: (expanded: boolean) => void;
};

export const Panel = ({
  children,
  collapsibleContent = true,
  customCollapseIcon,
  customExpandIcon,
  dir,
  expanded = true,
  header,
  onToggle,
}: PanelProps) => {
  const classes = classNames('side-panel');
  const icons = [customCollapseIcon || <RightOutlined />, customExpandIcon || <LeftOutlined />];

  const [collapseIcon, expandIcon] = (() => {
    if (customCollapseIcon || customExpandIcon) return icons;

    if (dir === PanelDirection.Right) return icons;

    return [...icons].reverse();
  })();

  const childrenToShow = (() => {
    if (!collapsibleContent) return children;

    if (expanded) return children;

    return null;
  })();

  return (
    <section className={classes}>
      <PanelHeader
        dir={dir}
        expanded={expanded}
        iconCollapsed={collapseIcon}
        iconExpanded={expandIcon}
        onToggle={onToggle}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 16px',
          }}
        >
          {header}
        </div>
      </PanelHeader>
      {childrenToShow}
    </section>
  );
};

Panel.defaultProps = {
  collapsibleContent: true,
  customCollapseIcon: null,
  customExpandIcon: null,
  expanded: true,
};
