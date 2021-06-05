import { runCommand } from '@modules/core';
import { Button } from 'antd';
import React, { useState } from 'react';

export const Scraper = () => {
  const [idxScraperOn, setIndexScraper] = useState(true);
  const [monScraperOn, setMonitorScraper] = useState(true);

  const toggleIndexScraper = async () => {
    setIndexScraper(!idxScraperOn);
    await runCommand('scraper', { tool: 'monitor', mode: idxScraperOn });
  };

  const toggleMonitorScraper = async () => {
    setMonitorScraper(!monScraperOn);
    await runCommand('scraper', { tool: 'monitor', mode: monScraperOn });
  };

  return (
    <>
      <Button type={idxScraperOn ? 'primary' : 'dashed'} onClick={toggleIndexScraper}>Toggle Index Scraper</Button>
      <Button type={monScraperOn ? 'primary' : 'dashed'} onClick={toggleMonitorScraper}>Toggle Monitor Scraper</Button>
      <h4>
        scrapers
      </h4>
    </>
  );
};
