import { runCommand } from '@modules/core';
import { Switch } from 'antd';
import React, { useState } from 'react';

export const Scrapers = () => {
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
      index scraper:
      {' '}
      <Switch checkedChildren="on" unCheckedChildren="off" onClick={toggleIndexScraper} />
      <br />
      monitor scraper:
      {' '}
      <Switch checkedChildren="on" unCheckedChildren="off" onClick={toggleMonitorScraper} />
      <h4>
        scrapers
      </h4>
    </>
  );
};
