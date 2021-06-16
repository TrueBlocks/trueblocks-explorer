import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  SupportAboutUsLocation,
  SupportContactUsLocation,
  SupportDocumentationLocation,
  SupportHotKeysLocation,
  SupportLicensingLocation, SupportLocation
} from '../..//locations';
import { cookieVars } from '../../utils';
import { About } from './Tabs/About';
import { Contact } from './Tabs/Contact';
import { Documentation } from './Tabs/Documentation';
import { HotKeys } from './Tabs/HotKeys';
import { Licensing } from './Tabs/Licensing';

export const SupportView = () => {
  const title = 'Support';
  const tabs = [
    {name: "Contact Us", location: SupportContactUsLocation, component: <Contact />},
    {name: "Documentation", location: SupportDocumentationLocation, component: <Documentation />},
    {name: "Hot Keys", location: SupportHotKeysLocation, component: <HotKeys />},
    {name: "Licensing", location: SupportLicensingLocation, component: <Licensing />},
    {name: "About Us", location: SupportAboutUsLocation, component: <About />},
  ];
  return (
    <BaseView
      title={title}
      defaultActive={SupportContactUsLocation}
      baseActive={SupportLocation}
      cookieName={cookieVars.support_current_tab}
      tabs={tabs}
    />
  );
};
