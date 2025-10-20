<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Comparitoor View

// EXISTING_CODE
// EXISTING_CODE

## Facets

- Comparitoor Facet uses the Transaction store.
- Chifra Facet uses the Transaction store.
- Etherscan Facet uses the Transaction store.
- Covalent Facet uses the Transaction store.
- Alchemy Facet uses the Transaction store.

## Stores

- **Transaction Store (27 members)**

  - gasUsed: 
  - chainId: 
  - maxPriorityFeePerGas: 
  - type: 
  - traces: 
  - maxFeePerGas: 
  - hash: the hash of the transaction
  - blockHash: the hash of the block containing this transaction
  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - nonce: sequence number of the transactions sent by the sender
  - timestamp: the Unix timestamp of the object
  - date: the timestamp as a date
  - from: address from which the transaction was sent
  - to: address to which the transaction was sent
  - value: the amount of wei sent with this transactions
  - ether: if --ether is specified, the value in ether
  - gas: the maximum number of gas allowed for this transaction
  - gasPrice: the number of wei per unit of gas the sender is willing to spend
  - gasCost: the number of wei per unit of gas the sender is willing to spend
  - input: byte data either containing a message or funcational data for a smart contracts. See the --articulate
  - receipt: 
  - statements: array of reconciliation statements
  - articulatedTx: 
  - hasToken: `true` if the transaction is token related, `false` otherwise
  - isError: `true` if the transaction ended in error, `false` otherwise
  - compressedTx: truncated, more readable version of the articulation

// EXISTING_CODE
// EXISTING_CODE
