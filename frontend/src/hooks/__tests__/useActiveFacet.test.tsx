import { DataFacet, DataFacetConfig, useActiveFacet } from '@hooks';
import { setupWailsMocks } from '@mocks';
import { types } from '@models';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the focused hooks (no duplication - individual setup)
vi.mock('../useActiveProject', () => ({
  useActiveProject: vi.fn(),
}));

vi.mock('../usePreferences', () => ({
  usePreferences: vi.fn(),
}));

const { useActiveProject } = await import('../useActiveProject');
const { usePreferences } = await import('../usePreferences');

const mockedUseActiveProject = vi.mocked(useActiveProject);
const mockedUsePreferences = vi.mocked(usePreferences);

describe('useActiveFacet Hook Tests (Focused Hook implementation)', () => {
  let mockLastFacetMap: Record<string, types.DataFacet>;
  let mockSetLastFacet: ReturnType<typeof vi.fn>;

  const sampleFacets: DataFacetConfig[] = [
    {
      id: 'transactions' as DataFacet,
      label: 'Transactions',
    },
    {
      id: 'receipts' as DataFacet,
      label: 'Receipts',
    },
    {
      id: 'statements' as DataFacet,
      label: 'Statements',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up Wails mocks to prevent bridge errors
    setupWailsMocks();

    mockLastFacetMap = {};
    mockSetLastFacet = vi.fn();

    // Mock useActiveProject (project context)
    mockedUseActiveProject.mockReturnValue({
      lastFacetMap: mockLastFacetMap,
      setLastFacet: mockSetLastFacet,
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
      lastView: 'exports',
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
      setViewAndFacet: function (
        _view: string,
        _facet: types.DataFacet,
      ): Promise<void> {
        throw new Error('Function not implemented.');
      },
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
      fontScale: 1.0,
      showFieldTypes: false,
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
      setFontScale: vi.fn(),
      setShowFieldTypes: vi.fn(),
      getDetailSectionState: vi.fn(),
      setDetailSectionState: vi.fn(),
    });
  });

  describe('initialization and defaults', () => {
    it('should initialize with default facet when no preference saved', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.activeFacet).toBe('transactions');
      expect(result.current.getDefaultFacet()).toBe('transactions');
    });

    it('should use provided default facet override', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.activeFacet).toBe('transactions');
    });

    it('should restore saved preference via backend API mapping', () => {
      mockLastFacetMap['exports'] = 'statements' as types.DataFacet;

      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.activeFacet).toBe('statements');
    });
  });

  describe('facet switching', () => {
    it('should change active facet and persist backend API value to preferences', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      act(() => {
        result.current.setActiveFacet('receipts' as DataFacet);
      });

      expect(mockSetLastFacet).toHaveBeenCalledWith('exports', 'receipts');
    });
  });

  describe('facet configuration', () => {
    it('should return correct facet configuration', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      const config = result.current.getFacetConfig('receipts' as DataFacet);
      expect(config).toEqual({
        id: 'receipts',
        label: 'Receipts',
      });
    });

    it('should provide available facets', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.availableFacets).toHaveLength(3);
      expect(result.current.availableFacets).toEqual(sampleFacets);
    });

    it('should check if facet is active correctly', () => {
      mockLastFacetMap['exports'] = 'statements' as types.DataFacet;

      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.isFacetActive('statements' as DataFacet)).toBe(
        true,
      );
      expect(result.current.isFacetActive('receipts' as DataFacet)).toBe(false);
    });
  });

  describe('backward compatibility', () => {
    it('should provide correct backend API value for current facet', () => {
      mockLastFacetMap['exports'] = 'statements' as types.DataFacet;

      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.getCurrentDataFacet()).toBe('statements');
    });

    it('should fallback to facet ID when no backend API mapping exists', () => {
      const facetsWithoutApiMapping: DataFacetConfig[] = [
        {
          id: 'custom-facet' as DataFacet,
          label: 'Custom Facet',
          // No dataFacet property
        },
      ];

      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: facetsWithoutApiMapping,
        }),
      );

      expect(result.current.getCurrentDataFacet()).toBe('custom-facet');
    });
  });

  describe('edge cases', () => {
    it('should handle empty facets array', () => {
      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: [],
        }),
      );

      expect(result.current.activeFacet).toBe('dashboard');
      expect(result.current.availableFacets).toEqual([]);
    });

    it('should handle invalid saved preference', () => {
      // Clear the mock to simulate invalid/missing facet data
      mockLastFacetMap = {};

      const { result } = renderHook(() =>
        useActiveFacet({
          viewRoute: 'exports',
          facets: sampleFacets,
        }),
      );

      expect(result.current.activeFacet).toBe('transactions'); // fallback to default
    });
  });
});
