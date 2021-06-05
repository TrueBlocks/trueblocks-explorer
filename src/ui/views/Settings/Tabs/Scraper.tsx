import { runCommand } from '@modules/core';
import { Button } from 'antd';
import React, { useState } from 'react';
import useGlobalState from '../../../state';

export const Scraper = () => {
  const [idxScraperOn, setIndexScraper] = useState(true);
  const [monScraperOn, setMonitorScraper] = useState(true);
  const { theme } = useGlobalState();

  const toggleScraper1 = async () => {
    setIndexScraper(!idxScraperOn);
    await runCommand('scraper', { tool: 'monitor', mode: idxScraperOn });
  };

  const toggleScraper2 = async () => {
    setMonitorScraper(!monScraperOn);
    await runCommand('scraper', { tool: 'monitor', mode: monScraperOn });
  };

  return (
    <>
      <Button type={idxScraperOn ? 'primary' : 'dashed'} onClick={toggleScraper1}>Toggle Index Scraper</Button>
      <Button type={monScraperOn ? 'primary' : 'dashed'} onClick={toggleScraper2}>Toggle Monitor Scraper</Button>
      <h4 style={{ color: theme ? theme.primaryColor : '#000' }}>
        scrapers
      </h4>
    </>
  );
};
