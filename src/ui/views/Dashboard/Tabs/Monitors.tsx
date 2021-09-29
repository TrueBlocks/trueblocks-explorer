import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';

import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import {
  Button, Form, Input, Spin,
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { ColumnsType } from 'antd/lib/table';

import {
  addActionsColumn, addColumn, addNumColumn, addTagsColumn, BaseTable, TableActions,
} from '@components/Table';
import { useCommand } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { renderClickableAddress } from '@modules/renderers';
import { Monitor } from '@modules/types';

import { useGlobalState } from '../../../State';
import { goToUrl } from '../../../Utilities';

export const Monitors = () => {
  const [searchText, setSearchText] = useState('');
  const [_, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);
  const {
    namesEditModalVisible,
    setNamesEditModalVisible,
  } = useGlobalState();
  const [selectedNameAddress, setSelectedNameAddress] = useState('');
  const [selectedNameName, setSelectedNameName] = useState('');
  const [selectedNameDescription, setSelectedNameDescription] = useState('');
  const [selectedNameSource, setSelectedNameSource] = useState('');
  const [selectedNameTags, setSelectedNameTags] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [monitors, loading] = useCommand('status', { mode: 'monitors', details: '' });
  if (monitors.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch monitors',
    });
  }
  const theData = useMemo(() => {
    const response = monitors;
    return response.status === 'fail' || !response.data[0].caches
      ? []
      : response.data[0].caches[0].items?.map((item: any, i: number) => ({
        id: (i + 1).toString(),
        searchStr: `${item.address} ${item.name}`,
        ...item,
      }));
  }, [monitors]);

  // Antd filter routine requires this structure
  // export interface FilterDropdownProps {
  //   prefixCls: string;
  //   setSelectedKeys: (selectedKeys: React.Key[]) => void;
  //   selectedKeys: React.Key[];
  //   confirm: (param?: FilterConfirmProps) => void;
  //   clearFilters?: () => void;
  //   filters?: ColumnFilterItem[];
  //   visible: boolean;
  // }
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <SearchInput
          onEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
          searchInputRef={searchInputRef}
          dataIndex={dataIndex}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
        <SearchButton
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
        />
        <ResetButton onClick={() => handleReset(clearFilters, setSearchText)} />
      </div>
    ),
    filterIcon: filterIconFunc,
    onFilter: (value: any, record: any) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ''),
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        // @ts-ignore
        setTimeout(() => searchInputRef.current.select(), 100);
      }
    },
  });

  const onEditItem = () => {
    setLoadingEdit(true);
    fetch(`${process.env.CORE_URL}/names`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        address: selectedNameAddress,
        description: selectedNameDescription,
        name: selectedNameName,
        source: selectedNameSource.length > 0 ? selectedNameSource : 'Etherscan.io',
        tags: selectedNameTags,
      }),
    })
      .then((result) => result.json())
      .then((response) => {
        /* let newAddresses = { ...addresses };
        //@ts-ignore
        let foundAddress = newAddresses.data.map((item) => item.address).indexOf(namesEditModal.address);
        //@ts-ignore
        newAddresses.data[foundAddress] = {
          //@ts-ignore
          ...newAddresses.data[foundAddress],
          description: selectedNameDescription,
          name: selectedNameName,
          source: selectedNameSource,
          tags: selectedNameTags,
        };
        setAddresses(newAddresses); */
        setLoadingEdit(false);
        setNamesEditModalVisible(false);
      });
  };

  const recents = [
    // TODO(tjayrush): obviously, this should not be hard coded
    { name: 'TrueBlocks Wallet', address: '0xf503017d7baf7fbc0fff7492b751025c6a78179b' },
    { name: 'BokkyPooBah', address: '0x000001f568875f378bf6d170b790967fe429c81a' },
    { name: 'DeeEee', address: '0xd1629474d25a63b1018fcc965e1d218a00f6cbd3' },
    { name: 'BTag', address: '0x0035fc5208ef989c28d47e552e92b0c507d2b318' },
    { name: 'M', address: '0x054993ab0f2b1acc0fdc65405ee203b4271bebe6' },
  ];

  return (
    <>
      <Modal
        visible={namesEditModalVisible}
        footer={null}
        onCancel={() => setNamesEditModalVisible(false)}
      >
        {loadingEdit ? (
          <div style={{
            padding: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
          >
            <Spin />
          </div>
        ) : (
          <Form onFinish={() => onEditItem()}>
            <div style={{ marginTop: '24px' }}>
              <div style={{ marginTop: '16px' }}>
                <Form.Item
                  label={<div style={{ minWidth: '64px' }}>Address</div>}
                  name='address'
                  rules={[{ required: true, message: 'Address required' }]}
                  {...(selectedNameAddress.length > 0
                    && (selectedNameAddress.slice(0, 2) !== '0x' || selectedNameAddress.length !== 42) && {
                    help: 'Address must begin with 0x and be 42 characters',
                    validateStatus: 'error',
                  })}
                >
                  <Input
                    placeholder='Address'
                    value={selectedNameAddress}
                    onChange={(e) => setSelectedNameAddress(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Form.Item
                  label={<div style={{ minWidth: '64px' }}>Name</div>}
                  name='name'
                  rules={[{ required: true, message: 'Name is required' }]}
                >
                  <Input
                    placeholder='Name'
                    value={selectedNameName}
                    onChange={(e) => setSelectedNameName(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Form.Item label={<div style={{ minWidth: '74px' }}>Description</div>} name='description'>
                  <Input
                    placeholder='Description'
                    value={selectedNameDescription}
                    onChange={(e) => setSelectedNameDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Form.Item label={<div style={{ minWidth: '74px' }}>Source</div>} name='source'>
                  <Input
                    placeholder='Source'
                    value={selectedNameSource}
                    onChange={(e) => setSelectedNameSource(e.target.value)}
                  />
                </Form.Item>
              </div>
              <div style={{ marginTop: '16px' }}>
                <Form.Item label={<div style={{ minWidth: '74px' }}>Tags</div>} name='tags'>
                  <Input
                    placeholder='Tags'
                    value={selectedNameTags}
                    onChange={(e) => setSelectedNameTags(e.target.value)}
                  />
                </Form.Item>
              </div>
              <Form.Item>
                <div style={{ marginTop: '16px' }}>
                  <Button type='primary' htmlType='submit'>
                    Submit
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
      <div
        onClick={() => setNamesEditModalVisible(true)}
        style={{
          marginTop: '16px',
          marginBottom: '24px',
          color: 'rgb(24, 144, 255)',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '20px',
        }}
      >
        <PlusCircleFilled style={{ marginRight: '8px' }} />
        Add new monitor
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 5fr' }}>
        <div style={{ borderRight: '1px solid lightgrey', marginLeft: '5' }}>
          <h2>Recents</h2>
          {recents.map((item, index) => (
            <div key={index}>{renderClickableAddress(item.name, item.address)}</div>
          ))}
        </div>
        <BaseTable
          dataSource={theData}
          columns={monitorSchema.map((item) =>
            // @ts-ignore
            ({ ...item, ...getColumnSearchProps(item.dataIndex) }))}
          loading={loading}
        />
      </div>
    </>
  );
};

const filterIconFunc = (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;

const handleReset = (clearFilters: any, setSearchText: any) => {
  clearFilters();
  setSearchText('');
};

const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any, setSearchText: any, setSearchedColumn: any) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const SearchInput = ({
  onEnter,
  searchInputRef,
  dataIndex,
  selectedKeys,
  setSelectedKeys,
}: {
  onEnter: any;
  searchInputRef: any;
  dataIndex: any;
  selectedKeys: any;
  setSelectedKeys: any;
}) => (
  <Input
    ref={searchInputRef}
    placeholder={`Search ${dataIndex}`}
    value={selectedKeys[0]}
    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    onPressEnter={onEnter}
    style={{ marginBottom: 8, display: 'block' }}
  />
);
const SearchButton = ({ onClick }: { onClick: any }) => (
  <Button type='primary' onClick={onClick} icon={<SearchOutlined />} size='small' style={{ width: 90 }}>
    Search
  </Button>
);

const ResetButton = ({ onClick }: { onClick: any }) => (
  <Button onClick={onClick} size='small' style={{ width: 90 }}>
    Reset
  </Button>
);

const FilterButton = ({ onClick }: { onClick: any }) => (
  <Button type='link' size='small' onClick={onClick}>
    Filter
  </Button>
);

const monitorSchema: ColumnsType<Monitor> = [
  addColumn<Monitor>({
    title: 'Name / Address',
    dataIndex: 'searchStr',
    configuration: {
      render: (unused, record) => renderClickableAddress(record.name, record.address),
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
    (tag: string) => console.log('tag click', tag),
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
      title: 'Actions',
      dataIndex: '',
      configuration: {
        align: 'left',
      },
    },
    {
      width: 150,
      getComponent: getTableActions,
    },
  ),
];

function getTableActions(item: Monitor) {
  const onClick = (action: string, item: Monitor) => {
    switch (action) {
      case 'info':
        goToUrl(`https://etherscan.io/address/${item.address}`);
        break;
      case 'delete':
        console.log('DELETE');
        break;
      case 'edit':
        console.log('EDIT');
        break;
      case 'view':
        console.log('VIEW');
        break;
      default:
        console.log('Unknown action', action, item.name);
        break;
    }
  };

  return <TableActions item={item} onClick={onClick} />;
}
