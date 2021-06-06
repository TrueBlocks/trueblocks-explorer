import { runCommand } from '@modules/core';
import { Switch } from 'antd';
import React, { useEffect, useState } from 'react';

// Server interface
//
// http://localhost:8080/scraper?status returns { "msg": "status", "indexer": false, "monitor": false }
// http://localhost:8080/scraper?tool=[indexer|monitors|both]&mode=[true|false] returns the same with message 'toggle'
//
export const Scrapers = () => {
  // TODO(tjayrush): The state of this toggle is needs to be update from the server
  const [indexerOn, setIndexerOn] = useState(true);
  // TODO(tjayrush): The state of this toggle is needs to be update from the server
  const [monitorsOn, setMonitorsOn] = useState(true);
  // TODO(tjayrush): This is a promise, how do I turn it into JSON?
  const [response, setResponse] = useState({});

  const toggleIndexer = async () => {
    // TODO(tjayrush): This state is local to the app and disagrees with the actual state
    setIndexerOn(!indexerOn);
    // TODO(tjayrush): This value is the actual state of the scraper in the backend
    setResponse(await runCommand('scraper', { toggle: 'indexer', mode: indexerOn }));
  };

  const toggleMonitors = async () => {
    // TODO(tjayrush): This state is local to the app and disagrees with the actual state
    setMonitorsOn(!monitorsOn);
    // TODO(tjayrush): This value is the actual state of the scraper in the backend
    setResponse(await runCommand('scraper', { toggle: 'monitors', mode: monitorsOn }));
  };

  const toggleBoth = async () => {
    // TODO(tjayrush): This state is local to the app and disagrees with the actual state
    const bothOn = !(indexerOn && monitorsOn);
    setIndexerOn(bothOn);
    setMonitorsOn(bothOn);
    // TODO(tjayrush): This value is the actual state of the scraper in the backend
    setResponse(await runCommand('scraper', { toggle: 'both', mode: bothOn }));
  };

  useEffect(() => {
    // TODO(tjayrush): I am not at all clear what this does or why it's here (even though I
    // TODO(tjayrush): put it here).
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
      returned value:
      {' '}
      {JSON.stringify(response, null, 2)}
    </>
  );
};
