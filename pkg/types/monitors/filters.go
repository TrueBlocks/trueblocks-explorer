package monitors

import (
	"fmt"
	"strings"
)

func (c *MonitorsCollection) matchesMonitorFilter(monitor *Monitor, filter string) bool {
	if filter == "" {
		return true
	}

	filterLower := strings.ToLower(filter)

	addressHex := strings.ToLower(monitor.Address.Hex())
	addressNoPrefix := strings.TrimPrefix(addressHex, "0x")
	addressNoLeadingZeros := strings.TrimLeft(addressNoPrefix, "0")

	if strings.Contains(addressHex, filterLower) ||
		strings.Contains(addressNoPrefix, filterLower) ||
		strings.Contains(addressNoLeadingZeros, filterLower) {
		return true
	}

	if strings.Contains(strings.ToLower(monitor.Name), filterLower) {
		return true
	}

	if strings.Contains(fmt.Sprintf("%d", monitor.NRecords), filterLower) ||
		strings.Contains(fmt.Sprintf("%d", monitor.FileSize), filterLower) ||
		strings.Contains(fmt.Sprintf("%d", monitor.LastScanned), filterLower) {
		return true
	}

	if monitor.IsEmpty && strings.Contains("empty", filterLower) {
		return true
	}
	if monitor.IsStaged && strings.Contains("staged", filterLower) {
		return true
	}
	if monitor.Deleted && strings.Contains("deleted", filterLower) {
		return true
	}

	return false
}
