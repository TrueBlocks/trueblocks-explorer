import { runCommand } from '@modules/core';
import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';

export const Scrapers = () => {
  const [indexerOn, setIndexerOn] = useState(true);
  const [monitorsOn, setMonitorsOn] = useState(true);
  const [response, setResponse] = useState({});

  const toggleIndexer = async () => {
    setIndexerOn(!indexerOn);
    setResponse(await runCommand('scraper', { toggle: 'indexer', mode: indexerOn }));
  };

  const toggleMonitors = async () => {
    setMonitorsOn(!monitorsOn);
    setResponse(await runCommand('scraper', { toggle: 'monitors', mode: monitorsOn }));
  };

  const toggleBoth = async () => {
    const bothOn = !(indexerOn && monitorsOn);
    setIndexerOn(bothOn);
    setMonitorsOn(bothOn);
    setResponse(await runCommand('scraper', { toggle: 'both', mode: bothOn }));
  };

  useEffect(() => {
    setResponse(runCommand('scraper', { status: 'both' }));
  }, []);

  return (
    <>
      index scraper:
      {' '}
      <Switch checked={indexerOn} checkedChildren="on" unCheckedChildren="off" onClick={toggleIndexer} />
      <br />
      monitor scraper:
      {' '}
      <Switch checked={monitorsOn} checkedChildren="on" unCheckedChildren="off" onClick={toggleMonitors} />
      <br />
      both scrapers:
      {' '}
      <Switch checked={indexerOn && monitorsOn} checkedChildren="on" unCheckedChildren="off" onClick={toggleBoth} />
      <br />
      Return value:
      {' '}
      {JSON.stringify(response, null, 2)}
    </>
  );
};
