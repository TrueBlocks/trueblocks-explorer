<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Dresses View

Welcome to the **Dresses** view! This section provides information about managing dresses in your application.

## Facets

- Generator Facet uses the DalleDress store.
- Series Facet uses the Series store.
- Databases Facet uses the Databases store.
- Items Facet uses the Items store.
- Events Facet uses the Logs store.
- Gallery Facet uses the DalleDress store.

## Stores

- **DalleDress Store (21 members)**

  - original: The original value
  - originalName: the name for this address
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

- **Items Store (4 members)**

  - index: the item's ordering in the file
  - databaseName: the name of the database this item belongs to
  - value: the entire line of data as a string
  - remainder: the remainder of the record (different per database)

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

- **Series Store (14 members)**

  - suffix: Series identifier
  - last: Last used index
  - deleted: Deletion status
  - modifiedAt: Last modified timestamp
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

// EXISTING_CODE
// EXISTING_CODE
