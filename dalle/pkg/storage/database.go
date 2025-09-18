package storage

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	_ "embed"
	"errors"
	"io"
	"path/filepath"
	"strings"
)

//go:embed databases.tar.gz
var embeddedDbs []byte

// ReadDatabaseCSV extracts the named CSV file from the embedded .tar.gz and returns its lines.
func ReadDatabaseCSV(name string) ([]string, error) {
	gzr, err := gzip.NewReader(bytes.NewReader(embeddedDbs))
	if err != nil {
		return nil, err
	}
	defer func() { _ = gzr.Close() }()

	tr := tar.NewReader(gzr)
	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break // End of archive
		}
		if err != nil {
			return nil, err
		}
		needle := filepath.Join("databases", name)
		if hdr.Name == needle {
			// Limit decompression to 5MB per file to mitigate decompression bomb DoS (gosec G110)
			const maxDecompressedSize = 5 * 1024 * 1024
			var buf bytes.Buffer
			lr := &io.LimitedReader{R: tr, N: maxDecompressedSize + 1}
			if _, err := io.Copy(&buf, lr); err != nil {
				return nil, err
			}
			if lr.N <= 0 { // exceeded limit
				return nil, errors.New("embedded file too large: potential decompression bomb")
			}
			lines := strings.Split(strings.ReplaceAll(buf.String(), "\r\n", "\n"), "\n")
			if len(lines) > 0 && lines[len(lines)-1] == "" {
				lines = lines[:len(lines)-1]
			}
			return lines, nil
		}
	}
	return nil, errors.New("file not found in archive: " + name)
}
