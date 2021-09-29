import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import {
  BookOutlined,
  CameraOutlined,
  PhoneOutlined,
  QuestionCircleFilled,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { Console } from '@components/Console';
import { MainMenu, MenuItems } from '@components/MainMenu';
import { HelpPanel } from '@components/SidePanels/HelpPanel';
import { PanelDirection, SidePanel } from '@components/SidePanels/SidePanel';
import { StatusPanel } from '@components/SidePanels/StatusPanel';
import {
  Result, toFailedResult, toSuccessfulData, useCommand,
} from '@hooks/useCommand';
import { runCommand } from '@modules/core';
import { Accountname } from '@modules/types';

import {
  ExplorerLocation, NamesLocation, RootLocation, Routes, SettingsLocation, SupportLocation,
} from './Routes';
import { useGlobalNames } from './State';

import 'antd/dist/antd.css';
import './app.css';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const useStyles = createUseStyles({
  help_icon: { color: 'green' },
});

export const App = () => {
  dayjs.extend(relativeTime);

  const { setNamesMap, setNamesArray } = useGlobalNames();
  const [status, setStatus] = useState<Result>(toSuccessfulData({ data: [{}], meta: {} }) as Result);
  const [loadingStatus] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    const fetchStatus = async () => {
      const eitherResponse = await runCommand('status');
      const result: Result = pipe(
        eitherResponse,
        Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result),
      );
      setStatus(result);
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, 10 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const [namesRequest] = useCommand('names', { expand: '', all: '' });

  useEffect(() => {
    const resultMap = (() => {
      const { data: fetchedNames } = namesRequest;

      if (typeof fetchedNames === 'string') return new Map();

      return new Map((fetchedNames as Accountname[]).map((name: Accountname) => [name.address, name]));
    })();

    setNamesMap(resultMap);
    setNamesArray([...resultMap.values()]);
  }, [namesRequest, setNamesMap, setNamesArray]);

  const menuItems: MenuItems = [
    {
      text: 'Dashboard',
      icon: <UnorderedListOutlined />,
      to: RootLocation,
    },
    {
      text: 'Names',
      icon: <BookOutlined />,
      to: NamesLocation,
    },
    {
      text: 'Explorer',
      icon: <CameraOutlined />,
      to: ExplorerLocation,
    },
    {
      text: 'Settings',
      icon: <SettingOutlined />,
      to: SettingsLocation,
    },
    {
      text: 'Support',
      icon: <PhoneOutlined />,
      to: SupportLocation,
    },
  ];

  return (
    <Layout>
      <Header className='app-header'>
        <Title style={{ color: 'white' }} level={2}>
          TrueBlocks Account Explorer
        </Title>
      </Header>
      <Layout>
        <SidePanel header='Menu' dir={PanelDirection.Left} cookieName='MENU_EXPANDED' collapsibleContent={false}>
          <MainMenu items={menuItems} />
        </SidePanel>
        <Layout>
          <Layout>
            <Content
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                overflowY: 'scroll',
              }}
            >
              <Routes />
            </Content>
            <SidePanel header='Status' cookieName='STATUS_EXPANDED' dir={PanelDirection.Right}>
              <StatusPanel status={status} loading={loadingStatus} />
            </SidePanel>
            <SidePanel
              header='Help'
              cookieName='HELP_EXPANDED'
              dir={PanelDirection.Right}
              customCollapseIcon={<QuestionCircleFilled className={styles.help_icon} />}
              customExpandIcon={<QuestionCircleFilled className={styles.help_icon} />}
            >
              <HelpPanel />
            </SidePanel>
          </Layout>
          <Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div />
            <Console asText />
            <div />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
