<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Dresses View

// EXISTING_CODE
// EXISTING_CODE

## Facets

- Generator Facet uses the DalleDress store.
- Series Facet uses the Series store.
- Databases Facet uses the Databases store.
- Events Facet uses the Logs store.
- Gallery Facet uses the DalleDress store.

## Stores

- **DalleDress Store (20 members)**

  - original: The original value
  - fileName: The fileName value
  - seed: The seed value
  - prompt: The prompt value
  - dataPrompt: The dataPrompt value
  - titlePrompt: The titlePrompt value
  - tersePrompt: The tersePrompt value
  - enhancedPrompt: The enhancedPrompt value
  - attributes: The attributes value
  - seedChunks: The seedChunks value
  - selectedTokens: The selectedTokens value
  - selectedRecords: The selectedRecords value
  - imageUrl: The imageUrl value
  - generatedPath: The generatedPath value
  - annotatedPath: The annotatedPath value
  - downloadMode: The downloadMode value
  - ipfsHash: The ipfsHash value
  - cacheHit: The cacheHit value
  - completed: The completed value
  - series: The series value

- **Databases Store (4 members)**

  - databaseName: Name of the database
  - count: Number of entries
  - sample: Sample entry
  - filtered: Is database filtered by series

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

- **Series Store (14 members)**

  - suffix: Series identifier
  - last: Last used index
  - adverbs: List of adverbs
  - adjectives: List of adjectives
  - nouns: List of nouns
  - emotions: List of emotions
  - artstyles: List of art styles
  - colors: List of colors
  - viewpoints: List of viewpoints
  - gazes: List of gazes
  - backstyles: List of back styles
  - compositions: List of compositions
  - createdAt: Creation timestamp
  - modifiedAt: Last modified timestamp

// EXISTING_CODE
// EXISTING_CODE
