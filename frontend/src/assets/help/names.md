<!--
Copyright 2016, 2026 The Authors. All rights reserved.
Use of this source code is governed by a license that can
be found in the LICENSE file.

Parts of this file were auto generated. Edit only those parts of
the code inside of 'EXISTING_CODE' tags.
-->
# Names View

Welcome to the **Names** view! This section provides information about managing names in your application.

## Facets

- All Facet uses the Names store.
- Custom Facet uses the Names store.
- Prefund Facet uses the Names store.
- Regular Facet uses the Names store.
- Baddress Facet uses the Names store.

## Stores

- **Names Store (15 members)**

  - address: the address associated with this name
  - addressName: the name for this address
  - name: the name associated with this address
  - symbol: the symbol for this address
  - decimals: number of decimals retrieved from an ERC20 smart contract
  - source: user supplied source of where this name was found
  - tags: colon separated list of tags
  - deleted: if deleted
  - isContract: if the address is a smart contract
  - isCustom: if the address is a custom address
  - isErc20: if the address is an ERC20
  - isErc721: if the address is an ERC721
  - isPrefund: if the address was one of the prefund addresses, `false` otherwise
  - prefund: the prefund amount for this address
  - parts: parts of the name

// EXISTING_CODE
# Names Management

Welcome to the **Names** view! This section allows you to manage address names and their associated metadata.

## Overview

The Names view provides a comprehensive interface for managing address names, which are human-readable labels associated with Ethereum addresses. This helps you identify and organize addresses across different categories.

## Tabs Overview

1. **All**: Displays all names across all categories
2. **Custom**: User-created custom names for addresses
3. **Prefund**: Genesis and pre-funding addresses
4. **Regular**: Standard addresses with names
5. **Baddress**: Flagged or problematic addresses

## Features

### View and Search

- Browse names by category using the tabs
- Search and filter names by address, name, or other fields
- Sort by any column (address, name, tags, source, etc.)

### CRUD Operations

- **Create**: Add new custom names for addresses
- **Update**: Edit existing name information
- **Delete/Undelete**: Soft delete/restore names
- **Remove**: Permanently remove names
- **Autoname**: Automatically generate names for addresses

### Data Fields

- **Address**: The Ethereum address (40-character hex string)
- **Name**: Human-readable name for the address
- **Tags**: Categorization tags
- **Source**: Where the name originated (Chifra, custom, etc.)
- **Symbol**: Token symbol (if applicable)
- **Decimals**: Token decimal places (if applicable)
- **Description**: Additional information about the address

## Actions

Use the action buttons to manage names:

- **Delete**: Soft delete a name (can be restored)
- **Undelete**: Restore a previously deleted name
- **Remove**: Permanently remove a name from the system
- **Autoname**: Attempt to automatically generate a name

## Tips

- Custom names are stored locally and persist across sessions
- Prefund addresses are historical genesis addresses
- Use tags to organize and categorize your custom names
- The source field indicates where the name data originated

For further assistance, please contact support.

// EXISTING_CODE
