package utils

import (
	"testing"
)

func TestValidFilename(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{"file:name.txt", "file_name.txt"},
		{"file/name|test?*<>.txt", "file_name_test__.txt"},
		{"  file  ", "file"},
		{"file__name", "file_name"},
	}
	for _, c := range cases {
		result := ValidFilename(c.input)
		if result != c.expected {
			t.Errorf("validFilename(%q) = %q, want %q", c.input, result, c.expected)
		}
	}
}

func TestReverse(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{"abc", "cba"},
		{"", ""},
		{"a", "a"},
		{"racecar", "racecar"},
		{"12345", "54321"},
	}
	for _, c := range cases {
		result := Reverse(c.input)
		if result != c.expected {
			t.Errorf("reverse(%q) = %q, want %q", c.input, result, c.expected)
		}
	}
}
