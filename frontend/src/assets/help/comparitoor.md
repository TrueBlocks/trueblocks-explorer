<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Comparitoor View

Welcome to the **Comparitoor** view! This section provides information about managing comparitoor in your application.

## Facets

- Comparitoor Facet uses the Transaction store.
- Chifra Facet uses the Transaction store.
- Etherscan Facet uses the Transaction store.
- Covalent Facet uses the Transaction store.
- Alchemy Facet uses the Transaction store.

## Stores

- **Transaction Store (22 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - hash: the hash of the transaction
  - from: address from which the transaction was sent
  - fromName: the name for this from address
  - to: address to which the transaction was sent
  - toName: the name for this to address
  - value: the amount of wei sent with this transactions
  - date: the timestamp as a date
  - gasOut: the amount of gas cost for this transaction
  - timestamp: the Unix timestamp of the object
  - input: byte data either containing a message or funcational data for a smart contracts
  - articulatedTx: articulated transaction data
  - isError: `true` if the transaction ended in error, `false` otherwise
  - hasToken: `true` if the transaction is token related, `false` otherwise
  - gas: the maximum number of gas allowed for this transaction
  - gasPrice: the number of wei per unit of gas the sender is willing to spend
  - maxFeePerGas: maximum fee per gas
  - maxPriorityFeePerGas: maximum priority fee per gas
  - blockHash: the hash of the block containing this transaction
  - nonce: sequence number of the transactions sent by the sender
  - type: the transaction type

// EXISTING_CODE
// EXISTING_CODE
