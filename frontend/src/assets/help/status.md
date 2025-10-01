<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Status View

// EXISTING_CODE
// EXISTING_CODE

## Facets

- Status Facet uses the Status store.
- Caches Facet uses the Caches store.
- Chains Facet uses the Chains store.

## Stores

- **Caches Store (6 members)**

  - lastCached: the last time this cache was updated
  - nFiles: the number of files in the cache
  - nFolders: the number of folders in the cache
  - path: the path to the cache
  - sizeInBytes: the size of the cache in bytes
  - type: the type of cache

- **Chains Store (7 members)**

  - chain: the chain identifier
  - chainId: the chain ID
  - ipfsGateway: the IPFS gateway URL
  - localExplorer: the local block explorer URL
  - remoteExplorer: the remote block explorer URL
  - rpcProvider: the RPC provider URL
  - symbol: the chain's native token symbol

- **Status Store (18 members)**

  - cachePath: path to the cache directory
  - chain: the chain identifier
  - chainConfig: path to chain configuration
  - chainId: the chain ID
  - clientVersion: version of the client
  - hasEsKey: whether Etherscan API key is available
  - hasPinKey: whether Pinata API key is available
  - indexPath: path to the index directory
  - isApi: whether running in API mode
  - isArchive: whether node is archive node
  - isScraping: whether scraper is running
  - isTesting: whether in testing mode
  - isTracing: whether tracing is enabled
  - networkId: the network ID
  - progress: progress information
  - rootConfig: path to root configuration
  - rpcProvider: RPC provider URL
  - version: Application version

// EXISTING_CODE
// EXISTING_CODE
