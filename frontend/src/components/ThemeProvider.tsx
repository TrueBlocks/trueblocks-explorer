import { ReactNode, useEffect, useMemo, useState } from 'react';

import { useSkinContext } from '@contexts';
import { usePreferences } from '@hooks';
import {
  MantineColorScheme,
  MantineProvider,
  createTheme,
} from '@mantine/core';

interface ThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Roman',
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode, loading } = usePreferences();
  const { currentSkin } = useSkinContext();
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>('dark');

  // Create a dynamic theme that integrates our skin colors
  const skinTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        colors: {
          ...theme.colors,
          // Override key Mantine colors with our skin colors
          dark: [
            currentSkin.textPrimary, // text on dark backgrounds
            currentSkin.surface, // lighter surface
            currentSkin.surface, // surface
            currentSkin.border, // border
            currentSkin.border, // border
            currentSkin.background, // main background
            currentSkin.background, // darker background
            currentSkin.background, // darkest background
            currentSkin.background, // body background
            currentSkin.background, // page background
          ],
        },
        other: {
          // Store skin colors for CSS variable access
          skinBackground: currentSkin.background,
          skinTextPrimary: currentSkin.textPrimary,
          skinTextSecondary: currentSkin.textSecondary,
        },
      }),
    [currentSkin],
  );

  // Update Mantine color scheme when app preferences change
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Apply skin colors to CSS variables at the document level
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Apply skin colors as CSS custom properties
    root.style.setProperty('--skin-background', currentSkin.background);
    root.style.setProperty('--skin-text-primary', currentSkin.textPrimary);
    root.style.setProperty('--skin-text-secondary', currentSkin.textSecondary);
    root.style.setProperty('--skin-primary', currentSkin.primary);
    root.style.setProperty('--skin-primary-hover', currentSkin.primaryHover);
    root.style.setProperty(
      '--skin-primary-selected',
      currentSkin.primarySelected,
    );
    root.style.setProperty(
      '--skin-primary-selected-border',
      currentSkin.primarySelectedBorder,
    );
    root.style.setProperty('--skin-surface', currentSkin.surface);
    root.style.setProperty('--skin-border', currentSkin.border);
    root.style.setProperty(
      '--skin-input-background',
      currentSkin.inputBackground,
    );
    root.style.setProperty('--skin-hover', currentSkin.hover);
    root.style.setProperty('--skin-focus', currentSkin.focus);
    root.style.setProperty('--skin-disabled', currentSkin.disabled);

    // Force override the base background and text colors with !important
    root.style.setProperty(
      'background-color',
      `${currentSkin.background} !important`,
    );
    root.style.setProperty('color', `${currentSkin.textPrimary} !important`);

    // Also force body styles to ensure they persist
    body.style.setProperty(
      'background-color',
      `${currentSkin.background} !important`,
    );
    body.style.setProperty('color', `${currentSkin.textPrimary} !important`);

    // Override Mantine's default dark theme colors by setting CSS variables
    root.style.setProperty('--mantine-color-dark-0', currentSkin.textPrimary);
    root.style.setProperty('--mantine-color-dark-6', currentSkin.background);
    root.style.setProperty('--mantine-color-dark-7', currentSkin.background);
    root.style.setProperty('--mantine-color-dark-8', currentSkin.background);
    root.style.setProperty('--mantine-color-dark-9', currentSkin.background);

    // Inject a style element with high-priority overrides
    let styleElement = document.getElementById('skin-override-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'skin-override-styles';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      /* Force skin colors with highest priority */
      html, body, #root, [data-mantine-color-scheme] {
        background-color: ${currentSkin.background} !important;
        color: ${currentSkin.textPrimary} !important;
      }
      
      /* Override Mantine's body background */
      .mantine-AppShell-root, .mantine-AppShell-main {
        background-color: ${currentSkin.background} !important;
        color: ${currentSkin.textPrimary} !important;
      }
    `;
  }, [currentSkin]); // React to skin changes

  // Don't render until preferences are loaded to avoid theme flicker
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MantineProvider theme={skinTheme} defaultColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
};
