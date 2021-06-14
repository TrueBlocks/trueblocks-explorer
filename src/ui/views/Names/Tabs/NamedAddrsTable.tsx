import { addActionsColumn, addColumn, addFlagColumn, addTagsColumn, TableActions } from '@components/Table';
import { Name } from '@modules/data/name';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { getSiblings, useKeyBindings } from '../../../utils';

function getTableActions(item: Name) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}

export const CustomRow = (props: any) => {
  if (props.className.indexOf('ant-table-expanded-row') >= 0) return <tr {...props} />;
  else return <tr {...props} tabindex={0} />;
};

export const NamesTable = ({ getNames, loadingNames }: { getNames: () => Name[]; loadingNames: boolean }) => {
  const onTagClick = (tag: string) => console.log('tag click', tag);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.ReactText[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [focusedRow, setFocusedRow] = useState(0);

  const dataSource = getNames().map((item, i) => {
    return {
      id: (i + 1).toString(),
      ...item,
    };
  });

  const { handleOnFocus, handleOnBlur } = useKeyBindings(
    expandedRowKeys,
    setExpandedRowKeys,
    currentPage,
    pageSize,
    dataSource.length,
    () => currentPage < Math.ceil(dataSource.length / pageSize) && setCurrentPage(currentPage + 1),
    () => {
      currentPage > 1 && setCurrentPage(currentPage - 1);
      const tr = document.querySelector('tr[data-row-key]');
      const siblings = getSiblings(tr);
      siblings[siblings.length - 1].focus();
    },
    () => setCurrentPage(1),
    () => setCurrentPage(Math.ceil(dataSource.length / pageSize)),
    focusedRow,
    (row) => setFocusedRow(row)
  );

  useHotkeys(
    'left',
    () => {
      currentPage > 1 && setCurrentPage(currentPage - 1);
      const tr = document.querySelector('tr[data-row-key]');
      const siblings = getSiblings(tr);
      siblings[focusedRow].focus();
    },
    [currentPage, dataSource, focusedRow, setFocusedRow]
  );
  useHotkeys(
    'right',
    () => {
      currentPage < Math.ceil(dataSource.length / pageSize) && setCurrentPage(currentPage + 1);
      const tr = document.querySelector('tr[data-row-key]');
      const siblings = getSiblings(tr);
      siblings[focusedRow].focus();
    },
    [currentPage, dataSource, focusedRow, setFocusedRow]
  );

  console.log(focusedRow);

  const components = {
    body: { row: CustomRow },
  };
  const columns: ColumnsType<Name> = [
    addColumn<Name>({
      title: 'Address',
      dataIndex: 'address',
      configuration: {
        sorter: {
          compare(a, b) {
            if (a.address === b.address) return 0;
            return a.address < b.address ? -1 : 1;
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
            return a.name < b.name ? -1 : 1;
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
    addTagsColumn(
      {
        title: 'Tags',
        dataIndex: 'tags',
        configuration: {
          ellipsis: false,
        },
      },
      onTagClick
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

  useEffect(() => {
    const tr = document.querySelector('tr[data-row-key]');
    //@ts-ignore
    tr.focus();
    const siblings = getSiblings(tr);
    if (
      siblings &&
      siblings.length > 0 &&
      currentPage === Math.ceil(dataSource.length / pageSize) &&
      tr?.getAttribute('data-row-key')?.toString() !== siblings.length.toString()
    ) {
      siblings[siblings.length - 1].focus();
    }
  }, [currentPage]);

  return (
    <div onFocus={handleOnFocus} onBlur={handleOnBlur}>
      <Table<Name>
        rowKey={'id'}
        components={components}
        columns={columns}
        dataSource={dataSource}
        loading={loadingNames}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            pageSize && setPageSize(pageSize);
          },
        }}
        rowClassName={(record, index) => 'row-' + index}
        size='small'
        scroll={{ x: 1300 }}
        /*expandable={{
          onExpandedRowsChange: (expandedRowKeys) => {
            // console.log(expandedRowKeys);
            setExpandedRowKeys(expandedRowKeys);
          },
          expandedRowKeys: expandedRowKeys,
          expandedRowRender: (rowset) => <div>hello</div>,
        }}*/
      />
    </div>
  );
};
