import { ReactNode, useEffect, useMemo, useState } from 'react';

import { GetSkinByName } from '@app';
import { usePreferences } from '@hooks';
import {
  CSSVariablesResolver,
  MantineColorScheme,
  MantineColorsTuple,
  MantineProvider,
  createTheme,
} from '@mantine/core';
import { skin } from '@models';
import { Log } from '@utils';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode, loading, lastSkin } = usePreferences();
  const [backendSkin, setBackendSkin] = useState<skin.Skin | null>(null);
  const [_skinError, setSkinError] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>('dark');

  // Load skin from backend
  useEffect(() => {
    async function loadSkin() {
      try {
        setSkinError(null);
        const skinData = await GetSkinByName(lastSkin);
        setBackendSkin(skinData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Log(`Failed to load skin ${lastSkin}: ${errorMessage}`);
        setSkinError(errorMessage);

        // Fallback to default skin
        try {
          const defaultSkin = await GetSkinByName('default');
          setBackendSkin(defaultSkin);
          setSkinError(null);
        } catch (fallbackError) {
          const fallbackMessage =
            fallbackError instanceof Error
              ? fallbackError.message
              : String(fallbackError);
          Log(`Failed to load fallback skin: ${fallbackMessage}`);
          setSkinError(`Unable to load any skins: ${fallbackMessage}`);

          // Create a minimal fallback skin to prevent crashes
          setBackendSkin({
            name: 'emergency',
            displayName: 'Emergency Fallback',
            description: 'Minimal fallback skin',
            isBuiltIn: true,
            primary: [
              '#E7F5FF',
              '#D0EBFF',
              '#A5D8FF',
              '#74C0FC',
              '#339AF0',
              '#228BE6',
              '#1C7ED6',
              '#1971C2',
              '#1864AB',
            ],
            success: [
              '#EBFBEE',
              '#D3F9D8',
              '#B2F2BB',
              '#8CE99A',
              '#51CF66',
              '#40C057',
              '#37B24D',
              '#2F9E44',
              '#2B8A3E',
            ],
            warning: [
              '#FFF9DB',
              '#FFF3BF',
              '#FFEC99',
              '#FFE066',
              '#FFD43B',
              '#FCC419',
              '#FAB005',
              '#F59F00',
              '#F08C00',
            ],
            error: [
              '#FFE3E3',
              '#FFC9C9',
              '#FFA8A8',
              '#FF8787',
              '#FF6B6B',
              '#FF5252',
              '#F03E3E',
              '#E03131',
              '#C92A2A',
            ],
            fontFamily: 'system-ui, sans-serif',
            fontFamilyMono: 'monospace',
            defaultRadius: 'md',
            radius: {
              xs: '0.125rem',
              sm: '0.25rem',
              md: '0.5rem',
              lg: '1rem',
              xl: '2rem',
            },
            shadows: {
              xs: '0 1px 3px rgba(0,0,0,0.1)',
              sm: '0 2px 4px rgba(0,0,0,0.1)',
              md: '0 4px 6px rgba(0,0,0,0.1)',
              lg: '0 8px 12px rgba(0,0,0,0.1)',
              xl: '0 12px 20px rgba(0,0,0,0.1)',
            },
            defaultGradient: { from: '#000000', to: '#ffffff', deg: 45 },
            autoContrast: true,
            smallSize: '0.75rem',
            normalSize: '1rem',
          } as skin.Skin);
        }
      }
    }

    loadSkin();
  }, [lastSkin]);

  // Use isDarkMode to control Mantine's color scheme independently of skin
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Convert backend color arrays to Mantine ColorsTuple with optional reversal
  const createColorTuple = (
    colors: string[] | null | undefined,
    reversed = false,
  ): MantineColorsTuple => {
    // Handle null/undefined colors with a fallback
    const safeColors = colors || [
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#cccccc',
    ];
    const paddedColors = [...safeColors];
    while (paddedColors.length < 10) {
      paddedColors.push(paddedColors[paddedColors.length - 1] || '#000000');
    }

    // Reverse array for dark mode to maintain semantic meaning
    const orderedColors = reversed
      ? paddedColors.slice(0, 10).reverse()
      : paddedColors.slice(0, 10);

    return orderedColors as unknown as MantineColorsTuple;
  };

  // CSS Variables Resolver for enhanced properties
  const cssVariablesResolver: CSSVariablesResolver = useMemo(() => {
    if (!backendSkin) {
      return () => ({
        variables: {},
        light: {},
        dark: {},
      });
    }

    return () => {
      try {
        const variables = {
          // Typography from backend
          '--mantine-font-family': backendSkin.fontFamily,
          '--mantine-font-family-monospace': backendSkin.fontFamilyMono,

          // Radius from backend
          '--mantine-radius-default': backendSkin.defaultRadius,
          '--mantine-radius-xs': backendSkin.radius?.xs || '0.125rem',
          '--mantine-radius-sm': backendSkin.radius?.sm || '0.25rem',
          '--mantine-radius-md': backendSkin.radius?.md || '0.5rem',
          '--mantine-radius-lg': backendSkin.radius?.lg || '1rem',
          '--mantine-radius-xl': backendSkin.radius?.xl || '2rem',

          // Shadows from backend
          '--mantine-shadow-xs':
            backendSkin.shadows?.xs || '0 1px 3px rgba(0,0,0,0.1)',
          '--mantine-shadow-sm':
            backendSkin.shadows?.sm || '0 2px 4px rgba(0,0,0,0.1)',
          '--mantine-shadow-md':
            backendSkin.shadows?.md || '0 4px 6px rgba(0,0,0,0.1)',
          '--mantine-shadow-lg':
            backendSkin.shadows?.lg || '0 8px 12px rgba(0,0,0,0.1)',
          '--mantine-shadow-xl':
            backendSkin.shadows?.xl || '0 12px 20px rgba(0,0,0,0.1)',

          // Font sizes
          '--mantine-font-size-xs': backendSkin.smallSize,
          '--mantine-font-size-sm': backendSkin.smallSize,
          '--mantine-font-size-md': backendSkin.normalSize,
          '--mantine-font-size-lg': backendSkin.normalSize,
          '--mantine-font-size-xl': backendSkin.normalSize,

          // Primary color variations (most important for visual changes)
          '--mantine-primary-color': backendSkin.primary?.[6] || '#339AF0',
          '--mantine-color-primary-text': backendSkin.primary?.[6] || '#339AF0',
          '--mantine-color-primary-filled':
            backendSkin.primary?.[6] || '#339AF0',
          '--mantine-color-primary-filled-hover':
            backendSkin.primary?.[7] || '#1c7ed6',

          // Custom skin variables for components
          '--skin-primary-background': backendSkin.primary?.[1] || '#E7F5FF',
          '--skin-primary-text': backendSkin.primary?.[8] || '#1864AB',
          '--skin-header-background': backendSkin.primary?.[1] || '#E7F5FF',
          '--skin-header-border': backendSkin.primary?.[3] || '#A5D8FF',
          '--skin-accent-color': backendSkin.primary?.[6] || '#339AF0',

          // Surface colors
          '--skin-surface-base': backendSkin.primary?.[0] || '#ffffff',
          '--skin-surface-raised': backendSkin.primary?.[1] || '#f8f9fa',
          '--skin-surface-sunken': backendSkin.primary?.[2] || '#e9ecef',
          '--skin-surface-subtle': backendSkin.primary?.[1] || '#f8f9fa',
          '--skin-surface-elevated': '#fffbf0', // Pale yellow for debug/elevated surfaces

          // Text colors
          '--skin-text-primary': backendSkin.primary?.[8] || '#000000',
          '--skin-text-secondary': backendSkin.primary?.[6] || '#495057',
          '--skin-text-dimmed': backendSkin.primary?.[5] || '#6c757d',
          '--skin-text-inverse': backendSkin.primary?.[0] || '#ffffff',

          // Border colors
          '--skin-border-default': backendSkin.primary?.[3] || '#ced4da',
          '--skin-border-subtle': backendSkin.primary?.[2] || '#e9ecef',
          '--skin-border-focus': backendSkin.primary?.[6] || '#339AF0',

          // Interactive colors
          '--skin-primary': backendSkin.primary?.[6] || '#339AF0',
          '--skin-primary-hover': backendSkin.primary?.[7] || '#1c7ed6',
          '--skin-primary-alpha-10':
            backendSkin.primary?.[1] || 'rgba(51, 154, 240, 0.1)',
          '--skin-primary-alpha-50':
            backendSkin.primary?.[4] || 'rgba(51, 154, 240, 0.5)',

          // Status colors
          '--skin-error': '#fa5252',
          '--skin-error-background': '#fff5f5',
          '--skin-success': '#51cf66',
          '--skin-success-background': '#f3f9f3',
          '--skin-warning': '#fd7e14',
          '--skin-warning-background': '#fff4e6',
        };

        return {
          variables,
          light: {
            // Light mode: use skin colors as-is
            '--mantine-color-body': backendSkin.primary?.[0] || '#ffffff',
            '--mantine-color-text': backendSkin.primary?.[8] || '#000000',
          },
          dark: {
            // Dark mode: reverse the skin colors
            '--mantine-color-body': backendSkin.primary?.[8] || '#000000',
            '--mantine-color-text': backendSkin.primary?.[0] || '#ffffff',
          },
        };
      } catch (error) {
        Log(
          `Error in cssVariablesResolver: ${error instanceof Error ? error.message : String(error)}`,
        );
        return {
          variables: {},
          light: {},
          dark: {},
        };
      }
    };
  }, [backendSkin]);

  // Create dynamic theme using backend skin
  const dynamicTheme = useMemo(() => {
    if (!backendSkin) {
      return createTheme({
        primaryColor: 'blue',
      });
    }

    const isDarkMode = colorScheme === 'dark';

    return createTheme({
      primaryColor: 'primary',
      fontFamily: backendSkin.fontFamily,
      fontFamilyMonospace: backendSkin.fontFamilyMono,
      defaultRadius: backendSkin.defaultRadius as
        | 'xs'
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl',
      autoContrast: backendSkin.autoContrast,
      colors: {
        // Map skin arrays to Mantine color names with reversal for dark mode
        primary: createColorTuple(backendSkin.primary, isDarkMode),
        success: createColorTuple(backendSkin.success, isDarkMode),
        warning: createColorTuple(backendSkin.warning, isDarkMode),
        error: createColorTuple(backendSkin.error, isDarkMode),
        gray: createColorTuple(backendSkin.primary, isDarkMode),
        green: createColorTuple(backendSkin.success, isDarkMode),
        yellow: createColorTuple(backendSkin.warning, isDarkMode),
        red: createColorTuple(backendSkin.error, isDarkMode),
        blue: createColorTuple(backendSkin.primary, isDarkMode),
        orange: createColorTuple(backendSkin.warning, isDarkMode),
      },
      defaultGradient: {
        from: (backendSkin.defaultGradient?.from as string) || '#000000',
        to: (backendSkin.defaultGradient?.to as string) || '#ffffff',
        deg: (backendSkin.defaultGradient?.deg as number) || 45,
      },
      other: {
        backendSkin,
      },
    });
  }, [backendSkin, colorScheme]);

  // Don't render until skin is loaded
  if (loading || !backendSkin) {
    return <div>Loading theme...</div>;
  }

  return (
    <MantineProvider
      key={backendSkin.name} // Force re-mount when skin changes
      theme={dynamicTheme}
      forceColorScheme={colorScheme === 'auto' ? undefined : colorScheme}
      cssVariablesResolver={cssVariablesResolver}
    >
      {children}
    </MantineProvider>
  );
};
