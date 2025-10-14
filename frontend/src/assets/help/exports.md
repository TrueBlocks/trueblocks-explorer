<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Exports View

// EXISTING_CODE
This is the help file for the Exports view.
// EXISTING_CODE

## Facets

- Statements Facet uses the Statements store.
- Balances Facet uses the Balances store.
- Transfers Facet uses the Transfers store.
- Transactions Facet uses the Transactions store.
- Approvals Facet uses the Approvals store.
- Approves Facet uses the Approves store.
- Withdrawals Facet uses the Withdrawals store.
- Assets Facet uses the Assets store.
- Logs Facet uses the Logs store.
- Traces Facet uses the Traces store.
- Receipts Facet uses the Receipts store.

## Stores

- **Approvals Store (11 members)**

  - allowance: the amount of tokens approved for spending
  - blockNumber: the current block number when the report was generated
  - timestamp: the current timestamp when the report was generated
  - date: the timestamp as a date
  - owner: the address of the owner of the token (the approver)
  - spender: the address being granted approval to spend tokens
  - token: the address of the ERC-20 token being approved
  - lastAppBlock: the block number of the last approval event
  - lastAppTs: the timestamp of the last approval event
  - lastAppTxID: the transaction index of the last approval event
  - lastAppLogID: the log index of the last approval event

- **Approves Store (14 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of this log relative to the block
  - timestamp: the timestamp of the block this log appears in
  - date: the timestamp as a date
  - address: the smart contract that emitted this log
  - name: the name of the smart contract if any
  - topics: the first topic hashes event signature of the log, up to 3 additional index parameters may appear
  - data: any remaining un-indexed parameters to the event
  - transactionHash: the hash of the transction
  - blockHash: the hash of the block
  - articulatedLog: a human-readable version of the topic and data fields
  - compressedLog: a truncated, more readable version of the articulation
  - isNFT: true if the log is an NFT transfer

- **Assets Store (6 members)**

  - address: Address
  - name: Name
  - symbol: Symbol
  - decimals: Decimals
  - source: Source
  - tags: Tags

- **Balances Store (11 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - timestamp: the timestamp of the block this log appears in
  - date: the timestamp as a date
  - holder: Holder
  - address: Token Address
  - symbol: Symbol
  - name: Token Name
  - balance: Balance
  - priorBalance: Prior Balance
  - decimals: Decimals

- **Logs Store (14 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of this log relative to the block
  - timestamp: the timestamp of the block this log appears in
  - date: the timestamp as a date
  - address: the smart contract that emitted this log
  - name: the name of the smart contract if any
  - topics: the first topic hashes event signature of the log, up to 3 additional index parameters may appear
  - data: any remaining un-indexed parameters to the event
  - transactionHash: the hash of the transction
  - blockHash: the hash of the block
  - articulatedLog: a human-readable version of the topic and data fields
  - compressedLog: a truncated, more readable version of the articulation
  - isNFT: true if the log is an NFT transfer

- **Receipts Store (14 members)**

  - logsBloom: 
  - to: 
  - cumulativeGasUsed: 
  - effectiveGasPrice: 
  - from: 
  - blockHash: 
  - blockNumber: 
  - contractAddress: the address of the newly created contract, if any
  - gasUsed: the amount of gas actually used by the transaction
  - isError: 
  - logs: a possibly empty array of logs
  - status: `1` on transaction suceess, `null` if tx precedes Byzantium, `0` otherwise
  - transactionHash: 
  - transactionIndex: 

- **Statements Store (43 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position the log in the block, if applicable
  - transactionHash: the hash of the transaction that triggered this reconciliation
  - timestamp: the Unix timestamp of the object
  - date: the timestamp as a date
  - asset: 0xeeee...eeee for ETH reconciliations, the token address otherwise
  - symbol: either ETH, WEI, or the symbol of the asset being reconciled as extracted from the chain
  - decimals: the value of `decimals` from an ERC20 contract or, if ETH or WEI, then 18
  - spotPrice: the on-chain price in USD (or if a token in ETH, or zero) at the time of the transaction
  - priceSource: the on-chain source from which the spot price was taken
  - accountedFor: the address being accounted for in this reconciliation
  - sender: the initiator of the transfer (the sender)
  - recipient: the receiver of the transfer (the recipient)
  - begBal: the on-chain or running beginning balance prior to the transaction (see notes about intra-block reconciliations)
  - amountNet: totalIn - totalOut
  - endBal: the on-chain or running balance after the transaction (see notes about intra-block reconciliations)
  - reconciled: true if `endBal === endBalCalc` and `begBal === prevBal`. `false` otherwise.
  - totalIn: the sum of the following `In` fields
  - amountIn: the top-level value of the incoming transfer for the accountedFor address
  - internalIn: the internal value of the incoming transfer for the accountedFor address
  - selfDestructIn: the incoming value of a self-destruct if recipient is the accountedFor address
  - minerBaseRewardIn: the base fee reward if the miner is the accountedFor address
  - minerNephewRewardIn: the nephew reward if the miner is the accountedFor address
  - minerTxFeeIn: the transaction fee reward if the miner is the accountedFor address
  - minerUncleRewardIn: the uncle reward if the miner who won the uncle block is the accountedFor address
  - correctBegBalIn: for unreconciled transfers, increase in beginning balance need to match previous balance
  - correctAmountIn: for unreconciled transfers, increase in the amount of a transfer
  - correctEndBalIn: for unreconciled transfers, increase in ending balance need to match running balance or block balance
  - prefundIn: at block zero (0) only, the amount of genesis income for the accountedFor address
  - totalOut: the sum of the following `Out` fields
  - amountOut: the amount (in units of the asset) of regular outflow during this transaction
  - internalOut: the value of any internal value transfers out of the accountedFor account
  - correctBegBalOut: for unreconciled transfers, decrease in beginning balance need to match previous balance
  - correctAmountOut: for unreconciled transfers, decrease in the amount of a transfer
  - correctEndBalOut: for unreconciled transfers, decrease in ending balance need to match running balance or block balance
  - selfDestructOut: the value of the self-destructed value out if the accountedFor address was self-destructed
  - gasOut: if the transaction's original sender is the accountedFor address, the amount of gas expended
  - prevBal: the account balance for the given asset for the previous reconciliation
  - begBalDiff: difference between expected beginning balance and balance at last reconciliation, if non-zero, the reconciliation failed
  - endBalDiff: endBal - endBalCalc, if non-zero, the reconciliation failed
  - endBalCalc: begBal + amountNet
  - correctingReasons: for unreconciled transfers, the reasons for the correcting entries, if any

- **Traces Store (14 members)**

  - blockHash: the hash of the block containing this trace
  - blockNumber: the number of the block
  - timestamp: the timestamp of the block
  - date: the timestamp as a date
  - transactionHash: the transaction's hash containing this trace
  - transactionIndex: the zero-indexed position of the transaction in the block
  - subtraces: the number of children traces that the trace hash
  - type: the type of the trace
  - compressedTrace: a compressed string version of the articulated trace
  - error: 
  - traceAddress: a particular trace's address in the trace tree
  - action: the trace action for this trace
  - result: the trace result of this trace
  - articulatedTrace: human readable version of the trace action input data

- **Transactions Store (27 members)**

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

- **Transfers Store (23 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position the log in the block, if applicable
  - date: the timestamp as a date
  - holder: the address of the holder of the asset
  - asset: 0xeeee...eeee for ETH transfers, the token address otherwise
  - decimals: the number of decimal places in the asset units
  - sender: the initiator of the transfer (the sender)
  - recipient: the receiver of the transfer (the recipient)
  - amountIn: the top-level value of the incoming transfer for the holder address
  - internalIn: the internal value of the incoming transfer for the holder address
  - minerBaseRewardIn: the base fee reward if the miner is the holder address
  - minerNephewRewardIn: the nephew reward if the miner is the holder address
  - minerTxFeeIn: the transaction fee reward if the miner is the holder address
  - minerUncleRewardIn: the uncle reward if the miner who won the uncle block is the holder address
  - prefundIn: at block zero (0) only, the amount of genesis income for the holder address
  - selfDestructIn: the incoming value of a self-destruct if recipient is the holder address
  - amountOut: the amount (in units of the asset) of regular outflow during this transaction
  - internalOut: the value of any internal value transfers out of the holder account
  - gasOut: if the transaction's original sender is the holder address, the amount of gas expended
  - selfDestructOut: the outgoing value of a self-destruct if sender is the holder address
  - transaction: the transaction that triggered the transfer
  - log: if a token transfer, the log that triggered the transfer

- **Withdrawals Store (8 members)**

  - address: the recipient for the withdrawn ether
  - amount: a nonzero amount of ether given in gwei (1e9 wei)
  - ether: if --ether is specified, the amount in ether
  - blockNumber: the number of this block
  - index: a monotonically increasing zero-based index that increments by 1 per withdrawal to uniquely identify each withdrawal
  - timestamp: the timestamp for this block
  - date: the timestamp as a date
  - validatorIndex: the validator_index of the validator on the consensus layer the withdrawal corresponds to

// EXISTING_CODE
// EXISTING_CODE
