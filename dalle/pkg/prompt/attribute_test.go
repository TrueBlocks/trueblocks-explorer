package prompt

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewAttribute_Basic(t *testing.T) {
	dbs := map[string][]string{
		"adverbs":    {"quickly", "slowly", "silently", "loudly"},
		"adjectives": {"red", "blue", "green", "yellow"},
		"nouns":      {"cat", "dog", "bird", "fish"},
	}
	// Use index 0 (adverbs)
	attr := NewAttribute(dbs, 0, "01")
	assert.Equal(t, "adverbs", attr.Database)
	assert.Equal(t, "adverb", attr.Name)
	assert.Equal(t, "01", attr.Bytes)
	assert.Equal(t, uint64(len(dbs["adverbs"])), attr.Count)
	assert.True(t, attr.Selector < uint64(len(dbs["adverbs"])))
	assert.Contains(t, dbs["adverbs"], attr.Value)
}

func TestNewAttribute_SelectorBounds(t *testing.T) {
	dbs := map[string][]string{
		"adverbs": {"a", "b"},
	}
	attr := NewAttribute(dbs, 0, "FFFFFF") // large value, Factor ~1
	assert.Equal(t, uint64(len(dbs["adverbs"])), attr.Count)
	assert.True(t, attr.Selector < uint64(len(dbs["adverbs"])))
	assert.Contains(t, dbs["adverbs"], attr.Value)
}

func TestNewAttribute_DifferentIndexes(t *testing.T) {
	dbs := map[string][]string{
		"adverbs":    {"quickly"},
		"adjectives": {"red"},
		"nouns":      {"cat"},
	}
	for idx, db := range []string{"adverbs", "adjectives", "nouns"} {
		attr := NewAttribute(dbs, idx, "01")
		assert.Equal(t, db, attr.Database)
		assert.Equal(t, DatabaseNames[idx], attr.Database)
		assert.Equal(t, AttributeNames()[idx], attr.Name)
		assert.Contains(t, dbs[db], attr.Value)
	}
}

func TestNewAttribute_SelectorEdge(t *testing.T) {
	dbs := map[string][]string{
		"adverbs": {"a", "b", "c"},
	}
	attr := NewAttribute(dbs, 0, "000000") // Factor = 0
	assert.Equal(t, uint64(0), attr.Selector)
	attr2 := NewAttribute(dbs, 0, "FFFFFF") // Factor ~1
	assert.True(t, attr2.Selector < uint64(len(dbs["adverbs"])))
}
