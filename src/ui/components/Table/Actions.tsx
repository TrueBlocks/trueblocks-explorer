import React from 'react';

import {
  DeleteOutlined, EditOutlined, EyeOutlined, InfoCircleOutlined, UndoOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes, { InferType } from 'prop-types';

type Action = 'info' | 'delete' | 'undelete' | 'remove' | 'edit' | 'view';

export function TableActions({ item, onClick }: InferType<typeof TableActions.propTypes>) {
  const createOnClick = (action: Action) => () => onClick(action, item);
  if (item.deleted) {
    return (
      <>
        <Button shape='circle' type='text' onClick={createOnClick('info')}>
          <InfoCircleOutlined />
        </Button>
        <Button danger shape='circle' type='text' onClick={createOnClick('undelete')}>
          <UndoOutlined />
        </Button>
        <Button shape='circle' type='text' onClick={createOnClick('remove')}>
          <DeleteOutlined />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button shape='circle' type='text' onClick={createOnClick('info')}>
        <InfoCircleOutlined />
      </Button>
      <Button danger shape='circle' type='text' onClick={createOnClick('delete')}>
        <DeleteOutlined />
      </Button>
      <Button shape='circle' type='text' onClick={createOnClick('edit')}>
        <EditOutlined />
      </Button>
      <Button shape='circle' type='text' onClick={createOnClick('view')}>
        <EyeOutlined />
      </Button>
    </>
  );
}

TableActions.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};
