package validation

import (
	"net/url"
	"strings"
)

func ValidRPC(input string) error {
	str := strings.TrimSpace(input)
	if str == "" {
		return ValidationError{"rpc", "cannot be empty"}
	}

	u, err := url.Parse(str)
	if err != nil {
		return ValidationError{"rpc", "not a valid URL"}
	}
	if u.Scheme == "" || u.Host == "" {
		return ValidationError{"rpc", "must include scheme and host"}
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return ValidationError{"rpc", "must begin with http or https"}
	}

	return nil
}
