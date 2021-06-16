import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { ReactNode, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const { TabPane } = Tabs;

export type ViewTab = {
  name: string,
  location: string,
  component: ReactNode,
  disabled?: boolean,
};

declare type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
interface ViewParams {
  title: string,
  defaultActive: string,
  baseActive: string,
  cookieName: string,
  tabs: ViewTab[];
  position?: TabsPosition
}

export const BaseView = ({title, cookieName, defaultActive, baseActive, tabs, position = 'top'}: ViewParams) => {
  const history = useHistory();
  const location = useLocation();
  const subPath = location.pathname.replace(baseActive, '');
  const [currentTab, setCurrentTab] = useState(
    (subPath && subPath.length > 0 ? location.pathname : null) ||
      Cookies.get(cookieName) ||
      defaultActive
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieName, key);
    history.push(key);
    setCurrentTab(key);
  };

  const titleComponent = (title.length === 0 ? <></> : <PageHeader title={title} />);
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
}
