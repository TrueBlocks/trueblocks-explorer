import React from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

type NetworkErrorProps = {
  resourceName: string,
}

// NetworkError component can be used to tell user that there has been
// a communication interuption while performing a request
export function NetworkError({ resourceName = 'data' }: NetworkErrorProps) {
  const description = `Could not fetch ${resourceName}`;

  return (
    <Empty
      image={<ExclamationCircleOutlined />}
      description={description}
    />
  );
}
