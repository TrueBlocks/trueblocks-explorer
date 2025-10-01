package types

// DeriveFacets populates Columns and DetailPanels from Fields when present.
// It preserves existing Columns/DetailPanels if Fields is empty.
func DeriveFacets(vc *ViewConfig) {
	if vc == nil || vc.Facets == nil {
		return
	}
	for key, facet := range vc.Facets {
		if len(facet.Fields) == 0 {
			continue
		}
		cols := make([]ColumnConfig, 0, len(facet.Fields))
		panelsMap := map[string][]DetailFieldConfig{}

		for _, f := range facet.Fields {
			if !f.NoTable {
				header := f.ColumnLabel
				cols = append(cols, ColumnConfig{
					Key:       f.Key,
					Header:    header,
					Width:     f.Width,
					Sortable:  f.Sortable,
					Formatter: f.Formatter,
					Order:     f.Order,
				})
			}
			if !f.NoDetail {
				sec := f.Section
				if sec == "" {
					sec = "General"
				}
				label := f.DetailLabel
				panelsMap[sec] = append(panelsMap[sec], DetailFieldConfig{
					Key:         f.Key,
					Label:       label,
					Formatter:   f.Formatter,
					DetailOrder: f.DetailOrder,
				})
			}
		}

		// Build panel list preserving insertion order of sections by first appearance in Fields
		sectionOrder := make([]string, 0, len(panelsMap))
		seen := map[string]bool{}
		for _, f := range facet.Fields {
			if f.NoDetail {
				continue
			}
			sec := f.Section
			if sec == "" {
				sec = "General"
			}
			if !seen[sec] {
				seen[sec] = true
				sectionOrder = append(sectionOrder, sec)
			}
		}

		panels := make([]DetailPanelConfig, 0, len(sectionOrder))
		for _, sec := range sectionOrder {
			panels = append(panels, DetailPanelConfig{
				Title:  sec,
				Fields: panelsMap[sec],
			})
		}

		facet.Columns = cols
		facet.DetailPanels = panels
		vc.Facets[key] = facet
	}
}
