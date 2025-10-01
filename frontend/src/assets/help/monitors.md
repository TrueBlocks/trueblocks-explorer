<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Monitors View

// EXISTING_CODE
// EXISTING_CODE

## Facets

- Monitors Facet uses the Monitors store.

## Stores

- **Monitors Store (8 members)**

  - address: the address of this monitor
  - name: the name of this monitor (if any)
  - nRecords: the number of appearances for this monitor
  - fileSize: the size of this monitor on disc
  - isEmpty: true if the monitor has no appearances
  - lastScanned: the last scanned block number
  - deleted: if this monitor has been deleted, `false` otherwise
  - isStaged: if the monitor file in on the stage, `false` otherwise

// EXISTING_CODE
// EXISTING_CODE
