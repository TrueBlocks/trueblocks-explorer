import React from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getBaseUrl } from '@sdk';
import { Empty } from 'antd';

import './NetworkError.css';

type NetworkErrorProps = {
  resourceName: string,
}

// NetworkError component can be used to tell user that there has been
// a communication interuption while performing a request
export function NetworkError({ resourceName = 'data' }: NetworkErrorProps) {
  const description = `Could not fetch ${resourceName}`;

  return (
    <Empty
      className='network-error'
      image={<ExclamationCircleOutlined />}
      description={(
        <div>
          {description}
          <p>
            Check if the server is running at
            {' '}
            <strong>
              {getBaseUrl()}
            </strong>
          </p>
        </div>
      )}
    />
  );
}
