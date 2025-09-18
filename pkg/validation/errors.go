package validation

import "fmt"

type ValidationError struct {
	Field   string
	Problem string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("invalid %s: %s", e.Field, e.Problem)
}
