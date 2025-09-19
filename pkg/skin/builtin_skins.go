package skin

// createDarkModeSkin creates the default dark mode skin with enhanced visual properties
func createDarkModeSkin() *Skin {
	return &Skin{
		Name:        "darkMode",
		DisplayName: "Dark Mode",
		Description: "Based on Mantine dark mode defaults with enhanced visual properties",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Mantine dark mode color array - dark colors for dark theme
		Primary: []string{
			"#1A1B23", "#25262B", "#2C2E33", "#373A40",
			"#495057", "#6C7293", "#8590A6", "#A6A7AB", "#C1C2C5",
		},
		// Mantine green color array
		Success: []string{
			"#EBFBEE", "#D3F9D8", "#B2F2BB", "#8CE99A",
			"#51CF66", "#40C057", "#37B24D", "#2F9E44", "#2B8A3E",
		},
		// Mantine yellow color array
		Warning: []string{
			"#FFF9DB", "#FFF3BF", "#FFEC99", "#FFE066",
			"#FFD43B", "#FCC419", "#FAB005", "#F59F00", "#F08C00",
		},
		// Mantine red color array
		Error: []string{
			"#FFE3E3", "#FFC9C9", "#FFA8A8", "#FF8787",
			"#FF6B6B", "#FF5252", "#F03E3E", "#E03131", "#C92A2A",
		},
		// Typography - Modern, clean fonts
		FontFamily:     "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		FontFamilyMono: "JetBrains Mono, Consolas, Monaco, Courier New, monospace",
		// Border Radius - Moderate roundness for modern feel
		DefaultRadius: "md",
		Radius: map[string]string{
			"xs": "0.125rem", // 2px
			"sm": "0.25rem",  // 4px
			"md": "0.5rem",   // 8px
			"lg": "1rem",     // 16px
			"xl": "2rem",     // 32px
		},
		// Shadows - Subtle but present for depth
		Shadows: map[string]string{
			"xs": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
			"sm": "0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
			"md": "0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.12)",
			"lg": "0 10px 20px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.12)",
			"xl": "0 15px 30px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.12)",
		},
		// Default gradient - Blue theme
		DefaultGradient: map[string]interface{}{
			"from": "blue.6",
			"to":   "blue.8",
			"deg":  45,
		},
		// Enhanced contrast for accessibility
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.875rem",
		NormalSize: "1rem",
	}
}

// createLightModeSkin creates the default light mode skin with enhanced visual properties
func createLightModeSkin() *Skin {
	return &Skin{
		Name:        "lightMode",
		DisplayName: "Light Mode",
		Description: "Based on Mantine light mode defaults with enhanced visual properties",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Mantine light mode color array - light colors for light theme
		Primary: []string{
			"#F8F9FA", "#F1F3F4", "#E9ECEF", "#DEE2E6",
			"#CED4DA", "#ADB5BD", "#6C757D", "#495057", "#343A40",
		},
		// Same green array
		Success: []string{
			"#EBFBEE", "#D3F9D8", "#B2F2BB", "#8CE99A",
			"#51CF66", "#40C057", "#37B24D", "#2F9E44", "#2B8A3E",
		},
		// Same yellow array
		Warning: []string{
			"#FFF9DB", "#FFF3BF", "#FFEC99", "#FFE066",
			"#FFD43B", "#FCC419", "#FAB005", "#F59F00", "#F08C00",
		},
		// Same red array
		Error: []string{
			"#FFE3E3", "#FFC9C9", "#FFA8A8", "#FF8787",
			"#FF6B6B", "#FF5252", "#F03E3E", "#E03131", "#C92A2A",
		},
		// Typography - Same modern fonts
		FontFamily:     "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		FontFamilyMono: "JetBrains Mono, Consolas, Monaco, Courier New, monospace",
		// Border Radius - Same modern roundness
		DefaultRadius: "md",
		Radius: map[string]string{
			"xs": "0.125rem", // 2px
			"sm": "0.25rem",  // 4px
			"md": "0.5rem",   // 8px
			"lg": "1rem",     // 16px
			"xl": "2rem",     // 32px
		},
		// Shadows - Lighter shadows for light mode
		Shadows: map[string]string{
			"xs": "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.16)",
			"sm": "0 3px 6px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.08)",
			"md": "0 6px 12px rgba(0, 0, 0, 0.10), 0 4px 8px rgba(0, 0, 0, 0.08)",
			"lg": "0 10px 20px rgba(0, 0, 0, 0.10), 0 6px 12px rgba(0, 0, 0, 0.08)",
			"xl": "0 15px 30px rgba(0, 0, 0, 0.10), 0 10px 20px rgba(0, 0, 0, 0.08)",
		},
		// Default gradient - Same blue theme
		DefaultGradient: map[string]interface{}{
			"from": "blue.6",
			"to":   "blue.8",
			"deg":  45,
		},
		// Enhanced contrast for accessibility
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.875rem",
		NormalSize: "1rem",
	}
}

// createYellowBellySkin creates a testing skin with visually distinct properties
func createYellowBellySkin() *Skin {
	return &Skin{
		Name:        "yellowBelly",
		DisplayName: "Yellow Belly",
		Description: "Bright yellow testing theme with unique visual characteristics",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Bright yellow/orange theme
		Primary: []string{
			"#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F",
			"#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00",
		},
		// Green remains green for success
		Success: []string{
			"#E8F5E8", "#C8E6C8", "#A5D6A7", "#81C784",
			"#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32",
		},
		// Amber for warnings
		Warning: []string{
			"#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D",
			"#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00",
		},
		// Deep red for errors
		Error: []string{
			"#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373",
			"#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828",
		},
		// Typography - Fun, readable fonts
		FontFamily:     "Roboto, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
		FontFamilyMono: "Fira Code, 'Courier New', monospace",
		// Border Radius - Very rounded for playful feel
		DefaultRadius: "lg",
		Radius: map[string]string{
			"xs": "0.25rem", // 4px
			"sm": "0.5rem",  // 8px
			"md": "1rem",    // 16px
			"lg": "1.5rem",  // 24px
			"xl": "3rem",    // 48px
		},
		// Shadows - Strong shadows for dramatic effect
		Shadows: map[string]string{
			"xs": "0 2px 4px rgba(255, 193, 7, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)",
			"sm": "0 4px 8px rgba(255, 193, 7, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15)",
			"md": "0 8px 16px rgba(255, 193, 7, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15)",
			"lg": "0 12px 24px rgba(255, 193, 7, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15)",
			"xl": "0 20px 40px rgba(255, 193, 7, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15)",
		},
		// Default gradient - Yellow to orange
		DefaultGradient: map[string]interface{}{
			"from": "yellow.5",
			"to":   "orange.6",
			"deg":  135,
		},
		// Enhanced contrast
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.75rem",
		NormalSize: "1.125rem",
	}
}

// createBlueSky creates a blue sky theme with distinctive visual properties
func createBlueSky() *Skin {
	return &Skin{
		Name:        "blueSky",
		DisplayName: "Blue Sky",
		Description: "Cool blue theme with distinctive visual characteristics",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Cool blue theme
		Primary: []string{
			"#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6",
			"#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0",
		},
		// Teal for success
		Success: []string{
			"#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC",
			"#26A69A", "#009688", "#00897B", "#00796B", "#00695C",
		},
		// Cyan for warnings
		Warning: []string{
			"#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1",
			"#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F",
		},
		// Pink for errors (contrast against blue)
		Error: []string{
			"#FCE4EC", "#F8BBD9", "#F48FB1", "#F06292",
			"#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457",
		},
		// Typography - Clean, technical fonts
		FontFamily:     "Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif",
		FontFamilyMono: "Source Code Pro, Menlo, monospace",
		// Border Radius - Sharp, technical feel
		DefaultRadius: "sm",
		Radius: map[string]string{
			"xs": "0.0625rem", // 1px
			"sm": "0.1875rem", // 3px
			"md": "0.375rem",  // 6px
			"lg": "0.75rem",   // 12px
			"xl": "1.5rem",    // 24px
		},
		// Shadows - Cool blue tinted shadows
		Shadows: map[string]string{
			"xs": "0 1px 3px rgba(33, 150, 243, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
			"sm": "0 3px 6px rgba(33, 150, 243, 0.15), 0 2px 4px rgba(0, 0, 0, 0.10)",
			"md": "0 6px 12px rgba(33, 150, 243, 0.15), 0 4px 8px rgba(0, 0, 0, 0.10)",
			"lg": "0 10px 20px rgba(33, 150, 243, 0.15), 0 6px 12px rgba(0, 0, 0, 0.10)",
			"xl": "0 15px 30px rgba(33, 150, 243, 0.15), 0 10px 20px rgba(0, 0, 0, 0.10)",
		},
		// Default gradient - Blue to indigo
		DefaultGradient: map[string]interface{}{
			"from": "blue.5",
			"to":   "indigo.7",
			"deg":  90,
		},
		// Enhanced contrast
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.8125rem",
		NormalSize: "1rem",
	}
}

// createGreenLandSkin creates a nature-inspired green theme
func createGreenLandSkin() *Skin {
	return &Skin{
		Name:        "greenLand",
		DisplayName: "Green Land",
		Description: "Nature-inspired green theme with earthy tones",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Forest green theme
		Primary: []string{
			"#E8F5E8", "#C8E6C9", "#A5D6A7", "#81C784",
			"#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32",
		},
		// Lime green for success
		Success: []string{
			"#F1F8E9", "#DCEDC8", "#C5E1A5", "#AED581",
			"#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F",
		},
		// Amber for warnings
		Warning: []string{
			"#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F",
			"#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00",
		},
		// Deep red for errors
		Error: []string{
			"#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373",
			"#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828",
		},
		// Typography - Natural, readable fonts
		FontFamily:     "Nunito, -apple-system, BlinkMacSystemFont, sans-serif",
		FontFamilyMono: "Roboto Mono, Monaco, monospace",
		// Border Radius - Organic, soft feel
		DefaultRadius: "lg",
		Radius: map[string]string{
			"xs": "0.25rem", // 4px
			"sm": "0.5rem",  // 8px
			"md": "0.75rem", // 12px
			"lg": "1rem",    // 16px
			"xl": "2rem",    // 32px
		},
		// Shadows - Soft, natural shadows
		Shadows: map[string]string{
			"xs": "0 2px 4px rgba(76, 175, 80, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
			"sm": "0 4px 8px rgba(76, 175, 80, 0.15), 0 2px 4px rgba(0, 0, 0, 0.10)",
			"md": "0 8px 16px rgba(76, 175, 80, 0.15), 0 4px 8px rgba(0, 0, 0, 0.10)",
			"lg": "0 12px 24px rgba(76, 175, 80, 0.15), 0 6px 12px rgba(0, 0, 0, 0.10)",
			"xl": "0 20px 40px rgba(76, 175, 80, 0.15), 0 10px 20px rgba(0, 0, 0, 0.10)",
		},
		// Default gradient - Green to teal
		DefaultGradient: map[string]interface{}{
			"from": "green.5",
			"to":   "teal.6",
			"deg":  120,
		},
		// Enhanced contrast
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.875rem",
		NormalSize: "1rem",
	}
}

// createVioletsSkin creates a luxurious purple theme
func createVioletsSkin() *Skin {
	return &Skin{
		Name:        "violets",
		DisplayName: "Violets",
		Description: "Luxurious purple theme with elegant gradients",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Deep violet theme
		Primary: []string{
			"#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8",
			"#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A",
		},
		// Indigo for success
		Success: []string{
			"#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB",
			"#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593",
		},
		// Deep purple for warnings
		Warning: []string{
			"#EDE7F6", "#D1C4E9", "#B39DDB", "#9575CD",
			"#7E57C2", "#673AB7", "#5E35B1", "#512DA8", "#4527A0",
		},
		// Pink for errors
		Error: []string{
			"#FCE4EC", "#F8BBD9", "#F48FB1", "#F06292",
			"#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457",
		},
		// Typography - Elegant, sophisticated fonts
		FontFamily:     "Playfair Display, Georgia, serif",
		FontFamilyMono: "Fira Code, Consolas, monospace",
		// Border Radius - Elegant curves
		DefaultRadius: "md",
		Radius: map[string]string{
			"xs": "0.1875rem", // 3px
			"sm": "0.375rem",  // 6px
			"md": "0.75rem",   // 12px
			"lg": "1.125rem",  // 18px
			"xl": "2.25rem",   // 36px
		},
		// Shadows - Purple-tinted elegant shadows
		Shadows: map[string]string{
			"xs": "0 2px 4px rgba(156, 39, 176, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
			"sm": "0 4px 8px rgba(156, 39, 176, 0.15), 0 2px 4px rgba(0, 0, 0, 0.10)",
			"md": "0 8px 16px rgba(156, 39, 176, 0.15), 0 4px 8px rgba(0, 0, 0, 0.10)",
			"lg": "0 12px 24px rgba(156, 39, 176, 0.15), 0 6px 12px rgba(0, 0, 0, 0.10)",
			"xl": "0 20px 40px rgba(156, 39, 176, 0.15), 0 10px 20px rgba(0, 0, 0, 0.10)",
		},
		// Default gradient - Purple to pink
		DefaultGradient: map[string]interface{}{
			"from": "purple.6",
			"to":   "pink.7",
			"deg":  135,
		},
		// Enhanced contrast
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.875rem",
		NormalSize: "1rem",
	}
}

// createPinkPonyClubSkin creates a playful pink theme
func createPinkPonyClubSkin() *Skin {
	return &Skin{
		Name:        "pinkPonyClub",
		DisplayName: "Pink Pony Club",
		Description: "Playful pink theme with vibrant accents",
		Author:      "TrueBlocks",
		Version:     "1.0.0",
		IsBuiltIn:   true,
		// Vibrant pink theme
		Primary: []string{
			"#FCE4EC", "#F8BBD9", "#F48FB1", "#F06292",
			"#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457",
		},
		// Teal for success (complementary to pink)
		Success: []string{
			"#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC",
			"#26A69A", "#009688", "#00897B", "#00796B", "#00695C",
		},
		// Orange for warnings
		Warning: []string{
			"#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D",
			"#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00",
		},
		// Deep pink for errors
		Error: []string{
			"#880E4F", "#AD1457", "#C2185B", "#D81B60",
			"#E91E63", "#EC407A", "#F06292", "#F48FB1", "#F8BBD9",
		},
		// Typography - Fun, modern fonts
		FontFamily:     "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
		FontFamilyMono: "JetBrains Mono, Courier New, monospace",
		// Border Radius - Playful, rounded
		DefaultRadius: "xl",
		Radius: map[string]string{
			"xs": "0.375rem", // 6px
			"sm": "0.75rem",  // 12px
			"md": "1rem",     // 16px
			"lg": "1.5rem",   // 24px
			"xl": "3rem",     // 48px
		},
		// Shadows - Bright, colorful shadows
		Shadows: map[string]string{
			"xs": "0 2px 4px rgba(233, 30, 99, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
			"sm": "0 4px 8px rgba(233, 30, 99, 0.15), 0 2px 4px rgba(0, 0, 0, 0.10)",
			"md": "0 8px 16px rgba(233, 30, 99, 0.15), 0 4px 8px rgba(0, 0, 0, 0.10)",
			"lg": "0 12px 24px rgba(233, 30, 99, 0.15), 0 6px 12px rgba(0, 0, 0, 0.10)",
			"xl": "0 20px 40px rgba(233, 30, 99, 0.15), 0 10px 20px rgba(0, 0, 0, 0.10)",
		},
		// Default gradient - Pink to purple
		DefaultGradient: map[string]interface{}{
			"from": "pink.5",
			"to":   "purple.6",
			"deg":  45,
		},
		// Enhanced contrast
		AutoContrast: true,
		// Legacy compatibility
		SmallSize:  "0.875rem",
		NormalSize: "1rem",
	}
}
