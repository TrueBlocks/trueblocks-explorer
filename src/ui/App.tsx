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
import {
  getNames, getStatus, Name, SuccessResponse,
} from '@sdk';
import { Layout, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Console } from '@components/Console';
import { MainMenu, MenuItems } from '@components/MainMenu';
import { HelpPanel } from '@components/SidePanels/HelpPanel';
import { PanelDirection, SidePanel } from '@components/SidePanels/SidePanel';
import { StatusPanel } from '@components/SidePanels/StatusPanel';
import { useSdk } from '@hooks/useSdk';
import {
  CallError,
  CallSuccess, isFailedCall, isSuccessfulCall, wrapResponse,
} from '@modules/api/call_status';
import { createEmptyMeta, createEmptyStatus, FixedStatus } from '@modules/type_fixes';

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
  const [status, setStatus] = useState<Pick<SuccessResponse<FixedStatus>, 'data' | 'meta'>>({
    data: createEmptyStatus(),
    meta: createEmptyMeta(),
  });
  const [statusError, setStatusError] = useState(false);
  const [loadingStatus] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    const fetchStatus = async () => {
      // FIXME: typecase
      const statusResponse = wrapResponse(await getStatus({})) as CallSuccess<FixedStatus> | CallError;

      if (isSuccessfulCall(statusResponse)) {
        setStatus(statusResponse);
      }

      if (isFailedCall(statusResponse)) {
        setStatusError(true);
      }
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, 10 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const namesRequest = useSdk(() => getNames({ terms: [''], expand: true, all: true }));

  useEffect(() => {
    const resultMap = (() => {
      if (!isSuccessfulCall(namesRequest)) return new Map();

      const { data: fetchedNames } = namesRequest;

      if (typeof fetchedNames === 'string') return new Map();

      return new Map((fetchedNames as Name[]).map((name) => [name.address, name]));
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
              <StatusPanel status={status} loading={loadingStatus} error={statusError} />
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
            <Console />
            <div />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
