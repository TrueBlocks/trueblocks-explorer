// FIXME: this is a temporary file and it should never get merged

import {
  blknum,
  Block,
  Cache, Function, getBlocks, getExport, getWhen, Log, Monitor, Name, PinnedChunk, Receipt, Status, Transaction,
} from '@sdk';

export type FixedCache = Cache & {
  items: [],
}

export type FixedStatus = Status & { caches: FixedCache[] };

export function createEmptyStatus(): FixedStatus {
  return {
    clientVersion: '',
    clientIds: '',
    trueblocksVersion: '',
    rpcProvider: '',
    balanceProvider: '',
    configPath: '',
    cachePath: '',
    indexPath: '',
    host: '',
    isTesting: false,
    isApi: false,
    isDocker: false,
    isScraping: false,
    isArchive: false,
    isTracing: false,
    hasEskey: false,
    hasPinkey: false,
    ts: 0,
    caches: [
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
    ],
  };
}

export type Meta = {
  unripe: number,
  ripe: number,
  staging: number,
  finalized: number,
  client: number,
}

export function createEmptyMeta() {
  return {
    unripe: 0,
    ripe: 0,
    staging: 0,
    finalized: 0,
    client: 0,
  };
}

export type FixedListCount = {
  address: string,
  nRecords: number,
  fileSize: number,
}

export type FixedExportParameters = Parameters<typeof getExport>[0] & {
  ether: boolean,
  fmt: string,
}

export type FixedGetBlocksParameters = Parameters<typeof getBlocks>[0] & {
  list: number,
}

type ScraperDetails = {
  Name: string,
  Running: boolean,
}

export type FixedScrape = {
  monitor: ScraperDetails,
  indexer: ScraperDetails,
};

export type FixedWhenParameters = Parameters<typeof getWhen>[0] & {
  list?: boolean
};

export type FixedMonitor =
  Monitor
  & { name: string };

export type FixedTransaction =
  Transaction
  & {
    extraData: {},
    isError: boolean,
    date: string,
    receipt: FixedReceipt,
  };

export type FixedReceipt =
  Receipt
  & {
    logs: FixedLog[],
  }

export type FixedLog =
  Log
  & {
    articulatedLog: {
      name: string,
      inputs: {
        name?: string,
        [param: string]: string | undefined
      }
    }[]
  }

export type TransactionModel =
  FixedTransaction
  & {
    id: string,
    fromName: Name,
    toName: Name,
  }

export type FixedBlock =
  Block
  & {
    unclesCnt: number,
  };

export type FixedPinnedChunk =
  PinnedChunk
  & {
    firstApp: blknum,
    latestApp: blknum,
  };
