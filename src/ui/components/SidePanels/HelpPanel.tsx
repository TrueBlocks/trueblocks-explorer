import { Loading } from '@components/Loading';
import { useCommand } from '@hooks/useCommand';
import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import { useLocation } from 'react-router-dom';
import { DashboardCollectionsLocation, DashboardOverviewLocation } from '../../locations';

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
  const [help] = useCommand('status', { ui_help: `${location.pathname}`});
  const getData = useCallback((response) => (response.status === 'fail' ? [] : response.data[0]), []);
  const theHelp = getData(help);

  const matchedRoute = theHelp; //helpRoutes.find((item) => item.route === location.pathname);

  return (
    <Loading loading={false}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          alignItems: 'center',
          letterSpacing: '0.1em',
        }}>
        {matchedRoute && (
          <div>
            <div>{matchedRoute.helpText}</div>
            <a href={matchedRoute.helpLink} target='_blank' rel='noreferrer'>
              more...
            </a>
          </div>
        )}
      </div>
    </Loading>
  );
};
