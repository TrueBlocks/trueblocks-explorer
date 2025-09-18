package names

import "strings"

func (c *NamesCollection) matchesAllFilter(name *Name, filter string) bool {
	return c.matchesFilter(name, filter)
}

func (c *NamesCollection) matchesCustomFilter(name *Name, filter string) bool {
	return c.matchesFilter(name, filter)
}

func (c *NamesCollection) matchesPrefundFilter(name *Name, filter string) bool {
	return c.matchesFilter(name, filter)
}

func (c *NamesCollection) matchesRegularFilter(name *Name, filter string) bool {
	return c.matchesFilter(name, filter)
}

func (c *NamesCollection) matchesBaddressFilter(name *Name, filter string) bool {
	return c.matchesFilter(name, filter)
}

func (c *NamesCollection) matchesFilter(name *Name, filter string) bool {
	filterLower := strings.ToLower(filter)

	addressHex := strings.ToLower(name.Address.Hex())
	addressNoPrefix := strings.TrimPrefix(addressHex, "0x")
	addressNoLeadingZeros := strings.TrimLeft(addressNoPrefix, "0")

	if strings.Contains(addressHex, filterLower) ||
		strings.Contains(addressNoPrefix, filterLower) ||
		strings.Contains(addressNoLeadingZeros, filterLower) {
		return true
	}

	if strings.Contains(strings.ToLower(name.Name), filterLower) {
		return true
	}

	if strings.Contains(strings.ToLower(name.Tags), filterLower) {
		return true
	}

	if strings.Contains(strings.ToLower(name.Source), filterLower) {
		return true
	}

	if strings.HasPrefix(filterLower, "0x") {
		fNoPrefix := strings.TrimPrefix(filterLower, "0x")
		if strings.Contains(addressNoPrefix, fNoPrefix) || strings.Contains(addressNoLeadingZeros, fNoPrefix) {
			return true
		}
	}

	return false
}
