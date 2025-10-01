<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Chunks View

// EXISTING_CODE
// EXISTING_CODE

## Facets

- Stats Facet uses the Stats store.
- Index Facet uses the Index store.
- Blooms Facet uses the Blooms store.
- Manifest Facet uses the Manifest store.

## Stores

- **Blooms Store (8 members)**

  - range: the block range (inclusive) covered by this chunk
  - magic: an internal use only magic number to indicate file format
  - hash: the hash of the specification under which this chunk was generated
  - nBlooms: the number of individual bloom filters in this bloom file
  - nInserted: the number of addresses inserted into the bloom file
  - size: the size on disc in bytes of this bloom file
  - byteWidth: the width of the bloom filter
  - rangeDates: if verbose, the block and timestamp bounds of the chunk (may be null)

- **Index Store (7 members)**

  - range: the block range (inclusive) covered by this chunk
  - magic: an internal use only magic number to indicate file format
  - hash: the hash of the specification under which this chunk was generated
  - nAddresses: the number of addresses in this chunk
  - nAppearances: the number of appearances in this chunk
  - size: the size of the chunk in bytes
  - rangeDates: if verbose, the block and timestamp bounds of the chunk (may be null)

- **Manifest Store (4 members)**

  - version: the version string hashed into the chunk data
  - chain: the chain to which this manifest belongs
  - specification: IPFS cid of the specification
  - chunks: a list of the IPFS hashes of all of the chunks in the unchained index

- **Stats Store (13 members)**

  - range: the block range (inclusive) covered by this chunk
  - nAddrs: the number of addresses in the chunk
  - nApps: the number of appearances in the chunk
  - nBlocks: the number of blocks in the chunk
  - nBlooms: the number of bloom filters in the chunk's bloom
  - recWid: the record width of a single bloom filter
  - bloomSz: the size of the bloom filters on disc in bytes
  - chunkSz: the size of the chunks on disc in bytes
  - addrsPerBlock: the average number of addresses per block
  - appsPerBlock: the average number of appearances per block
  - appsPerAddr: the average number of appearances per address
  - ratio: the ratio of appearances to addresses
  - rangeDates: if verbose, the block and timestamp bounds of the chunk (may be null)

// EXISTING_CODE
// EXISTING_CODE
