package chunks

import (
	"fmt"
	"strings"
)

func (c *ChunksCollection) matchesStatsFilter(stat *Stats, filter string) bool {
	filterLower := strings.ToLower(filter)

	// Filter by various fields in ChunkStats
	if strings.Contains(strings.ToLower(stat.Range), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", stat.NAddrs)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", stat.NApps)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", stat.NBlocks)), filterLower) {
		return true
	}

	return false
}

func (c *ChunksCollection) matchesIndexFilter(index *Index, filter string) bool {
	filterLower := strings.ToLower(filter)

	// Filter by various fields in ChunkIndex
	if strings.Contains(strings.ToLower(index.Range), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(index.Hash.String()), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", index.NAddresses)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", index.NAppearances)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(index.Magic), filterLower) {
		return true
	}

	return false
}

func (c *ChunksCollection) matchesBloomFilter(bloom *Bloom, filter string) bool {
	filterLower := strings.ToLower(filter)

	// Filter by various fields in ChunkBloom
	if strings.Contains(strings.ToLower(bloom.Range), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(bloom.Hash.String()), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", bloom.NBlooms)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(fmt.Sprintf("%d", bloom.NInserted)), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(bloom.Magic), filterLower) {
		return true
	}

	return false
}

func (c *ChunksCollection) matchesManifestFilter(manifest *Manifest, filter string) bool {
	filterLower := strings.ToLower(filter)

	// Filter by various fields in ChunkManifest
	if strings.Contains(strings.ToLower(manifest.Version), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(manifest.Chain), filterLower) {
		return true
	}
	if strings.Contains(strings.ToLower(manifest.Specification.String()), filterLower) {
		return true
	}

	return false
}
