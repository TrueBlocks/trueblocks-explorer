import { PageHeader, Tabs } from 'antd';
import React from 'react';

import { Status } from './Status';
import { Tags } from './Tags';
import { Signatures } from './Signatures';
import { Caches } from './Caches';
import { Other } from './Other';
import { Skins } from './Skins';
import { Schemas } from './Schemas';

const { TabPane } = Tabs;

export const SystemView = () => {
  const title = 'System';
  return (
    <>
      <PageHeader title={title} />
      <Tabs>
        <TabPane tab="System Status" key="status">
          <Status />
        </TabPane>
        <TabPane tab="Tags" key="tags">
          <Tags />
        </TabPane>
        <TabPane tab="Signatures" key="signatures">
          <Signatures />
        </TabPane>
        <TabPane tab="Caches" key="caches">
          <Caches />
        </TabPane>
        <TabPane tab="Other" key="other">
          <Other />
        </TabPane>
        <TabPane tab="Skins" key="skins">
          <Skins />
        </TabPane>
        <TabPane tab="Schemas" key="schemas">
          <Schemas />
        </TabPane>
      </Tabs>
    </>
  );
};
