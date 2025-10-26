import { useCallback, useRef, useState } from 'react';

import { GetDalleAudioURL } from '@app';
import { types } from '@models';
import { Log } from '@utils';

export interface UseSpeakPromptArgs {
  activeAddress: string | null;
  selectedSeries: string | null;
  hasEnhancedPrompt: boolean;
}

export const useSpeakPrompt = ({
  activeAddress,
  selectedSeries,
  hasEnhancedPrompt,
}: UseSpeakPromptArgs) => {
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async () => {
    if (!hasEnhancedPrompt) return;
    if (!activeAddress) return;
    if (!selectedSeries) return;
    try {
      setSpeaking(true);
      const url = await GetDalleAudioURL(
        {
          collection: 'dresses',
          dataFacet: types.DataFacet.GENERATOR,
          activeAddress: activeAddress,
        },
        selectedSeries,
      );
      if (typeof url === 'string' && url) {
        setAudioUrl(url);
        if (audioRef.current) {
          if (audioRef.current.src === url) {
            try {
              audioRef.current.currentTime = 0;
            } catch {}
          }
          try {
            await audioRef.current.play();
          } catch {}
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'error';
      Log('readtome:error:' + msg.slice(0, 200));
    } finally {
      setSpeaking(false);
    }
  }, [activeAddress, selectedSeries, hasEnhancedPrompt]);

  return { speaking, audioUrl, audioRef, speak };
};
