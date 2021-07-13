import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { ReactNode, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const { TabPane } = Tabs;

export type ViewTab = {
  name: string;
  location: string;
  component: ReactNode;
  disabled?: boolean;
};

declare type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export interface ViewParams {
  title?: string;
  defaultActive: string;
  baseActive: string;
  cookieName: string;
  tabs: ViewTab[];
  position?: TabsPosition;
  subBase?: boolean;
}

export const BaseView = ({
  title = '',
  defaultActive,
  baseActive,
  cookieName,
  tabs,
  position = 'top',
  subBase,
}: ViewParams) => {
  const location = useLocation();
  const parts = location.pathname.split('/');
  const subPath = location.pathname.replace(baseActive, '');
  const [currentTab, setCurrentTab] = useState(
    (subPath && subPath.length > 0
      ? parts.length > 3
        ? !subBase
          ? parts.length === 4
            ? location.pathname.replace(`/${parts[parts.length - 1]}`, '')
            : parts.length === 5
            ? location.pathname.replace(`/${parts[parts.length - 1]}`, '').replace(`/${parts[parts.length - 2]}`, '')
            : location.pathname
          : location.pathname
        : location.pathname
      : null) ||
      Cookies.get(cookieName) ||
      defaultActive
  );

  const history = useHistory();
  const onTabChange = (key: string) => {
    // console.log(count, 'set: ', cookieName, key);
    Cookies.set(cookieName, key);
    history.push(key);
    setCurrentTab(key);
  };

  // console.log(count, 'ba: ', baseActive);
  // console.log(count, 'da: ', defaultActive);
  // console.log(count, 'tabs: ', tabs);
  // console.log(count, 'cook: ', Cookies.get(cookieName));
  // console.log(count, 'eq: ', defaultActive == tabs[0].location);
  // console.log(count, 'cn: ', cookieName);
  // console.log(count, 'lo: ', location);
  // console.log(count, 'pa: ', parts);
  // console.log(count, 'su: ', subPath);
  // console.log(count++, 'ct: ', currentTab);

  const titleComponent = title.length === 0 ? <></> : <PageHeader style={{ padding: '0px' }} title={title} />;
  return (
    <>
      {titleComponent}
      <Tabs tabPosition={position} defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        {tabs.map((tab) => (
          <TabPane tab={tab.name} key={tab.location} disabled={tab.disabled}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};
