import { useEffect, useState } from 'react';

interface StaggeredLoadingConfig {
  delays: number[];
  enabled?: boolean;
}

export const useStaggeredLoading = (
  config: StaggeredLoadingConfig = { delays: [0, 100, 200] },
) => {
  const [loadedStages, setLoadedStages] = useState<boolean[]>(
    new Array(config.delays.length).fill(false),
  );

  useEffect(() => {
    if (!config.enabled) {
      // If staggered loading is disabled, load everything immediately
      setLoadedStages(new Array(config.delays.length).fill(true));
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    config.delays.forEach((delay, index) => {
      const timeout = setTimeout(() => {
        setLoadedStages((prev) => {
          const newStages = [...prev];
          newStages[index] = true;
          return newStages;
        });
      }, delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [config.delays, config.enabled]);

  return {
    isStageLoaded: (stage: number) => loadedStages[stage] || false,
    allLoaded: loadedStages.every((loaded) => loaded),
    loadedCount: loadedStages.filter(Boolean).length,
  };
};
