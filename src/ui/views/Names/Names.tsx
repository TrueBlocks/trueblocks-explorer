import { PageHeader, Tabs } from 'antd';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  NamesAdressesLocation,
  NamesBlocksLocation,
  NamesMonitorsLocation,
  NamesSignaturesLocation,
  NamesTagsLocation,
} from '../..//locations';
import { cookieVars } from '../../utils';
import { Monitors } from './Tabs/Monitors';
import { NamedAddrs } from './Tabs/NamedAddrs';
import { Signatures } from './Tabs/Signature';
import { Tags } from './Tabs/Tag';
import { When } from './Tabs/When';

const { TabPane } = Tabs;

export const NamesView = () => {
  const history = useHistory();
  const title = 'Names';
  const [currentTab, setCurrentTab] = useState(
    Cookies.get(cookieVars.names_current_tab) || NamesMonitorsLocation
  );

  const onTabChange = (key: string) => {
    Cookies.set(cookieVars.names_current_tab, key);
    history.push(key);
    setCurrentTab(key);
  };

  return (
    <>
      <PageHeader title={title} />
      <Tabs defaultActiveKey={currentTab} onChange={(key) => onTabChange(key)}>
        <TabPane tab="Monitors" key={NamesMonitorsLocation}>
          <Monitors />
        </TabPane>
        <TabPane tab="Addresses" key={NamesAdressesLocation}>
          <NamedAddrs />
        </TabPane>
        <TabPane tab="Tags" key={NamesTagsLocation}>
          <Tags />
        </TabPane>
        <TabPane tab="Signatures" key={NamesSignaturesLocation}>
          <Signatures />
        </TabPane>
        <TabPane tab="Blocks" key={NamesBlocksLocation}>
          <When />
        </TabPane>
      </Tabs>
    </>
  );
};
