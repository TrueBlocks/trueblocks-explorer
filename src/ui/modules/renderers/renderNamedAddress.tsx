import React from 'react';
import { useHistory } from 'react-router-dom';
import useGlobalState from '../../state';
import { DashboardAccountsAddressLocation } from '../../locations';

export const renderNamedAddress = (record: any, location: string) => {
  const history = useHistory();
  const { setAccountAddress } = useGlobalState();
  return (
    <div>
      <div>{record.name === '' ? <div style={{ fontStyle: 'italic' }}>not named</div> : record.name}</div>
      <div
        style={{ color: '#1890ff', cursor: 'pointer' }}
        onClick={() => {
          setAccountAddress(record.address);
          history.push(DashboardAccountsAddressLocation(record.address));
        }}>
        {record.address}
      </div>
    </div>
  );
};
