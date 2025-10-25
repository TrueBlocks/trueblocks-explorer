<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Chunks View

Welcome to the **Chunks** view! This section provides information about managing chunks in your application.

## Facets

- Stats Facet uses the Stats store.
- Index Facet uses the Index store.
- Blooms Facet uses the Blooms store.
- Manifest Facet uses the Manifest store.

## Stores

- **Blooms Store (7 members)**

  - range: the block range (inclusive) covered by this chunk
  - magic: an internal use only magic number to indicate file format
  - hash: the hash of the specification under which this chunk was generated
  - nBlooms: the number of individual bloom filters in this bloom file
  - nInserted: the number of addresses inserted into the bloom file
  - calc.fileSize: the size on disc in bytes of this bloom file
  - byteWidth: the width of the bloom filter

- **Index Store (6 members)**

  - range: the block range (inclusive) covered by this chunk
  - magic: an internal use only magic number to indicate file format
  - hash: the hash of the specification under which this chunk was generated
  - nAddresses: the number of addresses in this chunk
  - nAppearances: the number of appearances in this chunk
  - size: the size of the chunk in bytes

- **Manifest Store (3 members)**

  - version: the version string hashed into the chunk data
  - chain: the chain to which this manifest belongs
  - specification: IPFS cid of the specification

- **Stats Store (12 members)**

  - range: the block range (inclusive) covered by this chunk
  - ratio: the ratio of appearances to addresses
  - addrsPerBlock: the average number of addresses per block
  - appsPerBlock: the average number of appearances per block
  - appsPerAddr: the average number of appearances per address
  - bloomSz: the size of the bloom filters on disc in bytes
  - chunkSz: the size of the chunks on disc in bytes
  - nAddrs: the number of addresses in the chunk
  - nApps: the number of appearances in the chunk
  - nBlocks: the number of blocks in the chunk
  - nBlooms: the number of bloom filters in the chunk's bloom
  - recWid: the record width of a single bloom filter

// EXISTING_CODE
// EXISTING_CODE
