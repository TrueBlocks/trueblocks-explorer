import React from 'react';
import { useHistory } from 'react-router-dom';

export const renderNamedAddress = (record: any, location: string) => {
  const history = useHistory();
  return (
    <div>
      <div>{record.name === '' ? <div style={{ fontStyle: 'italic' }}>not named</div> : record.name}</div>
      <div>{record.address}</div>
    </div>
  );
};
