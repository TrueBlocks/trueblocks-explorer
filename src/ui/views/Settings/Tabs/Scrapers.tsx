import { runCommand } from '@modules/core';
import {
  toSuccessfulScraperData,
  toFailedScrapeResult,
  ScraperResult,
} from '@hooks/useCommand';
import { Switch } from 'antd';
import { either } from 'fp-ts';
import React, { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/lib/function';

// Server interface
//
// http://localhost:8080/scraper?status returns { "msg": "status", "indexer": false, "monitor": false }
// http://localhost:8080/scraper?tool=[indexer|monitors|both]&mode=[true|false] returns the same with message 'toggle'
//

const formatResponse = (
  response: either.Either<Error, Record<string, any>>
) => {
  const result: ScraperResult = pipe(
    response,
    either.fold(
      toFailedScrapeResult,
      (serverResponse) =>
        toSuccessfulScraperData(serverResponse) as ScraperResult
    )
  );
  return result;
};

export const Scrapers = () => {
  // TODO(tjayrush): The state of this toggle needs to be updated from the server
  const [indexerOn, setIndexerOn] = useState(true);
  // TODO(tjayrush): The state of this toggle needs to be updated from the server
  const [monitorsOn, setMonitorsOn] = useState(true);
  // TODO(tjayrush): This is a promise, how do I turn it into JSON?
  const [response, setResponse] = useState({});

  const toggleIndexer = async () => {
    // TODO(tjayrush): This value is the actual state of the scraper in the backend
    const response = await runCommand('scraper', {
      toggle: 'indexer',
      mode: !indexerOn,
    });
    const result = formatResponse(response);
    setIndexerOn(result.indexer);
    setResponse(result);
  };

  const toggleMonitors = async () => {
    const response = await runCommand('scraper', {
      toggle: 'monitors',
      mode: !monitorsOn,
    });
    const result = formatResponse(response);
    setMonitorsOn(result.monitor);
    setResponse(result);
  };

  const toggleBoth = async () => {
    // TODO(tjayrush): This state is local to the app and disagrees with the actual state
    const bothOn = !(indexerOn && monitorsOn);
    // TODO(tjayrush): This value is the actual state of the scraper in the backend
    const response = await runCommand('scraper', {
      toggle: 'both',
      mode: bothOn,
    });
    const result = formatResponse(response);
    setIndexerOn(result.indexer);
    setMonitorsOn(result.monitor);
    setResponse(result);
  };

  useEffect(() => {
    (async () => {
      // TODO(tjayrush): I am not at all clear what this does or why it's here (even though I
      // TODO(tjayrush): put it here).
      const response = await runCommand('scraper', { status: 'both' });
      const result = formatResponse(response);
      setIndexerOn(result.indexer);
      setMonitorsOn(result.monitor);
      setResponse(result);
    })();
  }, []);

  return (
    <>
      index scraper:{' '}
      <Switch
        checked={indexerOn}
        checkedChildren="on"
        unCheckedChildren="off"
        onClick={toggleIndexer}
      />
      <br />
      monitor scraper:{' '}
      <Switch
        checked={monitorsOn}
        checkedChildren="on"
        unCheckedChildren="off"
        onClick={toggleMonitors}
      />
      <br />
      both scrapers:{' '}
      <Switch
        checked={indexerOn && monitorsOn}
        checkedChildren="on"
        unCheckedChildren="off"
        onClick={toggleBoth}
      />
      <br />
      returned value: {JSON.stringify(response, null, 2)}
    </>
  );
};
