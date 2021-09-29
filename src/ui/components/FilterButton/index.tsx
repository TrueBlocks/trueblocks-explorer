import React from 'react';

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type FilterButtonProps = {
  children: React.ReactNode,
  onClick: () => void,
  visible: boolean,
}

export function FilterButton(
  {
    children, onClick, visible,
  }: FilterButtonProps,
) {
  return visible
    ? (
      <Button
        shape='round'
        icon={<CloseOutlined />}
        onClick={onClick}
      >
        {children}
      </Button>
    )
    : null;
}
