import {
  ApiFilled,
  ClockCircleFilled,
  ExperimentFilled,
  EyeFilled,
} from '@ant-design/icons';
import { Loading } from '@components/Loading';
import { Result } from '@hooks/useCommand';
import { JsonResponse } from '@modules/core';
import { Badge } from 'antd';
import filesize from 'filesize';
import React from 'react';
import { createUseStyles } from 'react-jss';

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
  status: Result;
  loading: boolean;
}

export const StatusPanel = ({ status, loading }: StatusPanelProps) => {
  const styles = useStyles();

  const statusData = status.data[0] as JsonResponse;
  const statusMeta = status.meta as JsonResponse;

  return (
    <Loading loading={loading}>
      <div className={styles.container}>

        <div className={styles.header}>ETHEREUM NODE</div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>STATUS</div>
          <div>
            <Badge status={status.status === 'success' ? 'success' : 'error'} />
            {status.status === 'success' ? 'Connected' : 'Error'}
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
            <Badge status={statusData.is_api ? 'success' : 'error'} />
            {statusData.is_api ? 'Connected' : 'Not connected'}
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SCRAPER</div>
          <div>
            <Badge status={statusData.is_scraping ? 'success' : 'error'} />
            {statusData.is_scraping ? 'Scraping' : 'Not scraping'}
          </div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BLOCKS</div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: '#52c41a' }}
            />
            {Intl.NumberFormat().format(statusMeta.finalized)}
            <span className={styles.statusItem}>FINAL</span>
          </div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: '#fadb14' }}
            />
            {Intl.NumberFormat().format(statusMeta.staging)}
            <span className={styles.statusItem}>STAGING</span>
          </div>
          <div>
            <ApiFilled
              className={styles.itemIcon}
              style={{ color: '#f5222d' }}
            />
            {Intl.NumberFormat().format(statusMeta.unripe)}
            <span className={styles.statusItem}>UNRIPE</span>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>MONITORS</div>
          <div>
            <EyeFilled className={styles.itemIcon} />
            {statusData.caches && statusData.caches[1].nFiles}
            {' '}
            (
            {statusData.caches && filesize(statusData.caches[1].sizeInBytes)}
            )
          </div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>SLURPS</div>
          <div>
            <ExperimentFilled className={styles.itemIcon} />
            {statusData.caches && statusData.caches[3].nFiles}
            {' '}
            (
            {statusData.caches && filesize(statusData.caches[3].sizeInBytes)}
            )
          </div>
        </div>

        <div className={styles.header} style={{ marginTop: '24px' }}>
          OPTIONS
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>RPC</div>
          <div>{statusData.rpc_provider}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>BALANCE PROVIDER</div>
          <div>{statusData.balance_provider}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>API</div>
          <div>{process.env.CORE_URL}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CACHE</div>
          <div>{statusData.cache_path}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>INDEX</div>
          <div>{statusData.index_path}</div>
        </div>

        <div className={styles.header} style={{ marginTop: '24px' }}>
          VERSIONS
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>CLIENT</div>
          <div>{statusData.client_version}</div>
        </div>

        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>TRUEBLOCKS</div>
          <div>{statusData.trueblocks_version}</div>
        </div>
      </div>
    </Loading>
  );
};
