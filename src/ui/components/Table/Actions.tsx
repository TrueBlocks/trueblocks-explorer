import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import PropTypes, { InferType } from 'prop-types';
import React, { useCallback } from 'react';

type Action = 'details' | 'remove' | 'edit' | 'monitor';

export function TableActions({ item, onClick }: InferType<typeof TableActions.propTypes>) {
  const createOnClick = (action: Action) => () => onClick(action, item);

  return (
    <>
      <Button shape='circle' type='text' onClick={createOnClick('details')}>
        <InfoCircleOutlined />
      </Button>
      <Button danger shape='circle' type='text' onClick={createOnClick('remove')}>
        <DeleteOutlined />
      </Button>
      <Button shape='circle' type='text' onClick={createOnClick('edit')}>
        <EditOutlined />
      </Button>
      <Button shape='circle' type='text' onClick={createOnClick('monitor')}>
        <PlusCircleOutlined />
      </Button>
    </>
  );
}

TableActions.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};
