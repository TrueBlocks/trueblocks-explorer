package types

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

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
	_ = typeName // delint
	if len(data) == 0 {
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
			// Skip items that don't implement sdk.Modeler interface
			_ = i // Use i to avoid unused variable error
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

// writeCSVHeaderWithNoData writes the CSV header and a "no data" message for empty datasets
func writeCSVHeaderWithNoData[T any](file *os.File, typeName string, format string) error {
	delimiter := ","
	if format == "txt" {
		delimiter = "\t"
	}

	// Create a dummy instance to get the header structure
	var dummy T
	dummyPtr := &dummy
	if modeler, ok := interface{}(dummyPtr).(sdk.Modeler); ok {
		model := modeler.Model("csv", "", false, map[string]any{})
		if len(model.Order) > 0 {
			header := strings.Join(model.Order, delimiter)
			_, err := file.WriteString(header + "\n")
			if err != nil {
				return fmt.Errorf("failed to write CSV header: %w", err)
			}
		}
	}

	_, err := fmt.Fprintf(file, "# No %s data available\n", typeName)
	return err
}

// writeDataToCSV writes typed data to a CSV or TXT file using Model() method
func writeDataToCSV[T any](file *os.File, data []T, typeName string, format string) error {
	delimiter := ","
	if format == "txt" {
		delimiter = "\t"
	}

	if len(data) == 0 {
		return writeCSVHeaderWithNoData[T](file, typeName, format)
	}

	var models []sdk.Model
	for i, item := range data {
		itemPtr := &item
		if modeler, ok := interface{}(itemPtr).(sdk.Modeler); ok {
			model := modeler.Model("csv", "", false, map[string]any{})
			models = append(models, model)
		} else {
			// Skip items that don't implement sdk.Modeler interface
			_ = i // Use i to avoid unused variable error
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
