import { SearchOutlined } from '@ant-design/icons';
import { addActionsColumn, addColumn, addFlagColumn, addTagsColumn, BaseTable, TableActions } from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { renderNamedAddress } from '@modules/renderers';
import { Name } from '@modules/types';
import { Button, Input, Space } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import useGlobalState from '../../../state';
import { DashboardAccountsAddressLocation } from '../../../Routes';
import './Addresses.css';

export const Addresses = () => {
  const [searchText, setSearchText] = useState('');
  const [_, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);
  const { namesEditModal, setNamesEditModal } = useGlobalState();
  const [selectedNameName, setSelectedNameName] = useState(namesEditModal.name);
  const [selectedNameDescription, setSelectedNameDescription] = useState(namesEditModal.description);
  const [selectedNameSource, setSelectedNameSource] = useState(namesEditModal.source);
  const [selectedNameTags, setSelectedNameTags] = useState(namesEditModal.tags);
  const [addresses, loading] = useCommand('names', { expand: true, all: true });

  if (addresses.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch addresses',
    });
  }

  useEffect(() => {
    if (namesEditModal) {
      setSelectedNameName(namesEditModal.name);
      setSelectedNameDescription(namesEditModal.description);
      setSelectedNameSource(namesEditModal.source);
      setSelectedNameTags(namesEditModal.tags);
    }
  }, [namesEditModal]);

  const getData = useCallback((response) => {
    if (response.status === 'fail') return [];
    return response.data?.map((item: any, i: number) => {
      return {
        id: (i + 1).toString(),
        nameaddr: item.name + ' ' + item.address,
        ...item,
      };
    });
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

  const onEditItem = () => {
    console.log(namesEditModal);
    fetch(`${process.env.CORE_URL}/names?addrs=${namesEditModal.address}`, {
      method: 'POST',
      body: JSON.stringify({ address: namesEditModal.address, description: selectedNameDescription }),
    })
      .then((result) => result.json())
      .then((response) => console.log(response));
  };

  return (
    <>
      <Modal visible={namesEditModal} onCancel={() => setNamesEditModal(false)} onOk={() => onEditItem()}>
        <div style={{ marginTop: '24px' }}>
          <h2>Editing {namesEditModal.name || namesEditModal.address}</h2>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '6px' }}>Name</div>
            <Input
              placeholder={'Name'}
              value={selectedNameName}
              onChange={(e) => setSelectedNameName(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '6px' }}>Description</div>
            <Input
              placeholder={'Description'}
              value={selectedNameDescription}
              onChange={(e) => setSelectedNameDescription(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '6px' }}>Source</div>
            <Input
              placeholder={'Source'}
              value={selectedNameSource}
              onChange={(e) => setSelectedNameSource(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '6px' }}>Tags</div>
            <Input
              placeholder={'Tags'}
              value={selectedNameTags}
              onChange={(e) => setSelectedNameTags(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <BaseTable
        data={getData(addresses)}
        columns={addressSchema.map((item) => {
          //@ts-ignore
          return { ...item, ...getColumnSearchProps(item.dataIndex) };
        })}
        loading={loading}
      />
    </>
  );
};

const addressSchema: ColumnsType<Name> = [
  addColumn<Name>({
    title: 'Name / Address',
    dataIndex: 'nameaddr',
    configuration: {
      render: (unused, record) => renderNamedAddress(record, DashboardAccountsAddressLocation(record.address)),
      width: 500,
    },
  }),
  addColumn({
    title: 'Symbol',
    dataIndex: 'symbol',
  }),
  addColumn({
    title: 'Source',
    dataIndex: 'source',
  }),
  addColumn({
    title: 'Decimals',
    dataIndex: 'decimals',
  }),
  addColumn({
    title: 'Description',
    dataIndex: 'description',
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
  addFlagColumn({
    title: 'Prefund',
    dataIndex: 'is_prefund',
  }),
  addFlagColumn({
    title: 'ERC20',
    dataIndex: 'is_erc20',
  }),
  addFlagColumn({
    title: 'ERC721',
    dataIndex: 'is_erc721',
  }),
  addFlagColumn({
    title: 'Contract',
    dataIndex: 'is_contract',
  }),
  addFlagColumn({
    title: 'Custom',
    dataIndex: 'is_custom',
  }),
  addFlagColumn({
    title: 'Monitor',
    dataIndex: 'mon',
  }),
  addActionsColumn<Name>(
    {
      title: '',
      dataIndex: '',
    },
    {
      width: 150,
      getComponent: getTableActions,
    }
  ),
];

function getTableActions(item: Name) {
  const { setNamesEditModal } = useGlobalState();
  return (
    <TableActions
      item={item}
      onClick={(action, tableItem) => {
        if (action === 'edit') {
          setNamesEditModal(tableItem);
        }
        console.log('Clicked action', action, tableItem);
      }}
    />
  );
}
