import {
  addActionsColumn, addColumn,
  addFlagColumn,
  addTagsColumn,

  TableActions,
} from '@components/Table';
import { Name } from '@modules/data/name';
import Table, { ColumnsType } from 'antd/lib/table';
import { GetRowKey } from 'antd/lib/table/interface';
import React from 'react';

function getTableActions(item: Name) {
  return (
    <TableActions
      item={item}
      onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)}
    />
  );
}

export const NamesTable = ({
  getNames,
  loadingNames,
}: {
  getNames: () => Name[],
  loadingNames: boolean,
}) => {
  const onTagClick = (tag: string) => console.log('tag click', tag);

  const columns: ColumnsType<Name> = [
    addColumn<Name>({
      title: 'Address',
      dataIndex: 'address',
      configuration: {
        sorter: {
          compare(a, b) {
            if (a.address === b.address) return 0;
            return (a.address < b.address ? -1 : 1);
          },
        },
      },
    }),
    addColumn({
      title: 'Name',
      dataIndex: 'name',
      configuration: {
        sorter: {
          compare(a, b) {
            if (a.name === b.name) return 0;
            return (a.name < b.name ? -1 : 1);
          },
        },
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
    addTagsColumn({
      title: 'Tags',
      dataIndex: 'tags',
      configuration: {
        ellipsis: false,
      },
    }, onTagClick),
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
      title: 'Monitor',
      dataIndex: 'mon',
    }),
    addActionsColumn<Name>({
      title: '',
      dataIndex: '',
    }, {
      width: 150,
      getComponent: getTableActions,
    }),
  ];

  const rowKey: GetRowKey<Name> = ({ address }, index) => `${address}${index}`;

  return (
    <Table<Name>
      rowKey={rowKey}
      columns={columns}
      dataSource={getNames()}
      loading={loadingNames}
      size="small"
      scroll={{ x: 1300 }}
    />
  );
};
