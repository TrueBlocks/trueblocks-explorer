<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Status View

Welcome to the **Status** view! This section provides information about managing status in your application.

## Facets

- Status Facet uses the Status store.
- Caches Facet uses the Caches store.
- Chains Facet uses the Chains store.

## Stores

- **Caches Store (6 members)**

  - type: the type of cache
  - path: the path to the cache
  - nFiles: the number of files in the cache
  - nFolders: the number of folders in the cache
  - sizeInBytes: the size of the cache in bytes
  - lastCached: the last time this cache was updated

- **Chains Store (7 members)**

  - chain: the chain identifier
  - chainId: the chain ID
  - symbol: the chain's native token symbol
  - rpcProvider: the RPC provider URL
  - ipfsGateway: the IPFS gateway URL
  - localExplorer: the local block explorer URL
  - remoteExplorer: the remote block explorer URL

- **Status Store (18 members)**

  - cachePath: path to the cache directory
  - indexPath: path to the index directory
  - chain: the chain identifier
  - chainId: the chain ID
  - networkId: the network ID
  - chainConfig: path to chain configuration
  - rootConfig: path to root configuration
  - clientVersion: version of the client
  - version: Application version
  - progress: progress information
  - rpcProvider: RPC provider URL
  - hasEsKey: whether Etherscan API key is available
  - hasPinKey: whether Pinata API key is available
  - isApi: whether running in API mode
  - isArchive: whether node is archive node
  - isScraping: whether scraper is running
  - isTesting: whether in testing mode
  - isTracing: whether tracing is enabled

// EXISTING_CODE
// EXISTING_CODE
