import React, { ReactNode } from 'react';

import { Button, Divider } from 'antd';
import classNames from 'classnames';

import './PanelHeader.css';

function ifExpanded<Type>(expanded: boolean, onTrue: () => Type, onFalse: () => Type): Type {
  return expanded ? onTrue() : onFalse();
}

export const enum PanelDirection {
  Left,
  Right,
}

export type PanelHeaderProps = {
  children: ReactNode;
  dir: PanelDirection;
  expanded: boolean;
  iconCollapsed: ReactNode;
  iconExpanded: ReactNode;
  onToggle: (expanded: boolean) => void;
};

export const PanelHeader = ({
  children, dir, expanded, iconCollapsed, iconExpanded, onToggle,
}: PanelHeaderProps) => {
  const classes = classNames('panel-header', {
    'dir-left': dir === PanelDirection.Left,
    'dir-right': dir === PanelDirection.Right,
    expanded,
    collapsed: !expanded,
  });
  const header = expanded ? (
    <h1 style={{ fontSize: '16px', padding: '4px 0px', letterSpacing: '0.1em' }}>{children}</h1>
  ) : null;
  const icon = ifExpanded(
    expanded,
    () => iconCollapsed,
    () => iconExpanded,
  );

  return (
    <>
      <header className={classes}>
        {header}
        <Button type='text' onClick={() => onToggle(!expanded)}>
          {icon}
        </Button>
      </header>
      <Divider style={{ margin: 0, marginBottom: '16px' }} />
    </>
  );
};
