import React from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { AssetHistory, Balance } from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../Routes';
import { useGlobalNames, useGlobalState } from '../../../../State';
import { chartColors } from '../../../../Utilities';
import { AccountViewParams } from '../../Dashboard';

export const Charts = ({ params }: { params: AccountViewParams }) => {
  const { uniqAssets } = params;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
      {uniqAssets.map((asset: AssetHistory, index: number) => {
        const color = asset.assetSymbol === 'ETH'
          ? '#63b598'
          : chartColors[Number(`0x${asset.assetAddr.substr(2, 6)}`) % chartColors.length];

        const columns: any[] = [
          addColumn({
            title: 'Date',
            dataIndex: 'date',
          }),
          addColumn({
            title: asset.assetAddr,
            dataIndex: asset.assetAddr,
          }),
        ];

        const items = asset.balHistory.map((item: Balance) => ({
          date: dayjs(item.date).format('YYYY-MM-DD'),
          [asset.assetAddr]: parseFloat(item.balance || '0'),
        }));

        return (
          <MyAreaChart
            items={items}
            columns={columns}
            key={asset.assetAddr}
            index={asset.assetAddr}
            title={<ChartTitle asset={asset} index={index} />}
            table={false}
            color={color}
          />
        );
      })}
    </div>
  );
};

const ChartTitle = ({ index, asset }: { asset: AssetHistory; index: number }) => {
  const { namesMap } = useGlobalNames();
  const { currentAddress } = useGlobalState();

  const links: any = [];
  links.push(<Link to={`${DashboardAccountsHistoryLocation}?asset=${asset.assetAddr}`}>History</Link>);
  if (!namesMap.get(asset.assetAddr)) {
    links.push(
      <a target='_blank' href={`http://localhost:8080/names?autoname=${asset.assetAddr}`} rel='noreferrer'>
        Name
      </a>,
    );
  }
  if (asset.assetSymbol !== 'ETH') {
    links.push(
      <a target='_blank' href={`https://etherscan.io/token/${asset.assetAddr}?a=${currentAddress}`} rel='noreferrer'>
        Holdings
      </a>,
    );
  }
  links.push(
    <a target='_blank' href={`https://etherscan.io/address/${asset.assetAddr}`} rel='noreferrer'>
      Token
    </a>,
  );
  links.push(
    <a target='_blank' href={`https://info.uniswap.org/#/tokens/${asset.assetAddr}`} rel='noreferrer'>
      Uniswap
    </a>,
  );

  return (
    <div key={`${index}d1`} style={{ overflowX: 'hidden' }}>
      {asset.assetSymbol === 'ETH'
        ? asset.assetSymbol
        : namesMap.get(asset.assetAddr)
          ? namesMap.get(asset.assetAddr)?.name?.substr(0, 15)
          + (asset.assetSymbol ? ` (${asset.assetSymbol.substr(0, 15)})` : '')
          : asset.assetSymbol.substr(0, 15)}
      <br />
      <small>
        (
        {asset.balHistory.length}
        {' '}
        txs)
        {' '}
        <small>
          {links.map((link: any, index: number) => (
            <div key={index} style={{ display: 'inline' }}>
              [
              {link}
              ]
              {' '}
            </div>
          ))}
        </small>
      </small>
    </div>
  );
};
