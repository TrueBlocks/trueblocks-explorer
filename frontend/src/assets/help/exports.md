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

- **ApprovalLogs Store (15 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position of the log in the block
  - address: the smart contract that emitted this log
  - addressName: the name for this address
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

- **ApprovalTxs Store (22 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - hash: the hash of the transaction
  - from: address from which the transaction was sent
  - fromName: name for address from which the transaction was sent
  - to: address to which the transaction was sent
  - toName: name for address to which the transaction was sent
  - value: the amount of wei sent with this transactions
  - date: the timestamp as a date
  - gasOut: the amount of gas spent on the transaction
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

- **Assets Store (48 members)**

  - timestamp: the Unix timestamp of the object
  - asset: 0xeeee...eeee for ETH reconciliations, the token address otherwise
  - assetName: the name for this asset address
  - symbol: either ETH, WEI, or the symbol of the asset being reconciled as extracted from the chain
  - decimals: the value of `decimals` from an ERC20 contract or, if ETH or WEI, then 18
  - priceSource: the on-chain source from which the spot price was taken
  - calcs.begBalEth: the beginning balance in ETH
  - calcs.totalInEth: total inflow in ETH
  - calcs.totalOutEth: total outflow in ETH
  - calcs.amountNetEth: net amount in ETH
  - calcs.endBalEth: ending balance in ETH
  - spotPrice: the on-chain price in USD at the time of the transaction
  - statementId: the number of statements for this asset
  - calcs.endBalCalcEth: calculated ending balance in ETH
  - date: the timestamp as a date
  - gasUsed: the amount of gas used by the transaction
  - calcs.reconciliationType: type of reconciliation
  - accountedFor: the address being accounted for
  - accountedForName: the name for this accounted address
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
  - senderName: the name for this sender address
  - recipient: the transaction recipient
  - recipientName: the name for this recipient address
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

- **Balances Store (7 members)**

  - blockNumber: the number of the block
  - holder: Holder
  - holderName: the name for this holder address
  - address: Token Address
  - addressName: the name for this token address
  - balance: Balance in wei
  - diff: Balance in wei

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

- **OpenApprovals Store (13 members)**

  - timestamp: the current timestamp when the report was generated
  - blockNumber: the current block number when the report was generated
  - owner: the address of the owner of the token (the approver)
  - ownerName: the name for this owner address
  - token: the address of the ERC-20 token being approved
  - tokenName: the name for this token address
  - spender: the address being granted approval to spend tokens
  - spenderName: the name for this spender address
  - allowance: the amount of tokens approved for spending
  - lastAppBlock: the block number of the last approval event
  - lastAppLogID: the log index of the last approval event
  - lastAppTs: the timestamp of the last approval event
  - lastAppTxID: the transaction index of the last approval event

- **Receipts Store (17 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - transactionHash: the hash of the transaction
  - from: the sender of the transaction
  - fromName: the name for this from address
  - to: the recipient of the transaction
  - toName: the name for this to address
  - gasOut: the amount of gas cost for the transaction
  - status: `1` on transaction suceess, `null` if tx precedes Byzantium, `0` otherwise
  - isError: whether the transaction resulted in an error
  - contractAddress: the address of the newly created contract, if any
  - contractAddressName: the name for this contract address
  - cumulativeGasUsed: cumulative gas used
  - effectiveGasPrice: effective gas price
  - blockHash: the hash of the block
  - logsBloom: the logs bloom filter
  - logs: a possibly empty array of logs

- **Statements Store (47 members)**

  - timestamp: the Unix timestamp of the object
  - asset: 0xeeee...eeee for ETH reconciliations, the token address otherwise
  - assetName: the name for this asset address
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
  - accountedForName: the name for this accounted address
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
  - senderName: the name for this sender address
  - recipient: the transaction recipient
  - recipientName: the name for this recipient address
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

- **Traces Store (14 members)**

  - blockHash: the hash of the block containing this trace
  - blockNumber: the number of the block
  - subtraces: the number of children traces that the trace hash
  - traceAddress: a particular trace's address in the trace tree
  - transactionHash: the transaction's hash containing this trace
  - transactionIndex: the zero-indexed position of the transaction in the block
  - type: the type of the trace
  - error: error message if any
  - action: the trace action for this trace
  - result: the trace result of this trace
  - articulatedTrace: human readable version of the trace action input data
  - compressedTrace: a compressed string version of the articulated trace
  - timestamp: the timestamp of the block
  - date: the timestamp as a date

- **Transactions Store (22 members)**

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

- **Transfers Store (13 members)**

  - blockNumber: the number of the block
  - transactionIndex: the zero-indexed position of the transaction in the block
  - logIndex: the zero-indexed position the log in the block, if applicable
  - asset: 0xeeee...eeee for ETH transfers, the token address otherwise
  - assetName: the name for this asset address
  - sender: the initiator of the transfer (the sender)
  - senderName: the name for this sender address
  - recipient: the receiver of the transfer (the recipient)
  - recipientName: the name for this recipient address
  - holder: the address of the holder of the asset
  - holderName: the name for this holder address
  - decimals: the number of decimal places in the asset units
  - amount: the amount of this transfer (use sender/receiver to assertain direction)

- **Withdrawals Store (7 members)**

  - blockNumber: the number of this block
  - timestamp: the timestamp for this block
  - index: a monotonically increasing zero-based index that increments by 1 per withdrawal to uniquely identify each withdrawal
  - validatorIndex: the validator_index of the validator on the consensus layer the withdrawal corresponds to
  - address: the recipient for the withdrawn ether
  - addressName: the name for this address
  - amount: a nonzero amount of ether given in gwei (1e9 wei)

// EXISTING_CODE
// EXISTING_CODE
