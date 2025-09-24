import React, { useEffect, useRef } from 'react';

import { useEnabledMenuItems } from '@hooks';
import { StatusBar } from '@layout';
import { AppShell } from '@mantine/core';
import { getDebugClass } from '@utils';
import { MenuItem } from 'src/Menu';
import { Route, useLocation } from 'wouter';

import './MainView.css';

function isComponentMenuItem(
  item: MenuItem,
): item is MenuItem & { component: React.ComponentType } {
  return !!item.component;
}

export const MainView = () => {
  const [currentLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { items: enabledMenuItems } = useEnabledMenuItems();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentLocation]);

  return (
    <AppShell.Main
      className={getDebugClass(7)}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        contain: 'layout style',
      }}
    >
      <div
        ref={scrollContainerRef}
        className={getDebugClass(8)}
        style={{
          width: '100%',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {enabledMenuItems.filter(isComponentMenuItem).map((item) => {
          return (
            <Route key={item.path} path={item.path}>
              {React.createElement(item.component)}
            </Route>
          );
        })}
      </div>

      <div
        className={getDebugClass(9)}
        style={{
          width: '100%',
        }}
      >
        <StatusBar />
      </div>
    </AppShell.Main>
  );
};
