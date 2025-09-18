package validation

import (
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func ValidEmail(input string) error {
	email := strings.TrimSpace(input)
	if email == "" {
		return ValidationError{"email", "cannot be empty"}
	}
	if !emailRegex.MatchString(email) {
		return ValidationError{"email", "invalid format"}
	}
	return nil
}
