// import { PageHeader, Tabs } from 'antd';
// import Cookies from 'js-cookie';
// import React, { ReactNode, useState } from 'react';
// import { useHistory, useLocation } from 'react-router-dom';

// const { TabPane } = Tabs;

// export type ViewTab = {
//   name: string;
//   location: string;
//   component: ReactNode;
//   disabled?: boolean;
// };

// declare type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
// export interface ViewParams {
//   title?: string;
//   defaultActive: string;
//   baseActive: string;
//   cookieName: string;
//   tabs: ViewTab[];
//   extraContent?: any;
//   position?: TabsPosition;
//   subBase?: boolean;
// }

// // let count = 1;
// export const BaseView_old = ({
//   title = '',
//   defaultActive,
//   baseActive,
//   cookieName,
//   tabs,
//   extraContent,
//   position = 'top',
//   subBase,
// }: ViewParams) => {
//   const location = useLocation();
//   const parts = location.pathname.split('/');
//   const subPath = location.pathname.replace(baseActive, '');
//   const [currentTab, setCurrentTab] = useState(
//     (subPath && subPath.length > 0
//       ? parts.length > 3
//         ? !subBase
//           ? parts.length === 4
//             ? location.pathname.replace(`/${parts[parts.length - 1]}`, '')
//             : parts.length === 5
//             ? location.pathname.replace(`/${parts[parts.length - 1]}`, '').replace(`/${parts[parts.length - 2]}`, '')
//             : location.pathname
//           : location.pathname
//         : location.pathname
//       : null) ||
//       Cookies.get(cookieName) ||
//       defaultActive
//   );

//   const history = useHistory();
//   const onTabChange = (key: string) => {
//     Cookies.set(cookieName, key);
//     history.push(key);
//     setCurrentTab(key);
//   };

//   const titleComponent = title.length === 0 ? <></> : <PageHeader style={{ padding: '0px' }} title={title} />;
//   return (
//     <>
//       {titleComponent}
//       <Tabs
//         tabBarExtraContent={extraContent}
//         tabPosition={position}
//         defaultActiveKey={currentTab}
//         onChange={(key) => onTabChange(key)}>
//         {tabs.map((tab) => (
//           <TabPane tab={tab.name} key={tab.location} disabled={tab.disabled}>
//             {tab.component}
//           </TabPane>
//         ))}
//       </Tabs>
//     </>
//   );
// };
