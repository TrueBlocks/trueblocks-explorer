import React from 'react';

import { BaseView } from '@components/BaseView';

import {
  SupportAboutUsLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation,
} from '../../Routes';
import { About } from './Tabs/About';
import { Contact } from './Tabs/Contact';
import { Documentation } from './Tabs/Documentation';
import { HotKeys } from './Tabs/HotKeys';
import { Licensing } from './Tabs/Licensing';

export const SupportView = () => {
  const tabs = [
    { name: 'Contact Us', location: SupportContactUsLocation, component: <Contact /> },
    { name: 'Documentation', location: SupportDocumentationLocation, component: <Documentation /> },
    { name: 'Hot Keys', location: SupportHotKeysLocation, component: <HotKeys /> },
    { name: 'Licensing', location: SupportLicensingLocation, component: <Licensing /> },
    { name: 'About Us', location: SupportAboutUsLocation, component: <About /> },
  ];

  return <BaseView title='Support' cookieName='COOKIE_SUPPORT' tabs={tabs} />;
};
