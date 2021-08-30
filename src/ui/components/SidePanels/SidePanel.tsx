import React, { ReactNode, useState } from 'react';

import { Layout } from 'antd';
import Cookies from 'js-cookie';

import { Panel, PanelDirection } from './Panel';

const { Sider } = Layout;

export { PanelDirection };

export type SidePanelProps = {
  children: ReactNode;
  collapsibleContent?: boolean;
  customCollapseIcon?: ReactNode;
  customExpandIcon?: ReactNode;
  dir: PanelDirection;
  header: ReactNode;
  cookieName: string;
};

export const SidePanel = (props: SidePanelProps) => {
  const {
    children, collapsibleContent, customCollapseIcon, customExpandIcon, dir, header, cookieName,
  } = props;
  const [expanded, setExpanded] = useState(Cookies.get(cookieName) === 'true');

  const onToggle = (expanded: boolean) => {
    Cookies.set(cookieName, expanded ? 'true' : 'false');
    setExpanded(!!expanded);
  };

  return (
    <Sider
      collapsedWidth={40}
      style={{
        margin: '1px',
        overflowX: 'hidden',
        overflowY: expanded ? 'scroll' : 'hidden',
      }}
      theme='light'
      collapsed={!expanded}
    >
      <Panel
        header={header}
        dir={dir}
        expanded={expanded}
        onToggle={onToggle}
        collapsibleContent={collapsibleContent}
        customCollapseIcon={customCollapseIcon}
        customExpandIcon={customExpandIcon}
      >
        {children}
      </Panel>
    </Sider>
  );
};
