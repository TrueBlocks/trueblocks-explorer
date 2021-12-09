// FIXME: this is a temporary file and it should never get merged

import { Cache, Status } from '@sdk';

export type FixedStatus = Status & { cache: Cache[] };

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
    cache: [
      {
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
    ],
  };
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
