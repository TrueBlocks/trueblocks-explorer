<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Contracts View

Welcome to the **Contracts** view! This section provides information about managing contracts in your application.

## Facets

- Dashboard Facet uses the Contracts store.
- Execute Facet uses the Contracts store.
- Events Facet uses the Logs store.

## Stores

- **Contracts Store (7 members)**

  - address: the address of this smart contract
  - addressName: the name for this contract address
  - abi: the ABI for this contract
  - lastUpdated: timestamp when this contract state was last updated
  - date: date when this contract state was last updated
  - errorCount: number of errors encountered when calling read functions
  - lastError: the most recent error message when calling functions

- **Logs Store (15 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of this log relative to the block
  - address: the smart contract that emitted this log
  - addressName: the name for this address
  - timestamp: the timestamp of the block this log appears in
  - blockHash: the hash of the block
  - transactionHash: the hash of the transaction
  - topic0: the first topic hash (event signature)
  - topic1: the second topic hash (first indexed parameter)
  - topic2: the third topic hash (second indexed parameter)
  - topic3: the fourth topic hash (third indexed parameter)
  - data: any remaining un-indexed parameters to the event
  - articulatedLog: a human-readable version of the topic and data fields
  - compressedLog: a truncated version of the articulation

// EXISTING_CODE
// EXISTING_CODE
