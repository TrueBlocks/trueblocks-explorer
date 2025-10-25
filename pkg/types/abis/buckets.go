// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *AbisCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	var facet types.BucketInterface

	switch payload.DataFacet {
	case AbisDownloaded:
		facet = c.downloadedFacet
	case AbisKnown:
		facet = c.knownFacet
	case AbisFunctions:
		facet = c.functionsFacet
	case AbisEvents:
		facet = c.eventsFacet
	default:
		return &types.Buckets{
			Series:   make(map[string][]types.Bucket),
			GridInfo: types.NewGridInfo(),
		}, nil
	}

	buckets := facet.GetBuckets()
	// EXISTING_CODE
	// EXISTING_CODE
	return buckets, nil
}

// EXISTING_CODE
// EXISTING_CODE
