// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.

package types

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// ExportData is the unified export function that handles file creation with proper extension and format
func ExportData[T any](data []T, payload *Payload, typeName string) (string, error) {
	format := payload.Format
	if format == "" {
		format = "csv"
	}

	collection := payload.Collection
	dataFacet := string(payload.DataFacet)
	address := payload.Address

	if payload.ProjectPath == "" {
		return "", fmt.Errorf("project path not provided in payload")
	}

	projectDir := filepath.Dir(payload.ProjectPath)
	projectName := filepath.Base(payload.ProjectPath)
	projectNameWithoutExt := strings.TrimSuffix(projectName, filepath.Ext(projectName))
	outputDirPath := filepath.Join(projectDir, projectNameWithoutExt+".Exports")

	// Construct filename from payload information
	addressPart := "noaddr"
	if address != "" && address != "0x0" {
		if len(address) >= 10 {
			addressPart = address[:6] + "-" + address[len(address)-4:]
		} else {
			addressPart = address
		}
	}

	fileExtension := "." + format
	rawFilename := fmt.Sprintf("%s-%s-%s%s",
		collection,
		dataFacet,
		addressPart,
		fileExtension)

	exportFilename := normalizeFilename(rawFilename, fileExtension)
	finalPath := filepath.Join(outputDirPath, exportFilename)

	dir := filepath.Dir(finalPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return finalPath, fmt.Errorf("failed to create directory: %w", err)
	}

	file, err := os.Create(finalPath)
	if err != nil {
		return finalPath, fmt.Errorf("failed to create file: %w", err)
	}
	defer func() { _ = file.Close() }()

	// Export based on format
	if format == "json" {
		return finalPath, writeDataToJSON(file, data, typeName)
	} else {
		return finalPath, writeDataToCSV(file, data, typeName, format)
	}
}

// normalizeFilename makes the filename OS-valid by removing invalid characters
func normalizeFilename(rawFilename, fileExtension string) string {
	// Remove/replace invalid characters: / \ : * ? " < > |
	filename := strings.ReplaceAll(rawFilename, "/", "-")
	filename = strings.ReplaceAll(filename, "\\", "-")
	filename = strings.ReplaceAll(filename, ":", "-")
	filename = strings.ReplaceAll(filename, "*", "-")
	filename = strings.ReplaceAll(filename, "?", "-")
	filename = strings.ReplaceAll(filename, "\"", "-")
	filename = strings.ReplaceAll(filename, "<", "-")
	filename = strings.ReplaceAll(filename, ">", "-")
	filename = strings.ReplaceAll(filename, "|", "-")

	// Remove leading/trailing spaces and dashes
	filename = strings.Trim(filename, " -")

	// Replace multiple consecutive dashes with single dash
	for strings.Contains(filename, "--") {
		filename = strings.ReplaceAll(filename, "--", "-")
	}

	// Ensure we still have a valid filename after cleaning
	if filename == "" || strings.HasPrefix(filename, ".") {
		filename = "export" + fileExtension
	}

	return filename
}

// writeDataToJSON writes typed data to a JSON file using Model() method
func writeDataToJSON[T any](file *os.File, data []T, typeName string) error {
	logging.LogBackend(fmt.Sprintf("[EXPORT JSON] ===== WriteDataToJSON called for %s =====", typeName))

	if len(data) == 0 {
		logging.LogBackend("[EXPORT JSON] No data to export, writing empty JSON array")
		_, err := file.WriteString("[]")
		return err
	}

	var modelObjects []map[string]interface{}
	for i, item := range data {
		itemPtr := &item
		if modeler, ok := interface{}(itemPtr).(sdk.Modeler); ok {
			model := modeler.Model("json", "", false, map[string]any{})
			// Extract just the Data part of the Model object
			modelObjects = append(modelObjects, model.Data)
		} else {
			logging.LogBackend(fmt.Sprintf("[EXPORT JSON] Item %d of type %s does not implement sdk.Modeler interface", i+1, typeName))
		}
	}

	if len(modelObjects) == 0 {
		_, err := file.WriteString("[]")
		return err
	}

	jsonData, err := json.MarshalIndent(modelObjects, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %w", err)
	}

	_, err = file.Write(jsonData)
	return err
}

// writeDataToCSV writes typed data to a CSV or TXT file using Model() method
func writeDataToCSV[T any](file *os.File, data []T, typeName string, format string) error {
	delimiter := ","
	if format == "txt" {
		delimiter = "\t"
	}

	if len(data) == 0 {
		_, err := fmt.Fprintf(file, "# No %s data available\n", typeName)
		return err
	}

	var models []sdk.Model
	for i, item := range data {
		itemPtr := &item
		if modeler, ok := interface{}(itemPtr).(sdk.Modeler); ok {
			model := modeler.Model("csv", "", false, map[string]any{})
			models = append(models, model)
		} else {
			logging.LogBackend(fmt.Sprintf("[EXPORT CSV] Item %d of type %s does not implement sdk.Modeler interface", i+1, typeName))
		}
	}

	if len(models) == 0 {
		_, err := fmt.Fprintf(file, "# No %s data available\n", typeName)
		return err
	}

	firstModel := models[0]
	if len(firstModel.Order) == 0 {
		return fmt.Errorf("no field order specified for %s", typeName)
	}

	header := strings.Join(firstModel.Order, delimiter)
	_, err := file.WriteString(header + "\n")
	if err != nil {
		return fmt.Errorf("failed to write CSV header: %w", err)
	}

	writer := csv.NewWriter(file)
	if format == "txt" {
		writer.Comma = '\t'
	}
	defer writer.Flush()

	for i, model := range models {
		row := make([]string, len(model.Order))
		for j, fieldName := range model.Order {
			if value, exists := model.Data[fieldName]; exists {
				row[j] = fmt.Sprintf("%v", value)
			} else {
				row[j] = ""
			}
		}

		if err := writer.Write(row); err != nil {
			return fmt.Errorf("failed to write CSV row %d: %w", i+1, err)
		}
	}
	return nil
}
