import React, {
  useMemo, useRef, useState,
} from 'react';

import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import { getStatus } from '@sdk';
import {
  Button, Input,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { NamesEditModal } from '@components/NameEditModal';
import {
  addActionsColumn, addColumn, addNumColumn, addTagsColumn, BaseTable, TableActions,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import {
  CallStatus, isFailedCall, isPendingCall, isSuccessfulCall,
} from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';
import { renderClickableAddress } from '@modules/renderers';
import { FixedMonitor, FixedStatus } from '@modules/type_fixes';

import { useGlobalState } from '../../../State';
import { goToUrl } from '../../../Utilities';

export const Monitors = () => {
  const [, setSearchText] = useState('');
  const [, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);
  const {
    setNamesEditModalVisible,
  } = useGlobalState();
  const [selectedNameAddress] = useState('');
  const [selectedNameName] = useState('');
  const [selectedNameDescription] = useState('');
  const [selectedNameSource] = useState('');
  const [selectedNameTags] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);

  const monitorsCall = useSdk(() => getStatus({ modes: ['monitors'], details: true })) as CallStatus<FixedStatus[]>;
  if (isFailedCall(monitorsCall)) {
    createErrorNotification({
      description: 'Could not fetch monitors',
    });
  }
  const theData = useMemo(() => {
    if (isFailedCall(monitorsCall)) return [];
    if (isSuccessfulCall(monitorsCall) && !monitorsCall.data[0].caches) return [];
    if (isPendingCall(monitorsCall)) return [];

    return monitorsCall.data[0].caches[0].items?.map((item: any, i: number) => ({
      id: (i + 1).toString(),
      searchStr: `${item.address} ${item.name}`,
      ...item,
    }));
  }, [monitorsCall]);

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
        'Content-Type': 'application/json',
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
      .then(() => {
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

  const columns = useMemo(() => monitorSchema
    .map((item) => {
      if ('children' in item) return item;
      return { ...item, ...getColumnSearchProps(item.dataIndex) };
    }), []);

  return (
    <>
      <NamesEditModal
        loading={loadingEdit}
        onEdit={onEditItem}
      />
      <Button
        onClick={() => setNamesEditModalVisible(true)}
        // style={{
        //   marginTop: '16px',
        //   marginBottom: '24px',
        //   color: 'rgb(24, 144, 255)',
        //   fontWeight: 'bold',
        //   cursor: 'pointer',
        //   fontSize: '20px',
        // }}
      >
        <PlusCircleFilled style={{ marginRight: '8px' }} />
        Add new monitor
      </Button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 5fr' }}>
        <div style={{ borderRight: '1px solid lightgrey', marginLeft: '5' }}>
          <h2>Recents</h2>
          {recents.map((item) => (
            <div key={item.address}>{renderClickableAddress(item.name, item.address)}</div>
          ))}
        </div>
        <BaseTable
          dataSource={theData}
          columns={columns}
          loading={monitorsCall.loading}
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

const monitorSchema: ColumnsType<FixedMonitor> = [
  addColumn({
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
  addNumColumn({
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
  addActionsColumn<FixedMonitor>(
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

function getTableActions(item: FixedMonitor) {
  const onClick = (action: string, monitor: typeof item) => {
    switch (action) {
      case 'info':
        goToUrl(`https://etherscan.io/address/${monitor.address}`);
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
        console.log('Unknown action', action, monitor.name);
        break;
    }
  };

  return <TableActions item={item} onClick={onClick} />;
}
