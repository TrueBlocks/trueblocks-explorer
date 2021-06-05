import { runCommand } from '@modules/core';
import { Button } from 'antd';
import React, { useState } from 'react';
import useGlobalState from '../../../state';

export const Scraper = () => {
  const [scraperOn1, setScraperOn1] = useState(true);
  const [scraperOn2, setScraperOn2] = useState(true);
  const { theme } = useGlobalState();

  const toggleScraper1 = async () => {
    await runCommand('scraper');
    setScraperOn1(!scraperOn1);
  };

  const toggleScraper2 = async () => {
    await runCommand('scraper');
    setScraperOn2(!scraperOn2);
  };

  return (
    <>
      <Button type={scraperOn1 ? 'primary' : 'dashed'} onClick={toggleScraper1}>Toggle Index Scraper</Button>
      <Button type={scraperOn2 ? 'primary' : 'dashed'} onClick={toggleScraper2}>Toggle Monitor Scraper</Button>
      <h4 style={{ color: theme ? theme.primaryColor : '#000' }}>scrapers</h4>
    </>
  );
};
