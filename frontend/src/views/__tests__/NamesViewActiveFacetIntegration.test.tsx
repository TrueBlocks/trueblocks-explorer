import { DataFacet, DataFacetConfig, useActiveFacet } from '@hooks';
import { setupWailsMocks } from '@mocks';
import { types } from '@models';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the focused hooks (no duplication - individual setup)
vi.mock('../../hooks/useActiveProject', () => ({
  useActiveProject: vi.fn(),
}));

vi.mock('../../hooks/usePreferences', () => ({
  usePreferences: vi.fn(),
}));

const { useActiveProject } = await import('../../hooks/useActiveProject');
const { usePreferences } = await import('../../hooks/usePreferences');

const mockedUseActiveProject = vi.mocked(useActiveProject);
const mockedUsePreferences = vi.mocked(usePreferences);

describe('Names View + useActiveFacet Integration Tests', () => {
  let mockLastFacetMap: Record<string, types.DataFacet>;
  let mockSetLastFacet: ReturnType<typeof vi.fn>;
  const namesFacets: DataFacetConfig[] = [
    {
      id: 'all' as DataFacet,
      label: 'All',
    },
    {
      id: 'custom' as DataFacet,
      label: 'Custom',
    },
    {
      id: 'prefund' as DataFacet,
      label: 'Prefund',
    },
    {
      id: 'regular' as DataFacet,
      label: 'Regular',
    },
    {
      id: 'baddress' as DataFacet,
      label: 'Bad Addresses',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up Wails mocks to prevent bridge errors
    setupWailsMocks();

    // Mock successful project state
    mockLastFacetMap = {};
    mockSetLastFacet = vi.fn();

    // Mock useActiveProject (project context)
    mockedUseActiveProject.mockReturnValue({
      lastFacetMap: mockLastFacetMap,
      setLastFacet: mockSetLastFacet,
      setViewAndFacet: vi.fn(),
      getLastFacet: vi.fn((view: string) => {
        const vR = view.replace(/^\/+/, '');
        return mockLastFacetMap[vR] || '';
      }),
      activeChain: 'mainnet',
      activeAddress: '0x123',
      activeContract: '0x52df6e4d9989e7cf4739d687c765e75323a1b14c',
      loading: false,
      effectiveAddress: '0x123',
      effectiveChain: 'mainnet',
      lastProject: 'test-project',
      lastView: 'names',
      setActiveAddress: vi.fn(),
      setActiveChain: vi.fn(),
      setActiveContract: vi.fn(),
      setLastView: vi.fn(),
      switchProject: vi.fn(),
      hasActiveProject: true,
      canExport: true,
      // Add missing project management properties
      projects: [],
      newProject: vi.fn(),
      openProjectFile: vi.fn(),
      closeProject: vi.fn(),
      clearActiveProject: vi.fn(),
      refreshProjects: vi.fn(),
      activePeriod: '',
      setActivePeriod: function (_period: string): Promise<void> {
        throw new Error('Function not implemented.');
      },
    });

    // Mock usePreferences (theme, language, debug)
    mockedUsePreferences.mockReturnValue({
      lastTheme: 'dark',
      lastSkin: 'default',
      lastLanguage: 'en',
      debugCollapsed: true,
      menuCollapsed: false,
      helpCollapsed: false,
      chromeCollapsed: false,
      detailCollapsed: true,
      isDarkMode: true,
      loading: false,
      toggleTheme: vi.fn(),
      setSkin: vi.fn(),
      changeLanguage: vi.fn(),
      setDebugCollapsed: vi.fn(),
      setMenuCollapsed: vi.fn(),
      setHelpCollapsed: vi.fn(),
      setChromeCollapsed: vi.fn(),
      setDetailCollapsed: vi.fn(),
    });
  });

  describe('useActiveFacet hook behavior with Names facets', () => {
    it('returns correct default values for Names view', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      expect(result.current.activeFacet).toBe('all');
      expect(result.current.getCurrentDataFacet()).toBe('all');
      expect(result.current.availableFacets).toHaveLength(5);
    });

    it('maintains facet consistency across state changes', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      // Initial state (should be first facet since no saved preference)
      expect(result.current.activeFacet).toBe('all');

      // Change to prefund facet
      act(() => {
        result.current.setActiveFacet('prefund' as DataFacet);
      });

      // Verify the preference was set correctly
      expect(mockSetLastFacet).toHaveBeenCalledWith('names', 'prefund');

      // Update mock to simulate preference persistence
      mockLastFacetMap['names'] = 'prefund' as types.DataFacet;

      // Re-render hook with updated preferences
      const { result: result2 } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      expect(result2.current.activeFacet).toBe('prefund');
      expect(result2.current.getCurrentDataFacet()).toBe('prefund');
    });

    it('respects saved preferences for Names view', () => {
      mockLastFacetMap['names'] = 'custom' as types.DataFacet;

      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      expect(result.current.activeFacet).toBe('custom');
      expect(result.current.getCurrentDataFacet()).toBe('custom');
    });

    it('persists facet changes to preferences', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      act(() => {
        result.current.setActiveFacet('baddress' as DataFacet);
      });

      expect(mockSetLastFacet).toHaveBeenCalledWith('names', 'baddress');
    });

    it('handles all Names view facets correctly', () => {
      // Test each facet individually with fresh hook instances
      const facetMappings = [
        { facet: 'all', dataFacet: 'all' },
        { facet: 'custom', dataFacet: 'custom' },
        { facet: 'prefund', dataFacet: 'prefund' },
        { facet: 'regular', dataFacet: 'regular' },
        { facet: 'baddress', dataFacet: 'baddress' },
      ];

      facetMappings.forEach(({ facet, dataFacet }) => {
        // Set up mock with this facet as saved preference
        mockLastFacetMap['names'] = dataFacet as types.DataFacet;

        const { result } = renderHook(() =>
          useActiveFacet({
            facets: namesFacets,
            viewRoute: 'names',
          }),
        );

        expect(result.current.activeFacet).toBe(facet);
        expect(result.current.getCurrentDataFacet()).toBe(dataFacet);
      });
    });
  });

  describe('error handling and edge cases', () => {
    it('handles invalid facet selection gracefully', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      act(() => {
        result.current.setActiveFacet('invalid-facet' as DataFacet);
      });

      // Should remain on default facet
      expect(result.current.activeFacet).toBe('all');
    });
  });

  describe('integration with Names view constants and patterns', () => {
    it('provides all expected Names facets', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      const facetIds = result.current.availableFacets.map((f: any) => f.id);
      expect(facetIds).toEqual([
        'all',
        'custom',
        'prefund',
        'regular',
        'baddress',
      ]);

      const facetLabels = result.current.availableFacets.map(
        (f: any) => f.label,
      );
      expect(facetLabels).toEqual([
        'All',
        'Custom',
        'Prefund',
        'Regular',
        'Bad Addresses',
      ]);
    });

    it('matches expected Names view route pattern', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          facets: namesFacets,
          viewRoute: 'names',
        }),
      );

      // Test that route is correctly handled internally
      act(() => {
        result.current.setActiveFacet('custom' as DataFacet);
      });

      expect(mockSetLastFacet).toHaveBeenCalledWith('names', 'custom');
    });
  });
});
