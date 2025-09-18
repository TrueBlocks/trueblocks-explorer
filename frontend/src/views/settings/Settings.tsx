import { TabView } from '@layout';
import { SettingsApp, SettingsOrg, SettingsUser } from '@views';

export const Settings = () => {
  const tabs = [
    { label: 'Org', value: 'org', content: <SettingsOrg /> },
    { label: 'User', value: 'user', content: <SettingsUser /> },
    { label: 'App', value: 'app', content: <SettingsApp /> },
  ];

  return <TabView tabs={tabs} route="settings" />;
};
