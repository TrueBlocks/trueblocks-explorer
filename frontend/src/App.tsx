import { useEffect, useState } from 'react';

import {
  NodeStatus,
  ProjectSelectionModal,
  SplashScreen,
  getBarSize,
} from '@components';
import {
  ViewContextProvider,
  WalletConnectProvider,
  useViewContext,
} from '@contexts';
import {
  initializeAllViewConfigs,
  useActiveProject,
  useAppHealth,
  useAppHotkeys,
  useAppNavigation,
  useEvent,
  usePreferences,
} from '@hooks';
import { Footer, Header, HelpBar, MainView, MenuBar } from '@layout';
import { AppShell } from '@mantine/core';
import { msgs, project, types } from '@models';
import { LogError, initializePreferencesDefaults } from '@utils';
import { WalletConnectModalSign } from '@walletconnect/modal-sign-react';
import { Router, useLocation } from 'wouter';

import './debug-layout.css';
import { useGlobalEscape } from './hooks/useGlobalEscape';

// Add at the top level, outside the component
function globalNavKeySquelcher(e: KeyboardEvent) {
  const navKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'PageUp',
    'PageDown',
    'Home',
    'End',
  ];

  const activeElement = document.activeElement as HTMLElement;
  const isFormElement =
    activeElement &&
    (activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.tagName === 'SELECT' ||
      activeElement.isContentEditable);

  if (navKeys.includes(e.key) && !isFormElement) {
    // Only squelch if not handled by a focused form control
    e.preventDefault();
  }
}

// NavigationHandler component that listens for navigation events
// Must be inside ViewContextProvider to access setPendingNavigation
const NavigationHandler = () => {
  const { setPendingNavigation } = useViewContext();
  const {
    setViewAndFacet,
    activeAddress,
    activeChain,
    activePeriod,
    setActiveAddress,
    setActiveChain,
    setActivePeriod,
  } = useActiveProject();
  const [, navigate] = useLocation();

  // Listen for navigation events from backend
  useEvent(
    msgs.EventType.NAVIGATE_TO_ROW,
    async (message: string, payload?: unknown) => {
      // Parse the payload as NavigationPayload
      const navigationPayload = payload as types.NavigationPayload;

      // Check if context needs to change (only update if different)
      const contextChanges: Promise<void>[] = [];

      if (
        navigationPayload.address &&
        navigationPayload.address !== activeAddress
      ) {
        contextChanges.push(setActiveAddress(navigationPayload.address));
      }

      if (navigationPayload.chain && navigationPayload.chain !== activeChain) {
        contextChanges.push(setActiveChain(navigationPayload.chain));
      }

      if (
        navigationPayload.period &&
        navigationPayload.period !== activePeriod
      ) {
        contextChanges.push(setActivePeriod(navigationPayload.period));
      }

      // Wait for all context changes to complete before proceeding
      if (contextChanges.length > 0) {
        await Promise.all(contextChanges);
      }

      // Create ViewStateKey from the navigation payload
      const targetViewStateKey: project.ViewStateKey = {
        viewName: navigationPayload.collection,
        facetName: navigationPayload.dataFacet,
      };

      // Store navigation intent in ViewState
      setPendingNavigation(targetViewStateKey, navigationPayload);

      // Set the target facet state BEFORE navigation (await completion)
      await setViewAndFacet(
        navigationPayload.collection,
        navigationPayload.dataFacet,
      );

      // Then navigate to trigger the view change
      const targetRoute = `/${navigationPayload.collection}`;
      navigate(targetRoute);
    },
  );

  return null; // This component only handles events, no UI
};

export const App = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [viewConfigsLoading, setViewConfigsLoading] = useState(true);
  const [splashDelayComplete, setSplashDelayComplete] = useState(false);
  const { hasActiveProject } = useActiveProject();

  useEffect(() => {
    // Initialize view configurations at app startup
    initializeAllViewConfigs()
      .then(({ isLoading }) => {
        setViewConfigsLoading(isLoading);
      })
      .catch((error: unknown) => {
        LogError('Failed to initialize view configurations: ' + String(error));
        setViewConfigsLoading(false);
      });

    // Initialize preferences defaults cache on app startup
    initializePreferencesDefaults().catch((error: unknown) => {
      LogError('Failed to initialize preferences defaults: ' + String(error));
    });

    // Set minimum splash screen display time
    const splashTimer = setTimeout(() => {
      setSplashDelayComplete(true);
    }, 750);

    window.addEventListener('keydown', globalNavKeySquelcher, {
      capture: true,
    });
    return () => {
      clearTimeout(splashTimer);
      window.removeEventListener('keydown', globalNavKeySquelcher, {
        capture: true,
      });
    };
  }, []);

  // Show project modal only if we don't have a valid project AND it's not a user-requested modal
  useEffect(() => {
    if (!hasActiveProject && !showProjectModal) {
      setShowProjectModal(true);
    }
  }, [hasActiveProject, showProjectModal]);

  // Listen for project modal events
  useEvent(msgs.EventType.PROJECT_MODAL, (message: string) => {
    if (message === 'show_project_modal') {
      setShowProjectModal(true);
    }
  });

  useEvent(msgs.EventType.PROJECT_OPENED, () => {
    setShowProjectModal(false);
  });

  const { ready, isWizard } = useAppNavigation();
  const { menuCollapsed, helpCollapsed, chromeCollapsed } = usePreferences();

  useAppHotkeys();
  useAppHealth();
  useGlobalEscape();

  const handleProjectModalClose = () => {
    setShowProjectModal(false);
  };

  const handleProjectModalCancel = () => {
    setShowProjectModal(false);
  };

  if (!ready || viewConfigsLoading || !splashDelayComplete)
    return <SplashScreen />;

  const header = { height: getBarSize('header', chromeCollapsed) };
  const footer = { height: getBarSize('footer', chromeCollapsed) };
  const navbar = {
    width: getBarSize('menu', menuCollapsed),
    breakpoint: 'sm',
    collapsed: { mobile: !menuCollapsed },
  };
  const aside = {
    width: getBarSize('help', helpCollapsed),
    breakpoint: 'sm',
    collapsed: { mobile: !helpCollapsed },
  };

  return (
    <Router>
      <WalletConnectProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          <AppShell
            layout="default"
            header={header}
            footer={footer}
            navbar={navbar}
            aside={aside}
          >
            <Header />
            <MenuBar disabled={isWizard} />
            <ViewContextProvider>
              <NavigationHandler />
              <MainView />
            </ViewContextProvider>
            <HelpBar />
            <div
              style={{
                position: 'absolute',
                top: `${getBarSize('header', chromeCollapsed) + 2}px`,
                right: `${getBarSize('help', helpCollapsed) + 2}px`,
                zIndex: 1000,
              }}
            >
              <NodeStatus />
            </div>
            <Footer />
          </AppShell>
          <WalletConnectModalSign
            projectId={
              (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string) ||
              (() => {
                LogError(
                  'VITE_WALLETCONNECT_PROJECT_ID not set in environment variables',
                );
                return 'MISSING_PROJECT_ID';
              })()
            }
            metadata={{
              name: 'TrueBlocks Explorer',
              description:
                'A TrueBlocks desktop application for naming addresses',
              url: 'https://trueblocks.io',
              icons: ['https://trueblocks.io/favicon.ico'],
            }}
          />
          <ProjectSelectionModal
            opened={showProjectModal}
            onProjectSelected={handleProjectModalClose}
            onCancel={hasActiveProject ? handleProjectModalCancel : undefined}
          />
        </div>
      </WalletConnectProvider>
    </Router>
  );
};
