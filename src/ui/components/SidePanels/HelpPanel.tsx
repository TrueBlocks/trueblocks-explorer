import { WarningTwoTone } from '@ant-design/icons';
import { Loading } from '@components/Loading';
import { useCommand } from '@hooks/useCommand';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation } from 'react-router-dom';
import {
  DashboardCollectionsLocation,
  DashboardOverviewLocation,
} from '../../locations';

const useStyles = createUseStyles({});

const helpRoutes = [
  {
    route: DashboardOverviewLocation,
    helpText: 'Example help text',
    helpLink: 'https://google.com',
  },
  {
    route: DashboardCollectionsLocation,
    helpText: 'Another help text',
    helpLink: 'https://github.com',
  },
];

export const HelpPanel = () => {
  const location = useLocation();
  const [help, loading] = useCommand('help');
  const styles = useStyles();

  const matchedRoute = helpRoutes.find(
    (item) => item.route === location.pathname
  );

  return (
    <Loading loading={loading}>
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
            <a href={matchedRoute.helpLink} target="_blank" rel="noreferrer">
              Learn more...
            </a>
          </div>
        )}
      </div>
      {/* <span>{JSON.stringify(help, null, 2)}</span> */}
    </Loading>
  );
};
