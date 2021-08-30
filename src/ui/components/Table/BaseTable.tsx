import React, { useEffect, useState } from 'react';

import Table, { ColumnsType } from 'antd/lib/table';
import Mousetrap from 'mousetrap';

import 'antd/dist/antd.css';

type JsonResponse = Record<string, any>;

export const BaseTable = ({
  dataSource,
  columns,
  loading,
  extraData,
  expandRender = undefined,
  siderRender = undefined,
  defPageSize = 7,
}: {
  dataSource: JsonResponse;
  columns: ColumnsType<any>;
  loading: boolean;
  extraData?: string;
  expandRender?: (row: any) => JSX.Element;
  siderRender?: (record: any) => JSX.Element;
  defPageSize?: number;
}) => {
  const [displayedRow, setDisplayedRow] = useState(dataSource ? dataSource[0] : {});
  const [curRow, setCurRow] = useState(Number(sessionStorage.getItem('curRow')) || 0);
  const [curPage, setCurPage] = useState(Number(sessionStorage.getItem('curPage')) || 1);
  const [pageSize, setPageSize] = useState(defPageSize);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyedData, setKeyedData] = useState([{ key: 0 }]);

  const setRowNumber = (n: number) => {
    const num = Math.max(0, Math.min(dataSource.length - 1, n));
    setCurRow(num);
    const page = Math.floor(num / pageSize) + 1;
    setCurPage(page);
    // sessionStorage.setItem('curRow', num.toString());
    // sessionStorage.setItem('curPage', page.toString());
  };

  Mousetrap.bind('up', () => setRowNumber(curRow - 1));
  Mousetrap.bind('down', () => setRowNumber(curRow + 1));
  Mousetrap.bind(['left', 'pageup'], () => setRowNumber(curRow - pageSize));
  Mousetrap.bind(['right', 'pagedown'], () => setRowNumber(curRow + pageSize));
  Mousetrap.bind('home', () => setRowNumber(0));
  Mousetrap.bind('end', () => setRowNumber(dataSource.length - 1));
  Mousetrap.bind('enter', () => {
    setIsExpanded(!isExpanded);
  });

  useEffect(() => {
    setKeyedData(
      dataSource
        ? dataSource.map((record: any, index: number) => {
          if (record.key !== undefined) console.log('BaseTable assigns the key field, data should not.');
          return {
            key: index,
            extraData,
            ...record,
          };
        })
        : [],
    );
  }, [dataSource, extraData]);

  useEffect(() => {
    setDisplayedRow(keyedData[curRow]);
  }, [curRow, keyedData]);

  // clean up mouse control when we unmount
  useEffect(() => () => {
    // setCurRow(0);
    // setCurPage(1);
    Mousetrap.unbind(['up', 'down', 'pageup', 'pagedown', 'home', 'end', 'enter']);
  }, []);

  const gridStyle = siderRender ? { display: 'grid', gridTemplateColumns: '30fr 1fr 12fr 1fr' } : {};
  const expandedRowRender = expandRender !== undefined ? expandRender : (row: any) => <pre>{JSON.stringify(row, null, 2)}</pre>;

  return (
    <div style={gridStyle}>
      <Table
        onRow={(record, rowIndex) => ({
          onClick: (event) => {
            setRowNumber(record.key);
          },
          style: record.key === curRow ? { color: 'darkblue', backgroundColor: 'rgb(236, 235, 235)' } : {},
        })}
        size='small'
        loading={loading}
        columns={columns}
        dataSource={keyedData}
        expandable={{
          expandedRowRender,
        }}
        pagination={{
          onChange: (page, newPageSize) => {
            if (newPageSize && newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setRowNumber(0);
            }
          },
          pageSize,
          current: curPage,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
        }}
      />
      <div />
      {siderRender ? siderRender(displayedRow) : <></>}
      <div />
    </div>
  );
};

// TODO(tjayrush): We used to be able to press enter to open a record's details
