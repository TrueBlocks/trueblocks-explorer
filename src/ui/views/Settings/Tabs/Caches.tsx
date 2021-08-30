import React from 'react';

import { useGlobalState } from '../../../State';

export const Caches = () => {
  const { theme } = useGlobalState();

  return <h4 style={{ color: theme ? theme.primaryColor : '#000' }}>Caches</h4>;
};
