import { QuestionCircleFilled } from '@ant-design/icons';
import { useCommand } from '@hooks/useCommand';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { createUseStyles } from 'react-jss';
import './app.css';
import { MainMenu } from './components/MainMenu';
import { HelpPanel } from './components/SidePanels/HelpPanel';
import { PanelDirection, SidePanel } from './components/SidePanels/SidePanel';
import { StatusPanel } from './components/SidePanels/StatusPanel';
import { Routes } from './Routes';
import { cookieVars } from './utils';

const { Header, Footer, Content } = Layout;

const useStyles = createUseStyles({
  help_icon: { color: 'green' },
});

export const App = () => {
  const [status, loading] = useCommand('status');
  const styles = useStyles();

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
              <StatusPanel status={status} loading={loading} />
            </SidePanel>
            <SidePanel
              header='Help'
              name={cookieVars.help_expanded}
              dir={PanelDirection.Right}
              customCollapseIcon={<QuestionCircleFilled className={styles.help_icon}/>}
              customExpandIcon={<QuestionCircleFilled className={styles.help_icon}/>}
            >
              <HelpPanel />
            </SidePanel>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
