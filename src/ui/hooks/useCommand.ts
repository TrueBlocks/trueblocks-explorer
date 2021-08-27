import {
  CommandParams, CoreCommand, JsonResponse, runCommand,
} from '@modules/core';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { useEffect, useState } from 'react';

type DataResult = {
  status: 'success';
  data: JsonResponse[];
  meta: {};
};

type ScrapeResult = {
  status: 'success';
  monitor: JsonResponse;
  indexer: JsonResponse;
};

type FailedResult = {
  status: 'fail';
  data: string;
  meta: {};
};

type FailedScrapeResult = {
  status: 'fail';
  monitor: JsonResponse;
  indexer: JsonResponse;
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

export function toFailedScrapeResult(): FailedScrapeResult {
  return {
    status: 'fail',
    monitor: { Running: false },
    indexer: { Running: false },
  };
}

export function toSuccessfulData(responseData: JsonResponse): DataResult {
  return {
    status: 'success',
    data: responseData.data,
    meta: responseData.meta,
  };
}

export function toSuccessfulScraperData(responseData: JsonResponse): ScrapeResult {
  return {
    status: 'success',
    monitor: responseData.monitor,
    indexer: responseData.indexer,
  };
}

export const emptyData = { data: [{}], meta: {} };

export function useCommand(command: CoreCommand, params?: CommandParams) {
  const [response, setData] = useState<Result>(toSuccessfulData(emptyData));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const eitherResponse = await runCommand(command, params);

      if (cancelled) {
        return;
      }

      const result: Result = pipe(
        eitherResponse,
        Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result),
      );
      setData(result);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return [response, loading] as const;
}
