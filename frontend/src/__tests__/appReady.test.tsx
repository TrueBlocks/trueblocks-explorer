import { useEffect, useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const AppReadyComponent = ({
  isReady,
}: {
  isReady: () => Promise<boolean>;
}) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;

    const checkReady = async () => {
      while (attempts < maxAttempts) {
        const result = await isReady();
        if (result) {
          setReady(true);
          return;
        }
        attempts++;
        await new Promise((r) => setTimeout(r, 1));
      }
      setError('Backend failed to initialize within timeout');
    };

    checkReady();
  }, [isReady]);

  if (error) return <div>Error: {error}</div>;
  if (!ready) return <div>Not ready</div>;
  return <div>Ready</div>;
};

describe('App readiness fallback UI', () => {
  it('shows fallback and then success when backend becomes ready', async () => {
    let calls = 0;
    const isReady = vi.fn().mockImplementation(() => {
      calls++;
      return Promise.resolve(calls >= 3);
    });

    render(<AppReadyComponent isReady={isReady} />);
    expect(screen.getByText('Not ready')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Ready')).toBeTruthy();
    });
  });

  it('shows error if backend never becomes ready', async () => {
    const isReady = vi.fn().mockResolvedValue(false);

    render(<AppReadyComponent isReady={isReady} />);

    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeTruthy();
    });
  });
});
