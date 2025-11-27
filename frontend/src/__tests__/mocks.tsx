import type { ReactElement, ReactNode } from 'react';

import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { RegisterHotkeyOptions } from '@utils';
import { vi } from 'vitest';

// Type fallbacks for Wails bridge functions
type AppBridgeFunctions = any;
type RuntimeBridgeFunctions = any;

// --- Hotkey Mocking --- //
interface RegisteredHotkeyInfo {
  handler: (event: KeyboardEvent) => void;
  options?: RegisterHotkeyOptions;
}

export const registeredHotkeys = new Map<string, RegisteredHotkeyInfo>();

export const initialMockUseHotkeysImplementation = (
  key: string,
  handler: (event: KeyboardEvent) => void,
  options?: RegisterHotkeyOptions,
) => {
  registeredHotkeys.set(key, { handler, options });
};

export let mockUseHotkeys = vi.fn(initialMockUseHotkeysImplementation);

export function triggerHotkey(key: string, eventArgs?: Partial<KeyboardEvent>) {
  const registration = registeredHotkeys.get(key);
  // Corrected condition: check if registration and its handler exist
  if (registration?.handler) {
    const { handler } = registration;

    const lowerKey = key.toLowerCase();
    const hasMod = lowerKey.includes('mod+');
    const hasMeta = lowerKey.includes('meta+');
    const hasCtrl = lowerKey.includes('ctrl+');
    const hasShift = lowerKey.includes('shift+');
    const hasAlt = lowerKey.includes('alt+');

    const keyParts = key.split('+');
    // Use pop() to get the last element, provide a fallback to empty string if undefined
    const baseKey: string = keyParts.pop() || '';

    const mockEvent: KeyboardEvent = {
      key: baseKey, // This is where event.key gets its value
      metaKey: hasMod || hasMeta || (eventArgs?.metaKey ?? false),
      ctrlKey:
        hasCtrl ||
        (hasMod && !(hasMeta || eventArgs?.metaKey)) ||
        (eventArgs?.ctrlKey ?? false),
      shiftKey: hasShift || (eventArgs?.shiftKey ?? false),
      altKey: hasAlt || (eventArgs?.altKey ?? false),
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      bubbles: eventArgs?.bubbles ?? true,
      cancelable: eventArgs?.cancelable ?? true,
      composed: eventArgs?.composed ?? true,
      code: eventArgs?.code ?? `Key${baseKey.toUpperCase()}`, // baseKey is now definitely a string
      location: eventArgs?.location ?? 0,
      repeat: eventArgs?.repeat ?? false,
      isComposing: eventArgs?.isComposing ?? false,
      view: eventArgs?.view ?? window,
      detail: eventArgs?.detail ?? 0,
      which: eventArgs?.which ?? 0,
      target: eventArgs?.target ?? document.body,
      currentTarget: eventArgs?.currentTarget ?? document.body,
      eventPhase: eventArgs?.eventPhase ?? 0,
      timeStamp: eventArgs?.timeStamp ?? Date.now(),
      type: eventArgs?.type ?? 'keydown',
      getModifierState: (keyArg: string) => {
        if (keyArg === 'Meta') return mockEvent.metaKey;
        if (keyArg === 'Control') return mockEvent.ctrlKey;
        if (keyArg === 'Shift') return mockEvent.shiftKey;
        if (keyArg === 'Alt') return mockEvent.altKey;
        return false;
      },
      ...eventArgs,
    } as KeyboardEvent;

    handler(mockEvent);
    return mockEvent;
  }
  return null;
}

export function clearRegisteredHotkeys() {
  registeredHotkeys.clear();
}
// --- End Hotkey Mocking --- //

// --- Focused Hooks Mocking --- //
const createInitialFocusedHooksDefaultValue = () => ({
  // useActiveProject defaults
  activeProject: {
    lastFacetMap: {},
    activeChain: 'mainnet',
    activeAddress: '0x123',
    activeContract: '0x52df6e4d9989e7cf4739d687c765e75323a1b14c',
    loading: false,
    effectiveAddress: '0x123',
    effectiveChain: 'mainnet',
    lastProject: 'test-project',
    lastView: 'home',
    hasActiveProject: true,
    canExport: true,
    switchProject: vi.fn(),
    setActiveAddress: vi.fn(),
    setActiveChain: vi.fn(),
    setActiveContract: vi.fn(),
    setLastView: vi.fn(),
    setLastFacet: vi.fn(),
    setViewAndFacet: vi.fn(),
    getLastFacet: vi.fn((_view: string) => {
      return '';
    }),
  },
  // usePreferences defaults
  preferences: {
    lastTheme: 'light',
    lastLanguage: 'en',
    loading: false,
    isDarkMode: false,
    debugCollapsed: true,
    helpCollapsed: false,
    menuCollapsed: false,
    chromeCollapsed: false,
    detailCollapsed: true,
    toggleTheme: vi.fn(),
    changeLanguage: vi.fn(),
    setDebugCollapsed: vi.fn(),
    setDetailCollapsed: vi.fn(),
    setHelpCollapsed: vi.fn(),
    setMenuCollapsed: vi.fn(),
    setChromeCollapsed: vi.fn(),
  },
});

export let mockFocusedHooksValues = createInitialFocusedHooksDefaultValue();

export const mockUseActiveProject = vi.fn(
  () => mockFocusedHooksValues.activeProject,
);
export const mockUsePreferences = vi.fn(
  () => mockFocusedHooksValues.preferences,
);
export function setupFocusedHookMocks({
  customActiveProject,
  customPreferences,
}: {
  customActiveProject?: Partial<typeof mockFocusedHooksValues.activeProject>;
  customPreferences?: Partial<typeof mockFocusedHooksValues.preferences>;
} = {}) {
  const newDefaults = createInitialFocusedHooksDefaultValue();

  // Set up Wails mocks to prevent "Cannot read properties of undefined" errors
  setupWailsMocks();

  if (customActiveProject) {
    mockFocusedHooksValues.activeProject = {
      ...newDefaults.activeProject,
      ...customActiveProject,
    };
  }

  if (customPreferences) {
    mockFocusedHooksValues.preferences = {
      ...newDefaults.preferences,
      ...customPreferences,
    };
  }

  // Update the mock implementations to use the new values
  mockUseActiveProject.mockReturnValue(mockFocusedHooksValues.activeProject);
  mockUsePreferences.mockReturnValue(mockFocusedHooksValues.preferences);

  // Return the mock functions so tests can access them
  return {
    mockActiveProject: mockFocusedHooksValues.activeProject,
    mockPreferences: mockFocusedHooksValues.preferences,
  };
}

// Mock @wallet to provide wallet context
const createInitialWalletContextDefaultValue = () => ({
  session: {
    address: '0x123456789abcdef',
    chainId: 1,
  },
  isConnected: false,
  connect: vi.fn(),
  disconnect: vi.fn(),
});

export let mockWalletContextValues = createInitialWalletContextDefaultValue();

export const mockUseWalletContext = vi.fn(() => mockWalletContextValues);

vi.mock('@wallet', async (importOriginal) => {
  try {
    const originalModule = await importOriginal();
    return {
      ...(originalModule as any),
      useWalletContext: mockUseWalletContext,
    };
  } catch {
    return {
      useWalletContext: mockUseWalletContext,
    };
  }
});

// Mock @hooks to provide focused hooks
vi.mock('@hooks', async (importOriginal) => {
  try {
    const originalModule = await importOriginal();
    return {
      ...(originalModule as any),
      useActiveProject: mockUseActiveProject,
      usePreferences: mockUsePreferences,
    };
  } catch {
    return {
      useActiveProject: mockUseActiveProject,
      usePreferences: mockUsePreferences,
    };
  }
});
// --- End Focused Hooks Mocking --- //

// --- Wails Bridge Mocking --- //
const createInitialMockRuntimeBridge = (): RuntimeBridgeFunctions => ({
  EventsEmit: vi.fn(),
});

const createInitialMockAppBridge = (): AppBridgeFunctions => ({
  GetAppId: vi.fn().mockResolvedValue('mockAppId'),
  GetWizardReturn: vi.fn().mockResolvedValue('/mock-wizard-return'),
  GetUserPreferences: vi
    .fn()
    .mockResolvedValue({ name: 'Mock User', email: 'mock@example.com' }),
  SetUserPreferences: vi.fn().mockResolvedValue({}),
  IsReady: vi.fn().mockResolvedValue(true),
  IsDisabled: vi.fn().mockResolvedValue(false),
  ConfigOk: vi.fn().mockResolvedValue(undefined),
  GetAppPreferences: vi.fn().mockResolvedValue({
    lastView: '/mock-default-view',
    menuCollapsed: false,
  }),
  SetLastView: vi.fn().mockResolvedValue(undefined),
  SetFilterState: vi.fn().mockResolvedValue(undefined),
  CancelFetches: vi.fn().mockResolvedValue(3),
});

export let mockAppBridge = createInitialMockAppBridge();
export let mockRuntimeBridge = createInitialMockRuntimeBridge();

vi.mock('@app', () => mockAppBridge);
vi.mock('../../wailsjs/runtime/runtime', () => mockRuntimeBridge);

export const setupWailsMocks = ({
  appOverrides,
  runtimeOverrides,
}: {
  appOverrides?: Partial<AppBridgeFunctions>;
  runtimeOverrides?: Partial<RuntimeBridgeFunctions>;
} = {}) => {
  let currentAppMock = createInitialMockAppBridge();
  let currentRuntimeMock = createInitialMockRuntimeBridge();

  if (appOverrides) {
    for (const key in appOverrides) {
      if (Object.prototype.hasOwnProperty.call(appOverrides, key)) {
        const overrideFn = (appOverrides as any)[key];
        if (key in currentAppMock) {
          (currentAppMock as any)[key] = vi.fn(overrideFn as any);
        } else {
          // This is test infrastructure code, so we'll just skip logging the warning
          // since the mocks from global-mocks.tsx should handle actual calls
        }
      }
    }
  }

  if (runtimeOverrides) {
    for (const key in runtimeOverrides) {
      if (Object.prototype.hasOwnProperty.call(runtimeOverrides, key)) {
        const overrideFn = (runtimeOverrides as any)[key];
        if (key in currentRuntimeMock) {
          (currentRuntimeMock as any)[key] = vi.fn(overrideFn as any);
        } else {
          // This is test infrastructure code, so we'll just skip logging the warning
          // since the mocked Log from global-mocks.tsx should handle actual Log calls
        }
      }
    }
  }

  if (typeof window !== 'undefined') {
    (window as any).go = {
      app: {
        App: currentAppMock,
      },
      runtime: currentRuntimeMock,
    };
  }

  Object.assign(mockAppBridge, currentAppMock);
  Object.assign(mockRuntimeBridge, currentRuntimeMock);
};
// --- End Wails Bridge Mocking --- //

// --- Rendering Utilities --- //
export function AllTheProviders({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <MantineProvider>{children}</MantineProvider>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
// --- End Rendering Utilities --- //

// --- Context Mocking --- //
const createInitialViewContextDefaultValue = () => ({
  currentView: 'mockView',
  setCurrentView: vi.fn(),
  getPagination: vi.fn(() => ({ currentPage: 0, pageSize: 10, totalItems: 0 })),
  updatePagination: vi.fn(),
});
export let mockViewContextDefaultValue = createInitialViewContextDefaultValue();

export function setupContextMocks({
  customViewContext,
}: {
  customViewContext?: Partial<
    ReturnType<typeof createInitialViewContextDefaultValue>
  >;
} = {}) {
  const newDefaults = createInitialViewContextDefaultValue();
  if (customViewContext) {
    mockViewContextDefaultValue = {
      ...newDefaults,
      ...customViewContext,
      setCurrentView:
        customViewContext.setCurrentView || newDefaults.setCurrentView,
      getPagination:
        customViewContext.getPagination || newDefaults.getPagination,
      updatePagination:
        customViewContext.updatePagination || newDefaults.updatePagination,
    };
  } else {
    mockViewContextDefaultValue = newDefaults;
  }

  vi.mock('@contexts', async (importOriginal) => {
    const original = (await importOriginal()) as any;
    return {
      ...original,
      useViewContext: () => mockViewContextDefaultValue,
    };
  });
}

const createInitialTableContextDefaultValue = () => ({
  focusState: 'table' as 'table' | 'controls',
  selectedRowIndex: -1,
  setSelectedRowIndex: vi.fn(),
  focusTable: vi.fn(),
  focusControls: vi.fn(),
  useTableContext: vi.fn(),
  tableRef: { current: null as HTMLTableElement | null },
});

export let mockTableContextDefaultValue =
  createInitialTableContextDefaultValue();

// Define mock spies for hooks from @components
export const mockUseTableContext = vi.fn(() => mockTableContextDefaultValue);
export const mockUseFormHotkeys = vi.fn(); // Basic spy, can be configured if needed

// Top-level mock for @components
// This ensures that any import of @components gets these mocked hooks
vi.mock('@components', async (importOriginal) => {
  try {
    const originalModule = await importOriginal();
    const WizardForm = (props: any) => {
      const { fields = [], onSubmit, submitText = 'Next' } = props || {};
      return (
        <div role="form">
          {fields.map((f: any, index: number) => (
            <input
              key={String(f?.name ?? index)}
              placeholder={f?.placeholder}
              value={f?.value ?? ''}
              onChange={f?.onChange}
              onBlur={f?.onBlur}
            />
          ))}
          <button
            type="button"
            onClick={() => onSubmit?.({ preventDefault: () => {} } as any)}
          >
            {submitText}
          </button>
          {props.children}
        </div>
      );
    };
    return {
      ...(originalModule as any), // Spread other potential exports from @components
      useTableContext: mockUseTableContext,
      useFormHotkeys: mockUseFormHotkeys,
      WizardForm: (originalModule as any).WizardForm || WizardForm,
      // Add commonly needed component mocks
      TableProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-table-provider">{children}</div>
      ),
      Table: ({ data }: { data: any[] }) => (
        <div data-testid="mock-table">
          Table with {data ? data.length : 0} items
        </div>
      ),
      FormField: vi.fn(),
    };
  } catch {
    const WizardForm = (props: any) => {
      const { fields = [], onSubmit, submitText = 'Next' } = props || {};
      return (
        <div role="form">
          {fields.map((f: any, index: number) => (
            <input
              key={String(f?.name ?? index)}
              placeholder={f?.placeholder}
              value={f?.value ?? ''}
              onChange={f?.onChange}
              onBlur={f?.onBlur}
            />
          ))}
          <button
            type="button"
            onClick={() => onSubmit?.({ preventDefault: () => {} } as any)}
          >
            {submitText}
          </button>
          {props.children}
        </div>
      );
    };
    // If @components has no actual module (e.g., only types or if resolution fails during test setup)
    // return only the mocks. This can happen in some test environments or if path aliases are tricky.
    return {
      useTableContext: mockUseTableContext,
      useFormHotkeys: mockUseFormHotkeys,
      WizardForm,
      TableProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-table-provider">{children}</div>
      ),
      Table: ({ data }: { data: any[] }) => (
        <div data-testid="mock-table">
          Table with {data ? data.length : 0} items
        </div>
      ),
      FormField: vi.fn(),
    };
  }
});

export function setupComponentHookMocks({
  customTableContext,
}: {
  customTableContext?: Partial<
    ReturnType<typeof createInitialTableContextDefaultValue>
  >;
} = {}) {
  const newDefaults = createInitialTableContextDefaultValue();
  if (customTableContext) {
    mockTableContextDefaultValue = {
      ...newDefaults,
      ...customTableContext,
      // Ensure functions provided in customTableContext are used, or fall back to newDefaults' spies
      setSelectedRowIndex:
        customTableContext.setSelectedRowIndex ||
        newDefaults.setSelectedRowIndex,
      focusTable: customTableContext.focusTable || newDefaults.focusTable,
      focusControls:
        customTableContext.focusControls || newDefaults.focusControls,
    };
  } else {
    mockTableContextDefaultValue = newDefaults;
  }
}
// --- End Context Mocking --- //

// --- Global Reset Utility --- //
export function resetAllCentralMocks() {
  // Reset Wails Bridge mocks
  mockAppBridge = createInitialMockAppBridge();
  mockRuntimeBridge = createInitialMockRuntimeBridge();
  if (typeof window !== 'undefined') {
    (window as any).go = {
      app: mockAppBridge,
      runtime: mockRuntimeBridge,
    };
  }

  // Reset Hotkeys mock
  mockUseHotkeys.mockReset();
  mockUseHotkeys.mockImplementation(initialMockUseHotkeysImplementation);
  clearRegisteredHotkeys();

  // Reset Context mock values
  mockViewContextDefaultValue = createInitialViewContextDefaultValue();
  mockTableContextDefaultValue = createInitialTableContextDefaultValue();

  // Reset Wallet Context mock values
  mockWalletContextValues = createInitialWalletContextDefaultValue();
  mockUseWalletContext.mockReset();
  mockUseWalletContext.mockImplementation(() => mockWalletContextValues);

  // Reset Focused Hooks mock values
  mockFocusedHooksValues = createInitialFocusedHooksDefaultValue();
  mockUseActiveProject.mockReturnValue(mockFocusedHooksValues.activeProject);
  mockUsePreferences.mockReturnValue(mockFocusedHooksValues.preferences);

  // Reset and re-initialize implementations for @components hooks
  mockUseTableContext.mockReset();
  mockUseTableContext.mockImplementation(() => mockTableContextDefaultValue);

  mockUseFormHotkeys.mockReset();

  // Reset Focused Hooks mock values
  mockFocusedHooksValues = createInitialFocusedHooksDefaultValue();
  mockUseActiveProject.mockReset();
  mockUseActiveProject.mockImplementation(
    () => mockFocusedHooksValues.activeProject,
  );
  mockUsePreferences.mockReset();
  mockUsePreferences.mockImplementation(
    () => mockFocusedHooksValues.preferences,
  );
}
// --- End Global Reset Utility --- //
