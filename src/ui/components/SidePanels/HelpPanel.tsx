import React from 'react';
import { useLocation } from 'react-router-dom';

import { Loading } from '@components/Loading';

import { routes } from '../../Routes';

export const HelpPanel = () => {
  const location = useLocation();
  const matchedRoute = routes.find((item: any) => location.pathname.endsWith(item.path));
  const url = matchedRoute && new URL(`docs/explorer${matchedRoute.path}`, 'https://docs.trueblocks.io/');

  return (
    <Loading loading={false}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          alignItems: 'center',
          letterSpacing: '0.1em',
        }}
      >
        {matchedRoute && (
          <div>
            <div>{matchedRoute.helpText}</div>
            <a href={url?.toString()} target='_blank' rel='noreferrer'>
              Learn more...
            </a>
          </div>
        )}
      </div>
    </Loading>
  );
};
