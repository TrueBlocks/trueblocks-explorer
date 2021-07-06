import { SearchOutlined } from '@ant-design/icons';
import { addActionsColumn, addColumn, addNumColumn, addTagsColumn, BaseTable, TableActions } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { renderNamedAddress } from '@modules/renderers';
import { Monitor } from '@modules/types';
import { Button, Input, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useState, useRef } from 'react';
import { DashboardAccountsAddressLocation } from '../../../Routes';

export const Monitors = () => {
  const [monitors, loading] = useCommand('status', { mode: 'monitors', details: true });
  const [searchText, setSearchText] = useState('');
  const [_, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);

  if (monitors.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch monitors',
    });
  }

  const getData = useCallback((response) => {
    return response.status === 'fail' || !response.data[0].caches ? [] : response.data[0].caches[0].items;
  }, []);

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        //@ts-ignore
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };

  return (
    <>
      <BaseTable
        data={getData(monitors)}
        columns={monitorSchema.map((item) => {
          //@ts-ignore
          return { ...item, ...getColumnSearchProps(item.dataIndex) };
        })}
        loading={loading}
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
      title: `Add`,
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
