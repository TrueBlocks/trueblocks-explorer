import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  SupportAboutUsLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation,
} from '../..//locations';
import { cookieVars } from '../../utils';
import { About } from './Tabs/About';
import { Contact } from './Tabs/Contact';
import { Documentation } from './Tabs/Documentation';
import { HotKeys } from './Tabs/HotKeys';
import { Licensing } from './Tabs/Licensing';

const { TabPane } = Tabs;

export const SupportView = () => {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(
    Cookies.get(cookieVars.support_current_tab) || SupportContactUsLocation
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.support_current_tab, key);
    history.push(key);
    setCurrentTab(key);
  };

  const title = 'Support';
  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Contact Us" key={SupportContactUsLocation}>
          <Contact />
        </TabPane>
        <TabPane tab="Documentation" key={SupportDocumentationLocation}>
          <Documentation />
        </TabPane>
        <TabPane tab="Hot Keys" key={SupportHotKeysLocation}>
          <HotKeys />
        </TabPane>
        <TabPane tab="Licensing" key={SupportLicensingLocation}>
          <Licensing />
        </TabPane>
        <TabPane tab="About Us" key={SupportAboutUsLocation}>
          <About />
        </TabPane>
      </Tabs>
    </>
  );
};
