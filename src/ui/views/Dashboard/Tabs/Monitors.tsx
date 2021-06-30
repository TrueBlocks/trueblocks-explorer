import { Account } from '@components/Account';
import { addActionsColumn, addColumn, addNumColumn, addTagsColumn, BaseTable, TableActions } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { renderNamedAddress } from '@modules/renderers';
import { Monitor } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback } from 'react';
import { DashboardAccountsAddressLocation } from '../../../locations';

export const Monitors = () => {
  const [monitors, loading] = useCommand('status', { mode: 'monitors', details: true });
  if (monitors.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch monitors',
    });
  }

  const getData = useCallback((response) => {
    return response.status === 'fail' || !response.data[0].caches ? [] : response.data[0].caches[0].items;
  }, []);

  return (
    <>
      <BaseTable
        data={getData(monitors)}
        columns={monitorSchema}
        loading={loading}
        expandRender={(row) => {
          return <Account initAddress={row.address} />;
        }}
      />
    </>
  );
};

const monitorSchema: ColumnsType<Monitor> = [
  addColumn<Monitor>({
    title: 'Address',
    dataIndex: 'address',
    configuration: {
      render: (unused, record) => renderNamedAddress(record, DashboardAccountsAddressLocation(record.address)),
      width: 500,
    },
  }),
  addTagsColumn(
    {
      title: 'Tags',
      dataIndex: 'tags',
      configuration: {
        ellipsis: false,
      },
    },
    (tag: string) => console.log('tag click', tag)
  ),
  addNumColumn<Monitor>({
    title: 'nAppearances',
    dataIndex: 'nApps',
    configuration: {
      sorter: {
        compare: (a, b) => a.nApps - b.nApps,
        multiple: 1,
      },
    },
  }),
  addNumColumn({
    title: 'firstAppearance',
    dataIndex: 'firstApp',
  }),
  addNumColumn({
    title: 'latestAppearance',
    dataIndex: 'latestApp',
  }),
  addNumColumn({
    title: 'sizeInBytes',
    dataIndex: 'sizeInBytes',
  }),
  addActionsColumn<Monitor>(
    {
      title: `<Button>Add</Button>`,
      dataIndex: '',
      configuration: {
        align: 'right',
      },
    },
    {
      width: 150,
      getComponent: getTableActions,
    }
  ),
];

function getTableActions(item: Monitor) {
  const onClick = (action: string, item: Monitor) => {
    switch (action) {
      case 'remove':
        console.log('Deleting the monitor', item);
        break;
      default:
        console.log('Clicked action', action, item);
    }
  };

  return <TableActions item={item} onClick={onClick} />;
}
