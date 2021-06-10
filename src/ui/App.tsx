import { QuestionCircleFilled } from '@ant-design/icons';
import { Result, toFailedResult, toSuccessfulData } from '@hooks/useCommand';
import { runCommand } from '@modules/core';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { pipe } from 'fp-ts/lib/function';
import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import './app.css';
import { MainMenu } from './components/MainMenu';
import { HelpPanel } from './components/SidePanels/HelpPanel';
import { PanelDirection, SidePanel } from './components/SidePanels/SidePanel';
import { StatusPanel } from './components/SidePanels/StatusPanel';
import { Routes } from './Routes';
import { either as Either } from 'fp-ts';
import { cookieVars } from './utils';

const { Header, Footer, Content } = Layout;

const useStyles = createUseStyles({
  help_icon: { color: 'green' },
});

export const App = () => {
  const [status, setStatus] = useState<Result>(toSuccessfulData({ data: [{}], meta: {} }) as Result);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    (async () => {
      setLoadingStatus(true);
      const eitherResponse = await runCommand('status');
      const result: Result = pipe(
        eitherResponse,
        Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
      );
      setLoadingStatus(false);
      setStatus(result);
      setInterval(async () => {
        setLoadingStatus(true);
        const eitherResponse = await runCommand('status');
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        setLoadingStatus(false);
        setStatus(result);
      }, 10 * 1000);
    })();
  }, []);

  return (
    <Layout>
      <Header className='app-header'>TrueBlocks Account Explorer</Header>
      <Layout>
        <SidePanel
          header='Main menu'
          dir={PanelDirection.Left}
          name={cookieVars.menu_expanded}
          collapsibleContent={false}>
          <MainMenu />
        </SidePanel>
        <Layout>
          <Layout>
            <Content
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                overflowY: 'auto',
              }}>
              <Routes />
            </Content>
            <SidePanel header='Status' name={cookieVars.status_expanded} dir={PanelDirection.Right}>
              <StatusPanel status={status} loading={loadingStatus} />
            </SidePanel>
            <SidePanel
              header='Help'
              name={cookieVars.help_expanded}
              dir={PanelDirection.Right}
              customCollapseIcon={<QuestionCircleFilled className={styles.help_icon} />}
              customExpandIcon={<QuestionCircleFilled className={styles.help_icon} />}>
              <HelpPanel />
            </SidePanel>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
