<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Abis View

Welcome to the **Abis** view! This section provides information about managing abis in your application.

## Facets

- Downloaded Facet uses the Abis store.
- Known Facet uses the Abis store.
- Functions Facet uses the Functions store.
- Events Facet uses the Functions store.

## Stores

- **Abis Store (11 members)**

  - address: the address for the ABI
  - name: the filename of the ABI (likely the smart contract address)
  - path: the folder holding the abi file
  - nFunctions: the number of functions in the ABI
  - nEvents: the number of events in the ABI
  - fileSize: the size of this file on disc
  - isEmpty: true if the ABI could not be found (and won't be looked for again)
  - isKnown: true if this is the ABI for a known smart contract or protocol
  - hasConstructor: if verbose and the abi has a constructor, then `true`, else `false`
  - hasFallback: if verbose and the abi has a fallback, then `true`, else `false`
  - lastModDate: the last update date of the file

- **Functions Store (10 members)**

  - name: the name of the interface
  - type: the type of the interface, either 'event' or 'function'
  - encoding: the signature encoded with keccak
  - signature: the canonical signature of the interface
  - stateMutability: 
  - constant: 
  - anonymous: 
  - inputs: the input parameters to the function, if any
  - outputs: the output parameters to the function, if any
  - message: 

// EXISTING_CODE
// EXISTING_CODE
