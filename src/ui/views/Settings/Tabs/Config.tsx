import { useCommand } from '@hooks/useCommand';
import { Button } from 'antd';
import React, { useState } from 'react';
import useGlobalState from '../../../state';

export const Config = () => {
  const [scraperOn, setScraperOn] = useState(true);
  const { theme } = useGlobalState();

  const toggleScraper = () => {
    setScraperOn(!scraperOn);
    useCommand('scraper');
  };

  return (
    <>
      {/* Just changing the color of the button so I know what's happening */}
      <Button type={scraperOn ? 'primary' : 'dashed'} onClick={toggleScraper}>Toggle Scraper</Button>
      <h4 style={{ color: theme ? theme.primaryColor : '#000' }}>Config</h4>
    </>
  );
};
