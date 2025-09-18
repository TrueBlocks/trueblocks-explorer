import { useEffect, useState } from 'react';

import { IsReady } from '@app';

export const useAppReadiness = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      let attempts = 0;
      const maxAttempts = 200;
      while (attempts < maxAttempts) {
        const isReady = await IsReady();
        if (isReady) {
          setReady(true);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
        attempts++;
      }
    };
    initializeApp();
  }, []);

  return ready;
};
