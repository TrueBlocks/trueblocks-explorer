import { BaseView } from '@components/BaseView';
import React from 'react';
import {
  NamesAddressesLocation,
  NamesBlocksLocation,
  NamesEventSigsLocation, NamesFuncSigsLocation, NamesLocation,
  NamesTagsLocation
} from '../../locations';
import { cookieVars } from '../../utils';
import { Addresses } from './Tabs/Addresses';
import { EventSignatures } from './Tabs/EventSignatures';
import { FunctionSignatures } from './Tabs/FunctionSignatures';
import { Tags } from './Tabs/Tag';
import { When } from './Tabs/When';

export const NamesView = () => {
  const title = 'Names';
  const tabs = [
    {name: "Named Addresses", location: NamesAddressesLocation, component: <Addresses />},
    {name: "Address Tags", location: NamesTagsLocation, component: <Tags />},
    {name: "Function Signatures", location: NamesFuncSigsLocation, component: <FunctionSignatures />},
    {name: "Event Signatures", location: NamesEventSigsLocation, component: <EventSignatures />},
    {name: "Named Blocks", location: NamesBlocksLocation, component: <When />},
  ];
  return (
    <BaseView
      title={title}
      defaultActive={NamesAddressesLocation}
      baseActive={NamesLocation}
      cookieName={cookieVars.names_current_tab}
      tabs={tabs}
    />
  );
};
