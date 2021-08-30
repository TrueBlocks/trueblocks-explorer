import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import {
  Card, Col, Row, Switch,
} from 'antd';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import { ScraperResult, toFailedScrapeResult, toSuccessfulScraperData } from '@hooks/useCommand';
import { JsonResponse, runCommand } from '@modules/core';

const useStyles = createUseStyles({
  card: {
    margin: '2px',
    border: '1px brown dashed',
    width: 300,
    height: 400,
  },
});

const formatResponse = (response: either.Either<Error, Record<string, any>>) => {
  const result: ScraperResult = pipe(
    response,
    either.fold(toFailedScrapeResult, (serverResponse) => toSuccessfulScraperData(serverResponse) as ScraperResult),
  );
  return result;
};

export const Scrapers = () => {
  const [indexer, setIndexer] = useState({} as JsonResponse);
  const [monitors, setMonitors] = useState({} as JsonResponse);

  const toggleIndexer = async () => {
    const response = await runCommand('scraper', {
      toggle: 'indexer',
      mode: !indexer.Running,
    });
    const result = formatResponse(response);
    setIndexer(result.indexer);
  };

  const toggleMonitors = async () => {
    const response = await runCommand('scraper', {
      toggle: 'monitors',
      mode: !monitors.Running,
    });
    const result = formatResponse(response);
    setMonitors(result.monitor);
  };

  const toggleBoth = async () => {
    const bothOn = !(indexer.Running && monitors.Running);
    const response = await runCommand('scraper', {
      toggle: 'both',
      mode: bothOn,
    });
    const result = formatResponse(response);
    setIndexer(result.indexer);
    setMonitors(result.monitor);
  };

  useEffect(() => {
    (async () => {
      const response = await runCommand('scraper', { status: 'both' });
      const result = formatResponse(response);
      setIndexer(result.indexer);
      setMonitors(result.monitor);
    })();
  }, []);

  const styles = useStyles();
  return (
    <>
      <Row>
        <Col>
          <Card style={{ height: '500px' }} hoverable title={indexer.Name} className={styles.card}>
            both scrapers:
            {' '}
            <Switch
              checked={indexer.Running && monitors.Running}
              checkedChildren='on'
              unCheckedChildren='off'
              onClick={toggleBoth}
            />
            <br />
            index scraper:
            <Switch checked={indexer.Running} checkedChildren='on' unCheckedChildren='off' onClick={toggleIndexer} />
            <pre>{JSON.stringify(indexer, null, 2)}</pre>
          </Card>
        </Col>
        <Col>
          <Card style={{ height: '500px' }} hoverable title={monitors.Name} className={styles.card}>
            both scrapers:
            {' '}
            <Switch
              checked={indexer.Running && monitors.Running}
              checkedChildren='on'
              unCheckedChildren='off'
              onClick={toggleBoth}
            />
            <br />
            monitor scraper:
            {' '}
            <Switch checked={monitors.Running} checkedChildren='on' unCheckedChildren='off' onClick={toggleMonitors} />
            <pre>{JSON.stringify(monitors, null, 2)}</pre>
          </Card>
        </Col>
      </Row>
    </>
  );
};
