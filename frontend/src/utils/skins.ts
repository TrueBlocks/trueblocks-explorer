/**
 * Skin system for the app
 * Centralizes colors and visual styling for easy theming
 */

export interface Skin {
  // Base colors
  background: string; // Main app background
  textPrimary: string; // Primary text color
  textSecondary: string; // Muted/dimmed text

  // Interactive elements
  primary: string; // Main accent color (blue)
  primaryHover: string; // Primary color on hover
  primarySelected: string; // Selected item background
  primarySelectedBorder: string; // Selected item border

  // UI elements
  surface: string; // Card/modal backgrounds
  border: string; // Default border color
  inputBackground: string; // Form input backgrounds

  // State colors
  hover: string; // General hover state
  focus: string; // Focus outline
  disabled: string; // Disabled elements
}

/**
 * Dark Mode skin - Based on Mantine dark mode defaults
 */
export const darkModeSkin: Skin = {
  // Mantine dark mode colors
  background: '#1A1B1E', // Mantine dark.7
  textPrimary: '#C1C2C5', // Mantine dark.0
  textSecondary: '#909296', // Mantine dark.2

  // Interactive elements - Mantine blue defaults
  primary: '#339AF0', // Mantine blue.5
  primaryHover: '#228BE6', // Mantine blue.6
  primarySelected: 'rgba(51,154,240,0.15)', // Blue with transparency
  primarySelectedBorder: '#339AF0', // Mantine blue.5

  // UI surfaces
  surface: '#25262B', // Mantine dark.6
  border: '#373A40', // Mantine dark.4
  inputBackground: '#2C2E33', // Mantine dark.5

  // States
  hover: 'rgba(51,154,240,0.1)', // Light blue hover
  focus: '#339AF0', // Mantine blue.5
  disabled: '#5C5F66', // Mantine dark.3
};

/**
 * Light Mode skin - Based on Mantine light mode defaults
 */
export const lightModeSkin: Skin = {
  // Mantine light mode colors
  background: '#FFFFFF', // Pure white
  textPrimary: '#000000', // Pure black
  textSecondary: '#868E96', // Mantine gray.6

  // Interactive elements - Mantine blue defaults
  primary: '#339AF0', // Mantine blue.5
  primaryHover: '#228BE6', // Mantine blue.6
  primarySelected: 'rgba(51,154,240,0.15)', // Blue with transparency
  primarySelectedBorder: '#339AF0', // Mantine blue.5

  // UI surfaces
  surface: '#F8F9FA', // Mantine gray.0
  border: '#DEE2E6', // Mantine gray.3
  inputBackground: '#FFFFFF', // Pure white

  // States
  hover: 'rgba(51,154,240,0.1)', // Light blue hover
  focus: '#339AF0', // Mantine blue.5
  disabled: '#ADB5BD', // Mantine gray.5
};

/**
 * Yellow Belly skin - YELLOW TESTING THEME
 */
export const yellowBellySkin: Skin = {
  // Testing colors - bright and obvious
  background: '#FFEB3B', // Bright yellow background
  textPrimary: '#5D4037', // Brown text
  textSecondary: '#8D6E63', // Lighter brown for secondary text

  // Interactive elements - keeping blue for visibility
  primary: '#2196F3', // Blue for contrast against yellow
  primaryHover: '#1976D2', // Darker blue hover
  primarySelected: 'rgba(33,150,243,0.2)', // Light blue selection
  primarySelectedBorder: '#2196F3', // Blue border

  // UI surfaces
  surface: '#FFF9C4', // Light yellow for cards/modals
  border: '#8D6E63', // Brown borders
  inputBackground: '#FFFFFF', // White inputs for readability

  // States
  hover: 'rgba(33,150,243,0.1)', // Light blue hover
  focus: '#2196F3', // Blue focus ring
  disabled: '#BCAAA4', // Light brown disabled
};

/**
 * Blue Sky skin - White text on blue background
 */
export const blueSky: Skin = {
  // Blue theme colors
  background: '#1565C0', // Deep blue background
  textPrimary: '#FFFFFF', // White text
  textSecondary: '#E3F2FD', // Light blue for secondary text

  // Interactive elements
  primary: '#FF5722', // Orange for contrast against blue
  primaryHover: '#E64A19', // Darker orange hover
  primarySelected: 'rgba(255,87,34,0.2)', // Light orange selection
  primarySelectedBorder: '#FF5722', // Orange border

  // UI surfaces
  surface: '#1976D2', // Lighter blue for cards/modals
  border: '#90CAF9', // Light blue borders
  inputBackground: '#FFFFFF', // White inputs for readability

  // States
  hover: 'rgba(255,87,34,0.1)', // Light orange hover
  focus: '#FF5722', // Orange focus ring
  disabled: '#9E9E9E', // Gray disabled
};

/**
 * Available skins
 */
export const availableSkins = {
  darkMode: darkModeSkin,
  lightMode: lightModeSkin,
  yellowBelly: yellowBellySkin,
  blueSky: blueSky,
} as const;

export type SkinName = keyof typeof availableSkins;
