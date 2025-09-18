package preferences

import "testing"

func SetConfigBaseForTest(t *testing.T, path string) func() {
	t.Helper()
	original := configBase
	configBase = path
	return func() {
		configBase = original
	}
}
