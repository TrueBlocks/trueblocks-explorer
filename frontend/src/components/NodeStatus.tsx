import { useEffect, useRef, useState } from 'react';

import { GetNodeStatus } from '@app';
import { useActiveProject } from '@hooks';
import { types } from '@models';
import { useLocation } from 'wouter';

export const NodeStatus = () => {
  const [status, setStatus] = useState('Loading...');
  const spinnerIndexRef = useRef(0);
  const [location, navigate] = useLocation();
  const previousView = useRef<string | null>(null);
  const { activeChain } = useActiveProject();
  const prevStatusRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;
    const spinnerFrames = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    const run = async () => {
      try {
        const meta = (await GetNodeStatus(
          activeChain,
        )) as unknown as types.MetaData | null;
        if (cancelled) return;
        spinnerIndexRef.current =
          (spinnerIndexRef.current + 1) % spinnerFrames.length;
        let next = `${activeChain}: ? ?`;
        if (
          meta &&
          typeof meta.client === 'number' &&
          typeof meta.unripe === 'number'
        ) {
          const dist = meta.client - meta.unripe;
          const formatter = new Intl.NumberFormat(navigator.language);
          const formattedClient = formatter.format(meta.client);
          const formattedUnripe = formatter.format(meta.unripe);
          const formattedDist = formatter.format(dist);
          const frame = spinnerFrames[spinnerIndexRef.current];
          next = `${meta.chain}: ${frame} ${formattedClient} / ${formattedUnripe} / ${dist < 6 ? 'caught up' : formattedDist} `;
        }
        if (next !== prevStatusRef.current) {
          prevStatusRef.current = next;
          setStatus(next);
        }
      } catch {
        if (!cancelled) {
          const next = 'Error fetching status';
          if (next !== prevStatusRef.current) {
            prevStatusRef.current = next;
            setStatus(next);
          }
        }
      }
      if (!cancelled) setTimeout(run, 1500);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [activeChain]);

  useEffect(() => {
    if (location !== '/khedra') {
      previousView.current = location;
    }
  }, [location]);

  const handleClick = () => {
    if (location === '/khedra' && previousView.current) {
      navigate(previousView.current);
    } else {
      navigate('/khedra');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '0px 10px',
        whiteSpace: 'nowrap',
        textAlign: 'right',
        zIndex: 9999,
        cursor: 'pointer',
        backgroundColor: 'transparent',
        opacity: 0.7,
      }}
    >
      {status}
    </div>
  );
};
