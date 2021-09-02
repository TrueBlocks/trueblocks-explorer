import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  Button, Checkbox, Select,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { addColumn } from '@components/Table';
import {
  Transaction,
} from '@modules/types';

import { useGlobalState } from '../../../../../State';
import { downloadRecords } from '../../../../../Utilities';
import { AccountViewParams } from '../../../Dashboard';

export const ViewOptions = ({ params }: { params: AccountViewParams }) => {
  const { denom, setDenom } = useGlobalState();

  const styles = useStyles();
  const { prefs } = params;

  const onEther = () => {
    setDenom('ether');
  };

  const onDollars = () => {
    setDenom('dollars');
  };

  const onHideZero = () => {
    prefs.setHideZero(prefs.hideZero === 'hide' ? 'all' : 'hide');
  };
  const onShowZero = () => {
    prefs.setHideZero(prefs.hideZero === 'show' ? 'all' : 'show');
  };
  const onShowAll = () => {
    prefs.setHideZero(prefs.hideZero === 'all' ? 'hide' : 'all');
  };

  const onExportCSV = () => {
    downloadRecords(params.theData, exportColumns, ',', '"');
  };

  const onExportTXT = () => {
    downloadRecords(params.theData, exportColumns, '\t', '');
  };

  const repOptions = ['by tx', 'by hour', 'by day', 'by week', 'by month', 'by quarter', 'by year'];
  return (
    <div style={{ marginLeft: '2px' }}>
      <h3 className={styles.smallHeader}>options: </h3>
      <div className={styles.smallHeader}>head: </div>
      <Checkbox checked={prefs.staging} onChange={() => prefs.setStaging(!prefs.staging)}>
        staging
      </Checkbox>
      <br />
      {/* TODO(tjayrush): should be unripe... */}
      <Checkbox checked={prefs.staging} onChange={() => prefs.setStaging(!prefs.staging)}>
        unripe
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>display: </div>
      <Select
        placeholder='Inserted are removed'
        value={prefs.period}
        onChange={(newValue) => prefs.setPeriod(newValue)}
        style={{ width: '100%' }}
      >
        {repOptions.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <Checkbox checked={prefs.hideNamed} onChange={() => prefs.setHideNamed(!prefs.hideNamed)}>
        unnamed
      </Checkbox>
      <br />
      <Checkbox checked={prefs.hideReconciled} onChange={() => prefs.setHideReconciled(!prefs.hideReconciled)}>
        unreconciled
      </Checkbox>
      <br />
      <Checkbox checked={prefs.showDetails} onChange={() => prefs.setShowDetails(!prefs.showDetails)}>
        details
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>zero balance: </div>
      <Checkbox checked={prefs.hideZero === 'hide'} onChange={() => onHideZero()}>
        hide
      </Checkbox>
      <br />
      <Checkbox checked={prefs.hideZero === 'show'} onChange={() => onShowZero()}>
        show
      </Checkbox>
      <br />
      <Checkbox checked={prefs.hideZero === 'all'} onChange={() => onShowAll()}>
        show all
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>denomination: </div>
      <Checkbox checked={denom === 'ether'} onChange={() => onEther()}>
        ether
      </Checkbox>
      <br />
      <Checkbox checked={denom === 'dollars'} onChange={() => onDollars()}>
        dollars
      </Checkbox>
      <p />
      <div className={styles.smallHeader}>export: </div>
      <Button onClick={onExportCSV} className={styles.exportBtn}>
        CSV...
      </Button>
      <Button onClick={onExportTXT} className={styles.exportBtn}>
        TXT...
      </Button>
      <Button className={styles.exportBtn}>QB...</Button>
    </div>
  );
};

const exportColumns: ColumnsType<Transaction> = [
  addColumn({
    title: 'bn.txid',
    dataIndex: 'blockNumber',
    configuration: {
      render: (unused, record) => `${record.blockNumber}.${record.transactionIndex}`,
    },
  }),
  addColumn({
    title: 'Hash',
    dataIndex: 'hash',
  }),
  addColumn({
    title: 'From Address',
    dataIndex: 'from',
  }),
  addColumn({
    title: 'From Name',
    dataIndex: 'fromName',
    configuration: {
      render: (item) => item.name,
    },
  }),
  addColumn({
    title: 'To Address',
    dataIndex: 'to',
  }),
  addColumn({
    title: 'To Name',
    dataIndex: 'toName',
    configuration: {
      render: (item) => item.name,
    },
  }),
];

const useStyles = createUseStyles({
  smallHeader: {
    fontWeight: 800,
    textDecoration: 'underline',
  },
  exportBtn: {
    margin: '0',
    padding: '1',
    paddingLeft: '8px',
    height: '30px',
    width: '70px',
    fontSize: '10pt',
    textAlign: 'left',
  },
});
