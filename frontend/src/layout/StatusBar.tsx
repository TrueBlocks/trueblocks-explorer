import { useEffect, useState } from 'react';

import { useEvent, useIconSets } from '@hooks';
import { msgs } from '@models';
import { copyToClipboard } from '@utils';

import './StatusBar.css';

export const StatusBar = () => {
  const [status, setStatus] = useState('');
  const [visible, setVisible] = useState(false);
  const [cn, setCn] = useState('okay');

  const { Copy } = useIconSets();
  const handleCopyError = async () => {
    await copyToClipboard(status);
  };

  useEvent(msgs.EventType.STATUS, (message: string) => {
    if (cn === 'error' && visible) return;
    setCn('okay');
    setStatus(message);
    setVisible(true);
  });

  useEvent(msgs.EventType.ERROR, (message: string) => {
    // TODO: BOGUS - DO I NEED TO EVEN SAY IT?
    if (
      message.toLowerCase().includes('facet') &&
      message.toLowerCase().includes('downloaded')
    ) {
      return;
    }
    setCn('error');
    setStatus(message);
    setVisible(true);
  });

  useEffect(() => {
    if (!visible) return;
    const timeout = cn === 'error' ? 8000 : 1500;
    const timer = setTimeout(() => {
      setVisible(false);
    }, timeout);
    return () => clearTimeout(timer);
  }, [visible, status, cn]);

  if (!visible) return null;

  return (
    <div className={cn}>
      {cn === 'error' && (
        <Copy
          style={{
            marginLeft: '8px',
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onClick={handleCopyError}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
        />
      )}
      <span>{status}</span>
    </div>
  );
};
