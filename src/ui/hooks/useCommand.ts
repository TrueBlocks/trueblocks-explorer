import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { useEffect, useState } from 'react';
import {
  CommandParams,
  CoreCommand,
  JsonResponse,
  runCommand,
} from '../modules/core';

type DataResult = {
  status: 'success';
  data: JsonResponse[];
  meta: {};
};

type ScrapeResult = {
  status: 'success';
  monitor: boolean;
  indexer: boolean;
};

type FailedResult = {
  status: 'fail';
  data: string;
  meta: {};
};

type FailedScrapeResult = {
  status: 'fail';
  monitor: boolean;
  indexer: boolean;
};

export type Result = DataResult | FailedResult;

export type ScraperResult = ScrapeResult | FailedScrapeResult;

export function toFailedResult(error: Error): FailedResult {
  return {
    status: 'fail',
    data: error.toString(),
    meta: {},
  };
}

export function toFailedScrapeResult(error: Error): FailedScrapeResult {
  return {
    status: 'fail',
    monitor: false,
    indexer: false,
  };
}

export function toSuccessfulData(responseData: JsonResponse): DataResult {
  return {
    status: 'success',
    data: responseData.data,
    meta: responseData.meta,
  };
}

export function toSuccessfulScraperData(
  responseData: JsonResponse
): ScrapeResult {
  return {
    status: 'success',
    monitor: responseData.monitor,
    indexer: responseData.indexer,
  };
}

export function useCommand(command: CoreCommand, params?: CommandParams) {
  const emptyData = { data: [{}], meta: {} };
  const [response, setData] = useState<Result>(toSuccessfulData(emptyData));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const eitherResponse = await runCommand(command, params);
      const result: Result = pipe(
        eitherResponse,
        Either.fold(
          toFailedResult,
          (serverResponse) => toSuccessfulData(serverResponse) as Result
        )
      );
      setData(result);
      setLoading(false);
    })();
  }, []);

  return [response, loading] as const;
}
