import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';

import {
  ApiFilled, ClockCircleFilled, ExperimentFilled, EyeFilled,
} from '@ant-design/icons';
import { SuccessResponse } from '@sdk';
import { Badge } from 'antd';
import filesize from 'filesize';

import { Loading } from '@components/Loading';
import { createEmptyMeta, FixedStatus } from '@modules/type_fixes';

const useStyles = createUseStyles({
  container: { paddingBottom: '16px' },
  header: {
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    marginBottom: '20px',
  },
  itemContainer: { marginTop: '12px' },
  itemHeader: {
    fontSize: '9px',
    letterSpacing: '0.1em',
    fontWeight: 500,
  },
  itemIcon: { fontSize: '10px', marginRight: '4px' },
  statusItem: {
    fontSize: '9px',
    letterSpacing: '0.1em',
    fontWeight: 500,
    marginLeft: '4px',
  },
});

interface StatusPanelProps {
  // status is always a { data: ..., meta: ... } because of the way we fetch it in App.ts
  status: Pick<SuccessResponse<FixedStatus>, 'data' | 'meta'>;
  error: boolean;
  loading: boolean;
}

export const StatusPanel = ({ status, loading, error }: StatusPanelProps) => {
  const styles = useStyles();

  const statusData = status.data;
  const statusMeta = useMemo(() => (error ? createEmptyMeta() : status.meta), [error, status.meta]);

  const ripe = statusMeta.ripe !== statusMeta.staging ? (
    <ScraperProgress value={statusMeta.ripe} client={statusMeta.client} word='RIPE' color='#fadb14' />
  ) : (
    <></>
  );
  const unripe = statusMeta.unripe !== statusMeta.ripe ? (
    <ScraperProgress value={statusMeta.unripe} client={statusMeta.client} word='UNRIPE' color='#f5222d' />
  ) : (
    <></>
  );

  return (
    <Loading loading={loading}>
      <div className={styles.container}>
        <div className={styles.header}>ETHEREUM NODE</div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>STATUS</div>
          <div>
            <Badge status={error ? 'error' : 'success'} />
            {error ? 'Error' : 'Connected'}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>LATEST</div>
          <div>
            <ClockCircleFilled className={styles.itemIcon} />
            {Intl.NumberFormat().format(statusMeta.client)}
          </div>
        </div>

        <div className={styles.header} style={{ marginTop: '24px' }}>
          TRUEBLOCKS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>API</div>
          <div>
            <Badge status={statusData.isApi ? 'success' : 'error'} />
            {statusData.isApi ? 'Connected' : 'Not connected'}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SCRAPER</div>
          <div>
            <Badge status={statusData.isScraping ? 'success' : 'error'} />
            {statusData.isScraping ? 'Scraping' : 'Not scraping'}
          </div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BLOCKS</div>
          <ScraperProgress value={statusMeta.finalized} client={statusMeta.client} word='FINAL' color='#52c41a' />
          <ScraperProgress value={statusMeta.staging} client={statusMeta.client} word='STAGING' color='#fadb14' />
          {ripe}
          {unripe}
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>MONITORS</div>
          <div>
            <EyeFilled className={styles.itemIcon} />
            {statusData.cache && statusData.cache[1].nFiles}
            {' '}
            (
            {statusData.cache && filesize(statusData.cache[1].sizeInBytes)}
            )
          </div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SLURPS</div>
          <div>
            <ExperimentFilled className={styles.itemIcon} />
            {statusData.cache && statusData.cache[3].nFiles}
            {' '}
            (
            {statusData.cache && filesize(statusData.cache[3].sizeInBytes)}
            )
          </div>
        </div>

        <div className={styles.header} style={{ marginTop: '24px' }}>
          OPTIONS
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>RPC</div>
          <div>{statusData.rpcProvider}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BALANCE PROVIDER</div>
          <div>{statusData.balanceProvider}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>API</div>
          <div>{process.env.CORE_URL}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CACHE</div>
          <div>{statusData.cachePath}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>INDEX</div>
          <div>{statusData.indexPath}</div>
        </div>

        <div className={styles.header} style={{ marginTop: '24px' }}>
          VERSIONS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CLIENT</div>
          <div>{statusData.clientVersion}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>TRUEBLOCKS</div>
          <div>{statusData.trueblocksVersion}</div>
        </div>
      </div>
    </Loading>
  );
};

const ScraperProgress = ({
  value,
  client,
  word,
  color,
}: {
  value: number;
  client: number;
  word: string;
  color: string;
}) => {
  const styles = useStyles();
  const cn: string = styles.itemIcon;
  const dist = Intl.NumberFormat().format(Math.abs(client - value));
  const style = client > value ? { display: 'inline' } : { display: 'inline', color: 'red' };
  const msg = <div style={style}>{client > value ? `${dist} behind head` : <i>{`${dist} ahead`}</i>}</div>;
  return (
    <div>
      <ApiFilled className={cn} style={{ color: `${color}` }} />
      {Intl.NumberFormat().format(value)}
      <span className={styles.statusItem}>
        {word}
        <br />
      </span>
      <ApiFilled className={styles.itemIcon} style={{ color: 'white' }} />
      <div style={{ display: 'inline' }}>{msg}</div>
    </div>
  );
};
