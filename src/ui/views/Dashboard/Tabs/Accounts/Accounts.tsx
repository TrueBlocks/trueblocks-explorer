import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { ViewTab } from '@components/BaseView';
import { addColumn, addFlagColumn, BaseTable } from '@components/Table';
import { Result, toFailedResult, toSuccessfulData } from '@hooks/useCommand';
import { runCommand } from '@modules/core';
import { createErrorNotification } from '@modules/error_notification';
import { Reconciliation, ReconciliationArray, Transaction } from '@modules/types';
import { Checkbox, Divider, Input, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation } from 'react-router-dom';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { AccountTransactions } from './Tabs/Transactions';

const { TabPane } = Tabs;

export const AccountsView = ({ initAddress }: { initAddress: string }) => {
  const [accounting, setAccounting] = useState(true);
  const [staging, setStaging] = useState(false);
  const [denom, setDenom] = useState('ether');
  const [currentAddress, setCurrentAddress] = useState(initAddress);
  const emptyData = { data: [{}], meta: {} };
  const [transactions, setTransactions] = useState<Result>(toSuccessfulData(emptyData));
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [totalRecords, setTotalRecords] = useState<null | number>(null);
  const address = parts[parts.length - 1];

  const onAccounting = () => setAccounting(!accounting);
  const onStaging = () => setStaging(!staging);
  const onEther = () => {
    setAccounting(true);
    denom === 'ether' ? setDenom('') : setDenom('ether');
  };
  const onDollars = useCallback(() => {
    setAccounting(true);
    denom === 'dollars' ? setDenom('') : setDenom('dollars');
  }, []);

  useEffect(() => {
    (async () => {
      if (currentAddress.slice(0, 2) === '0x') {
        setLoading(true);
        const eitherResponse = await runCommand('list', {
          count: true,
          appearances: true,
          addrs: currentAddress,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        //@ts-ignore
        setTotalRecords(result.data[0]?.nRecords);
        setLoading(false);
      }
    })();
  }, [currentAddress, denom, accounting, staging]);

  useEffect(() => {
    (async () => {
      if (totalRecords && transactions.data.length < totalRecords) {
        const eitherResponse = await runCommand('export', {
          addrs: currentAddress,
          fmt: 'json',
          cache_txs: true,
          cache_traces: true,
          staging: staging,
          // unripe: true,
          ether: denom === 'ether',
          dollars: denom === 'dollars',
          articulate: true,
          accounting: accounting,
          reversed: false,
          first_record: transactions?.data?.length,
          max_records:
            transactions?.data?.length < 100
              ? 10
              : 31 /* an arbitrary number not too big, not too small, that appears not to repeat */,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        let newTransactions = { ...transactions };
        //@ts-ignore
        newTransactions.data = [...newTransactions.data, ...result.data];
        setTransactions(newTransactions);
      }
    })();
  }, [totalRecords, transactions]);

  if (transactions.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch transactions',
    });
  }

  const tinyTabs: ViewTab[] = [
    {
      name: 'Assets',
      location: 'assets',
      component: <div>Assets</div>,
    },
    { name: 'Neighbors', location: 'neighbors', component: <div>Neighbors</div> },
    { name: 'Charts', location: 'charts', component: <div>Charts</div> },
    { name: 'Functions', location: 'functions', component: <div>Functions</div> },
    { name: 'Events', location: 'events', component: <div>Events</div> },
  ];

  const getData = useCallback((response) => (response.status === 'fail' ? [] : response.data), []);
  const theData = getData(transactions);
  const getMeta = useCallback((response) => (response.status === 'fail' ? [] : response.meta), []);
  const expandRender = (record: any) => <AccountTransactions record={record} />;
  return (
    <div>
      <Checkbox checked={accounting} onChange={(event) => onAccounting()}>
        accounting
      </Checkbox>
      <Checkbox checked={staging} onChange={(event) => onStaging()}>
        staging
      </Checkbox>
      <Checkbox checked={denom === 'ether'} onChange={(event) => onEther()}>
        ether
      </Checkbox>
      <Checkbox checked={denom === 'dollars'} onChange={(event) => onDollars()}>
        dollars
      </Checkbox>
      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <h3 style={{ marginRight: '12px', flexShrink: 0 }}>Viewing account:</h3>
        <Input
          disabled={loading}
          placeholder={'Input an address'}
          value={currentAddress}
          onChange={(e) => setCurrentAddress(e.target.value)}
        />
        <progress
          style={{ position: 'absolute', right: '8px' }}
          max={'100'}
          value={((transactions.data.length / (totalRecords || 1)) * 100).toFixed(0)}
        />
      </div>

      <Divider />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 14fr' }}>
        <div>
          <b>
            Summary for
            <br />
            <div style={{ width: '40px' }}> </div>
            {currentAddress.slice(0, 6) +
              '...' +
              currentAddress.slice(currentAddress.length - 5, currentAddress.length - 1)}
          </b>
          <br />
          nTransactions: {theData.length}
          <br />
          firstBlock: {theData && theData.length > 0 && theData[0].blockNumber}
          <br />
          lastBlock: {theData && theData.length > 0 && theData[theData.length - 1].blockNumber}
          <br />
          balance: {'XXX'}
          <Divider />
          <TinyTabs tabs={tinyTabs} />
        </div>
        <BaseTable
          data={getData(transactions)}
          columns={transactionSchema}
          loading={loading}
          extraData={currentAddress}
          expandRender={expandRender}
        />
      </div>
    </div>
  );
};

const TinyTabs = ({ tabs }: { tabs: ViewTab[] }) => {
  return (
    <Tabs tabPosition='left'>
      {tabs.map((tab: any) => {
        return <TabPane key={tab.location} tab={tab.name} />;
      })}
    </Tabs>
  );
};

export const transactionSchema: ColumnsType<Transaction> = [
  addColumn({
    title: 'Date',
    dataIndex: 'date',
    configuration: {
      render: (field: any, record: Transaction) => {
        if (!record) return <div></div>;
        return (
          <pre>
            <div>{record.date}</div>
            <div>{moment.unix(record.timestamp).fromNow()}</div>
            <div style={{ fontSize: 'small', fontStyle: 'italic' }}>
              {record.blockNumber?.toString() + '.' + record.transactionIndex?.toString()}
            </div>
          </pre>
        );
      },
      width: 250,
    },
  }),
  addColumn({
    title: 'From / To',
    dataIndex: 'from',
    configuration: {
      width: 400,
      render: (value: any, record: Transaction) => {
        if (!record) return <div></div>;
        const from = value === record.extraData ? <div style={{ color: 'red' }}>{value}</div> : value;
        const to = record.to === record.extraData ? <div style={{ color: 'red' }}>{record.to}</div> : record.to;
        return (
          <pre>
            <div>{from}</div>
            <div>{to}</div>
          </pre>
        );
      },
    },
  }),
  addFlagColumn({
    title: 'Err',
    dataIndex: 'isError',
    configuration: {
      width: 50,
    },
  }),
  addFlagColumn({
    title: 'Tok',
    dataIndex: 'hasToken',
    configuration: {
      width: 50,
    },
  }),
  addColumn({
    title: 'Reconciliations (asset, beg, in, out, gasOut, end, check)',
    dataIndex: 'compressedTx',
    configuration: {
      render: (item, record) => {
        return (
          <div style={{ border: '1px solid brown' }}>
            <div style={{ fontSize: '12pt', fontWeight: 600, backgroundColor: 'indianred', color: 'yellow' }}>
              {item}
            </div>
            <div>{renderStatements(record.statements)}</div>
          </div>
        );
      },
      width: 900,
    },
  }),
  addColumn({
    title: '',
    dataIndex: 'statements',
    configuration: {
      render: (item, record) => (
        <a target='_blank' href={'http://etherscan.io/tx/' + record.hash}>
          ES
        </a>
      ),
      width: 300,
    },
  }),
];

export const renderStatements = (statements: ReconciliationArray) => {
  const styles = useStyles();
  if (statements === null) return <></>;
  return (
    <table className={style.table}>
      <tbody>
        {statements?.map((statement, i) => {
          let show = true;
          return (
            <Statement
              key={
                statement.blockNumber * 100000 + statement.transactionIndex + statement.assetSymbol ||
                `${i}-${Math.random()}`
              }
              statement={statement}
            />
          );
        })}
      </tbody>
    </table>
  );
};

const ReconIcon = ({ reconciled }: { reconciled: boolean }) => {
  return (
    <div>
      {reconciled ? <CheckCircleFilled style={{ color: 'green' }} /> : <CloseCircleFilled style={{ color: 'red' }} />}
    </div>
  );
};

function totalIn1(st: Reconciliation) {
  return (
    Number(st['amountIn']) +
    Number(st['internalIn']) +
    Number(st['selfDestructIn']) +
    Number(st['minerBaseRewardIn']) +
    Number(st['minerNephewRewardIn']) +
    Number(st['minerTxFeeIn']) +
    Number(st['minerUncleRewardIn']) +
    Number(st['prefundIn'])
  ).toString();
}

//----------------------------------------------------------------------------
function totalOut1(st: Reconciliation) {
  return (
    // Number(st['gasCostOut']) +
    (Number(st['amountOut']) + Number(st['internalOut']) + Number(st['selfDestructOut'])).toString()
  );
}

const Statement = ({ statement }: { statement: Reconciliation }) => {
  const styles = useStyles();

  return (
    <tr className={styles.row} key={statement.assetSymbol || Math.random()}>
      <td key={`${1}-${Math.random()}`} className={styles.col} style={{ width: '12%' }}>
        {statement.assetSymbol?.slice(0, 5)}
      </td>
      <td key={`${2}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.begBal)}
      </td>
      <td key={`${3}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {totalIn1(statement)}
      </td>
      <td key={`${4}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {totalOut1(statement)}
      </td>
      <td key={`${5}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.gasCostOut, true)}
      </td>
      <td key={`${6}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.endBal)}
      </td>
      <td key={`${7}-${Math.random()}`} className={styles.col} style={{ width: '4%' }}>
        <ReconIcon reconciled={statement.reconciled} />
      </td>
    </tr>
  );
};

const clip = (num: string, is_gas?: boolean) => {
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '')
    return (
      <div style={{ color: 'lightgrey' }}>
        {'0.0000000'}
        {is_gas ? 'g' : ''}
      </div>
    );
  if (parts.length === 1)
    return (
      parts[0] +
      (
        <div>
          {'.0000000'}
          {is_gas ? 'g' : ''}
        </div>
      )
    );
  return (
    <div>
      {parts[0] + '.' + parts[1].substr(0, 7)}
      {is_gas ? 'g' : ''}
    </div>
  );
};

const useStyles = createUseStyles({
  table: {},
  row: {},
  col: {
    textAlign: 'right',
    backgroundColor: '#fff7e6',
  },
});
