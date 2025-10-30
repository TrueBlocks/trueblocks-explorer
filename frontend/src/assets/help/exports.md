<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Exports View

Welcome to the **Exports** view! This section provides information about managing exports in your application.

## Facets

- Statements Facet uses the Statements store.
- Balances Facet uses the Balances store.
- Transfers Facet uses the Transfers store.
- Transactions Facet uses the Transactions store.
- OpenApprovals Facet uses the OpenApprovals store.
- ApprovalLogs Facet uses the ApprovalLogs store.
- ApprovalTxs Facet uses the ApprovalTxs store.
- Withdrawals Facet uses the Withdrawals store.
- Assets Facet uses the Assets store.
- AssetCharts Facet uses the Statements store.
- Logs Facet uses the Logs store.
- Traces Facet uses the Traces store.
- Receipts Facet uses the Receipts store.

## Stores

- **ApprovalLogs Store (14 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of this log relative to the block
  - address: the smart contract that emitted this log
  - timestamp: the timestamp of the block this log appears in
  - blockHash: the hash of the block
  - transactionHash: the hash of the transction
  - topic0: the first topic hash (event signature)
  - topic1: the second topic hash (first indexed parameter)
  - topic2: the third topic hash (second indexed parameter)
  - topic3: the fourth topic hash (third indexed parameter)
  - data: any remaining un-indexed parameters to the event
  - articulatedLog: a human-readable version of the topic and data fields
  - compressedLog: a truncated version of the articulation

- **ApprovalTxs Store (19 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - hash: the hash of the transaction
  - from: address from which the transaction was sent
  - to: address to which the transaction was sent
  - value: the amount of wei sent with this transactions
  - gasUsed: the amount of gas used by this transaction
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

- **Assets Store (43 members)**

  - timestamp: the Unix timestamp of the object
  - asset: 0xeeee...eeee for ETH reconciliations, the token address otherwise
  - symbol: either ETH, WEI, or the symbol of the asset being reconciled as extracted from the chain
  - decimals: the value of `decimals` from an ERC20 contract or, if ETH or WEI, then 18
  - priceSource: the on-chain source from which the spot price was taken
  - calcs.begBalEth: the beginning balance in ETH
  - calcs.totalInEth: total inflow in ETH
  - calcs.totalOutEth: total outflow in ETH
  - calcs.amountNetEth: net amount in ETH
  - calcs.endBalEth: ending balance in ETH
  - spotPrice: the on-chain price in USD at the time of the transaction
  - calcs.endBalCalcEth: calculated ending balance in ETH
  - date: the timestamp as a date
  - gasUsed: gas used in the transaction
  - calcs.reconciliationType: type of reconciliation
  - accountedFor: the address being accounted for
  - calcs.reconciled: true if reconciled
  - amountIn: incoming amount
  - internalIn: internal incoming amount
  - selfDestructIn: self-destruct incoming amount
  - minerBaseRewardIn: miner base reward
  - minerTxFeeIn: miner transaction fee
  - prefundIn: prefund amount
  - amountOut: outgoing amount
  - internalOut: internal outgoing amount
  - selfDestructOut: self-destruct outgoing amount
  - gasOut: gas out
  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction
  - logIndex: the zero-indexed position of the log
  - transactionHash: the hash of the transaction
  - sender: the transaction sender
  - recipient: the transaction recipient
  - prevBal: previous balance
  - begBalDiff: beginning balance difference
  - endBalDiff: ending balance difference
  - correctingReasons: reasons for corrections
  - correctBegBalIn: correct beginning balance in
  - correctAmountIn: correct amount in
  - correctEndBalIn: correct ending balance in
  - correctBegBalOut: correct beginning balance out
  - correctAmountOut: correct amount out
  - correctEndBalOut: correct ending balance out

- **Balances Store (13 members)**

  - date: the timestamp as a date
  - holder: Holder
  - address: Token Address
  - symbol: Symbol
  - balance: Balance
  - decimals: Decimals
  - priorBalance: Prior Balance
  - totalSupply: Total Supply
  - type: Type
  - name: Token Name
  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - timestamp: the timestamp of the block this log appears in

- **Logs Store (14 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of this log relative to the block
  - address: the smart contract that emitted this log
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

- **OpenApprovals Store (10 members)**

  - timestamp: the current timestamp when the report was generated
  - blockNumber: the current block number when the report was generated
  - owner: the address of the owner of the token (the approver)
  - token: the address of the ERC-20 token being approved
  - spender: the address being granted approval to spend tokens
  - allowance: the amount of tokens approved for spending
  - lastAppBlock: the block number of the last approval event
  - lastAppLogID: the log index of the last approval event
  - lastAppTs: the timestamp of the last approval event
  - lastAppTxID: the transaction index of the last approval event

- **Receipts Store (14 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - transactionHash: the hash of the transaction
  - from: the sender of the transaction
  - to: the recipient of the transaction
  - gasUsed: the amount of gas actually used by the transaction
  - status: `1` on transaction suceess, `null` if tx precedes Byzantium, `0` otherwise
  - isError: whether the transaction resulted in an error
  - contractAddress: the address of the newly created contract, if any
  - cumulativeGasUsed: cumulative gas used
  - effectiveGasPrice: effective gas price
  - blockHash: the hash of the block
  - logsBloom: the logs bloom filter
  - logs: a possibly empty array of logs

- **Statements Store (43 members)**

  - timestamp: the Unix timestamp of the object
  - asset: 0xeeee...eeee for ETH reconciliations, the token address otherwise
  - symbol: either ETH, WEI, or the symbol of the asset being reconciled as extracted from the chain
  - decimals: the value of `decimals` from an ERC20 contract or, if ETH or WEI, then 18
  - priceSource: the on-chain source from which the spot price was taken
  - calcs.begBalEth: the beginning balance in ETH
  - calcs.totalInEth: total inflow in ETH
  - calcs.totalOutEth: total outflow in ETH
  - calcs.amountNetEth: net amount in ETH
  - calcs.endBalEth: ending balance in ETH
  - spotPrice: the on-chain price in USD at the time of the transaction
  - calcs.endBalCalcEth: calculated ending balance in ETH
  - date: the timestamp as a date
  - gasUsed: gas used in the transaction
  - calcs.reconciliationType: type of reconciliation
  - accountedFor: the address being accounted for
  - calcs.reconciled: true if reconciled
  - amountIn: incoming amount
  - internalIn: internal incoming amount
  - selfDestructIn: self-destruct incoming amount
  - minerBaseRewardIn: miner base reward
  - minerTxFeeIn: miner transaction fee
  - prefundIn: prefund amount
  - amountOut: outgoing amount
  - internalOut: internal outgoing amount
  - selfDestructOut: self-destruct outgoing amount
  - gasOut: gas out
  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction
  - logIndex: the zero-indexed position of the log
  - transactionHash: the hash of the transaction
  - sender: the transaction sender
  - recipient: the transaction recipient
  - prevBal: previous balance
  - begBalDiff: beginning balance difference
  - endBalDiff: ending balance difference
  - correctingReasons: reasons for corrections
  - correctBegBalIn: correct beginning balance in
  - correctAmountIn: correct amount in
  - correctEndBalIn: correct ending balance in
  - correctBegBalOut: correct beginning balance out
  - correctAmountOut: correct amount out
  - correctEndBalOut: correct ending balance out

- **Traces Store (22 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - traceIndex: the zero-indexed position of the trace in the transaction
  - from: the address that initiated the trace
  - to: the address that received the trace
  - value: the value transferred in wei
  - type: the type of the trace
  - error: error message if any
  - subtraces: the number of children traces
  - traceAddress: a particular trace's address in the trace tree
  - gas: the gas limit for this trace
  - callType: the type of call
  - input: the input data for the trace
  - gasUsed: the amount of gas used
  - output: the output data from the trace
  - address: the contract address if created
  - code: the contract code if created
  - blockHash: the hash of the block containing this trace
  - transactionHash: the transaction's hash containing this trace
  - timestamp: the timestamp of the block
  - articulatedTrace: human readable version of the trace action input data
  - compressedTrace: a compressed string version of the articulated trace

- **Transactions Store (19 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - hash: the hash of the transaction
  - from: address from which the transaction was sent
  - to: address to which the transaction was sent
  - value: the amount of wei sent with this transactions
  - gasUsed: the amount of gas used by this transaction
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

- **Transfers Store (23 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position the log in the block, if applicable
  - from: the initiator of the transfer (the sender)
  - to: the receiver of the transfer (the recipient)
  - asset: 0xeeee...eeee for ETH transfers, the token address otherwise
  - amount: the amount of the transfer
  - sender: the initiator of the transfer (the sender)
  - recipient: the receiver of the transfer (the recipient)
  - holder: the address of the holder of the asset
  - decimals: the number of decimal places in the asset units
  - amountIn: the top-level value of the incoming transfer
  - amountOut: the amount of regular outflow during this transaction
  - internalIn: the internal value of the incoming transfer
  - internalOut: the value of any internal value transfers out
  - gasOut: the amount of gas expended
  - minerBaseRewardIn: the base fee reward if the miner is the holder address
  - minerNephewRewardIn: the nephew reward if the miner is the holder address
  - minerTxFeeIn: the transaction fee reward if the miner is the holder address
  - minerUncleRewardIn: the uncle reward if the miner who won the uncle block is the holder address
  - selfDestructIn: the incoming value of a self-destruct if recipient is the holder address
  - selfDestructOut: the outgoing value of a self-destruct if sender is the holder address
  - prefundIn: at block zero (0) only, the amount of genesis income for the holder address

- **Withdrawals Store (6 members)**

  - blockNumber: the number of this block
  - timestamp: the timestamp for this block
  - index: a monotonically increasing zero-based index that increments by 1 per withdrawal to uniquely identify each withdrawal
  - validatorIndex: the validator_index of the validator on the consensus layer the withdrawal corresponds to
  - address: the recipient for the withdrawn ether
  - amount: a nonzero amount of ether given in gwei (1e9 wei)

// EXISTING_CODE
// EXISTING_CODE
