import { PageHeader, Tabs } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
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
  tabs: ViewTab[];
  extraContent?: any;
  cookieName: string;
  title?: string;
  position?: TabsPosition;
}

export const BaseView = ({ cookieName, tabs, extraContent, title = '', position = 'top' }: ViewParams) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [lastVisited, setLastVisited] = useState(localStorage.getItem(cookieName) || tabs[0].location);

  const onTabChange = (key: string) => {
    localStorage.setItem(cookieName, key);
    history.push(key);
  };

  // needed for <Link> to work
  useEffect(() => {
    if (!tabs.find((tab) => tab.location === pathname)) return;

    setLastVisited(pathname);
    onTabChange(pathname);
  }, [pathname]);

  const titleComponent = title.length === 0 ? <></> : <PageHeader style={{ padding: '0px' }} title={title} />;
  return (
    <>
      {titleComponent}
      <Tabs
        tabBarExtraContent={extraContent}
        tabPosition={position}
        defaultActiveKey={lastVisited}
        activeKey={lastVisited}
        onChange={(key) => onTabChange(key)}>
        {tabs.map((tab) => (
          <TabPane tab={tab.name} key={tab.location} disabled={tab.disabled}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
};
