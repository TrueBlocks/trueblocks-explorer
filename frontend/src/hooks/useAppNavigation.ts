import { useEffect, useRef } from 'react';

import { useLocation } from 'wouter';

import { useActiveProject } from './useActiveProject';
import { useAppReadiness } from './useAppReadiness';

export const useAppNavigation = () => {
  const [location, navigate] = useLocation();
  const ready = useAppReadiness();
  const hasRedirected = useRef(false);
  const { lastView, setLastView, loading } = useActiveProject();

  const isWizard = location.startsWith('/wizard');

  // Handle initial redirect to lastView
  useEffect(() => {
    if (ready && !loading && location === '/' && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate(lastView);
    }
  }, [ready, loading, location, lastView, navigate]);

  // Sync location changes to the preferences store
  useEffect(() => {
    if (ready && !loading && location !== '/') {
      setLastView(location);
    }
  }, [location, ready, loading, setLastView]);

  return {
    location,
    navigate,
    ready,
    isWizard,
  };
};
