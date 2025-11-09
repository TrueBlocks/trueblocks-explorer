import { useSyncExternalStore } from 'react';

import {
  ClearActiveProject,
  CloseProject,
  ConvertToAddress,
  GetActiveProjectData,
  GetAppPreferences,
  GetOpenProjects,
  NewProject,
  OpenProjectFile,
  RestoreProjectContext,
  SetActiveAddress,
  SetActiveChain,
  SetActiveContract,
  SetActivePeriod,
  SetAppPreferences,
  SetLastFacet,
  SetLastView,
  SetViewAndFacet,
} from '@app';
import { preferences, types } from '@models';
import { EventsOn } from '@runtime';
import { LogError, addressToHex, updateAppPreferencesSafely } from '@utils';

export interface ProjectInfo {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  isDirty: boolean;
  lastOpened: string;
  createdAt: string;
  description?: string;
  addresses?: string[];
  chains?: string[];
}

export interface UseActiveProjectReturn {
  loading: boolean;
  lastProject: string;
  activeChain: string;
  activeAddress: string;
  activeContract: string;
  activePeriod: string;
  lastView: string;
  lastFacetMap: Record<string, types.DataFacet>;

  // Project management state
  projects: ProjectInfo[];

  // Current active project operations
  getLastFacet: (view: string) => string;
  setActiveAddress: (address: string) => Promise<void>;
  setActiveChain: (chain: string) => Promise<void>;
  setActiveContract: (contract: string) => Promise<void>;
  setActivePeriod: (period: types.Period) => Promise<void>;
  setLastView: (view: string) => Promise<void>;
  setLastFacet: (view: string, facet: types.DataFacet) => Promise<void>;
  setViewAndFacet: (view: string, facet: types.DataFacet) => Promise<void>;

  // Project management operations
  switchProject: (project: string) => Promise<void>;
  newProject: (name: string, address: string) => Promise<void>;
  openProjectFile: (path: string) => Promise<void>;
  closeProject: (projectId: string) => Promise<void>;
  clearActiveProject: () => Promise<void>;
  refreshProjects: () => Promise<void>;

  // Computed properties
  hasActiveProject: boolean;
  canExport: boolean;
  effectiveAddress: string;
  effectiveChain: string;
}

interface ProjectState {
  loading: boolean;
  lastProject: string;
  activeChain: string;
  activeAddress: string;
  activeContract: string;
  activePeriod: string;
  lastView: string;
  lastFacetMap: Record<string, types.DataFacet>;
  projects: ProjectInfo[];
}

const initialProjectState: ProjectState = {
  loading: false,
  lastProject: '',
  activeChain: '',
  activeAddress: '',
  activeContract: '',
  activePeriod: types.Period.BLOCKLY,
  lastView: '/projects', // DEFAULT_ROUTE
  lastFacetMap: {},
  projects: [],
};

class ProjectStore {
  private state: ProjectState = { ...initialProjectState };
  private listeners = new Set<() => void>();
  private cachedSnapshot: UseActiveProjectReturn | null = null;

  private getLastFacet = (view: string): string => {
    const vR = view.replace(/^\/+/, '');
    return this.state.lastFacetMap[vR] || '';
  };

  getSnapshot = (): UseActiveProjectReturn => {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = {
        loading: this.state.loading,
        lastProject: this.state.lastProject,
        activeChain: this.state.activeChain,
        activeAddress: this.state.activeAddress,
        activeContract: this.state.activeContract,
        activePeriod: this.state.activePeriod,
        lastView: this.state.lastView,
        lastFacetMap: this.state.lastFacetMap,
        projects: this.state.projects,
        getLastFacet: this.getLastFacet,
        setActiveAddress: this.setActiveAddress,
        setActiveChain: this.setActiveChain,
        setActiveContract: this.setActiveContract,
        setActivePeriod: this.setActivePeriod,
        setLastView: this.setLastView,
        setLastFacet: this.setLastFacet,
        setViewAndFacet: this.setViewAndFacet,
        switchProject: this.switchProject,
        newProject: this.newProject,
        openProjectFile: this.openProjectFile,
        closeProject: this.closeProject,
        clearActiveProject: this.clearActiveProject,
        refreshProjects: this.refreshProjects,
        hasActiveProject: this.hasActiveProject,
        canExport: this.canExport,
        effectiveAddress: this.state.activeAddress,
        effectiveChain: this.state.activeChain,
      };
    }
    return this.cachedSnapshot;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };

  private setState = (updates: Partial<ProjectState>): void => {
    this.state = { ...this.state, ...updates };
    this.cachedSnapshot = null;
    this.notify();
  };

  private eventListenersSetup = false;

  initialize = async (): Promise<void> => {
    try {
      this.setState({ loading: true });

      const [projectData, prefs, projects] = await Promise.all([
        GetActiveProjectData(),
        GetAppPreferences(),
        GetOpenProjects(),
      ]);

      const activeProject = prefs.lastProjects?.find((p) => p.isActive);
      const lastProjectPath = activeProject?.path || '';

      this.setState({
        lastProject: lastProjectPath,
        activeChain: projectData.activeChain || '',
        activeAddress: projectData.activeAddress || '',
        activeContract: projectData.activeContract || '',
        activePeriod: projectData.activePeriod || 'blockly',
        lastView: projectData.lastView || '/projects', // DEFAULT_ROUTE
        lastFacetMap: Object.fromEntries(
          Object.entries(projectData.lastFacetMap || {}).map(([key, value]) => [
            key,
            value as types.DataFacet,
          ]),
        ),
        projects: (projects as ProjectInfo[]) || [],
        loading: false,
      });

      if (!this.eventListenersSetup) {
        this.setupEventListeners();
        this.eventListenersSetup = true;
      }
    } catch (error) {
      LogError('Failed to load project data: ' + String(error));
      this.setState({ loading: false });
    }
  };

  private setupEventListeners = (): void => {
    const handleProjectEvent = () => {
      this.refreshProjects();
      this.initialize();
    };

    const handlePeriodChanged = (period: string) => {
      this.setState({ activePeriod: period });
    };

    const handleProjectCleared = () => {
      this.setState({
        lastProject: '',
        activeAddress: '',
        activeChain: '',
        lastView: '/projects', // DEFAULT_ROUTE
      });
      this.refreshProjects();
    };

    EventsOn('manager:change', (message: string) => {
      if (message === 'active_project_cleared') {
        handleProjectCleared();
      } else {
        handleProjectEvent();
      }
    });
    EventsOn('project:opened', handleProjectEvent);
    EventsOn('active_period_changed', handlePeriodChanged);
  };

  setActiveAddress = async (address: string): Promise<void> => {
    try {
      const result = await ConvertToAddress(address);
      if (result) {
        const hexAddress = addressToHex(result);
        await SetActiveAddress(hexAddress);
        this.setState({ activeAddress: hexAddress });
      } else {
        const errorMsg = `Invalid address - ConvertToAddress returned: ${JSON.stringify(result)}`;
        LogError(`${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error) {
      LogError(`Failed to set active address: ${String(error)}`);
      throw error;
    }
  };

  setActiveChain = async (chain: string): Promise<void> => {
    await SetActiveChain(chain);
    this.setState({ activeChain: chain });
  };

  setActiveContract = async (contract: string): Promise<void> => {
    await SetActiveContract(contract);
    this.setState({ activeContract: contract });
  };

  setActivePeriod = async (period: types.Period): Promise<void> => {
    await SetActivePeriod(period);
    this.setState({ activePeriod: period });
  };

  setLastFacet = async (view: string, facet: string): Promise<void> => {
    const actualView = await SetLastFacet(view, facet);
    this.setState({
      lastFacetMap: {
        ...this.state.lastFacetMap,
        [actualView]: facet as types.DataFacet,
      },
    });
  };

  setLastView = async (view: string): Promise<void> => {
    const actualView = await SetLastView(view);
    this.setState({ lastView: actualView });
  };

  setViewAndFacet = async (
    view: string,
    facet: types.DataFacet,
  ): Promise<void> => {
    const actualView = await SetViewAndFacet(view, facet);
    this.setState({
      lastView: actualView,
      lastFacetMap: {
        ...this.state.lastFacetMap,
        [actualView]: facet,
      },
    });
  };

  private updatePreferences = async (
    updates: Partial<preferences.AppPreferences>,
  ): Promise<void> => {
    try {
      const currentPrefs = await GetAppPreferences();
      const updatedPrefs = updateAppPreferencesSafely(currentPrefs, updates);
      await SetAppPreferences(updatedPrefs);
    } catch (error) {
      LogError(
        'Failed to update project management preferences: ' + String(error),
      );
      throw error;
    }
  };

  refreshProjects = async (): Promise<void> => {
    try {
      const projects = await GetOpenProjects();
      this.setState({ projects: (projects as ProjectInfo[]) || [] });
    } catch (error) {
      LogError('Failed to refresh projects: ' + String(error));
      throw error;
    }
  };

  switchProject = async (projectId: string): Promise<void> => {
    await RestoreProjectContext(projectId);
    const updatedProjects = this.state.projects.map((p) => ({
      ...p,
      isActive: p.id === projectId,
    }));

    const activeProject = updatedProjects.find((p) => p.id === projectId);
    this.setState({
      lastProject: activeProject?.path || '',
      projects: updatedProjects,
    });

    try {
      const projectData = await GetActiveProjectData();
      this.setState({
        activeChain: projectData.activeChain || '',
        activeAddress: projectData.activeAddress || '',
        activeContract: projectData.activeContract || '',
        activePeriod: projectData.activePeriod || 'blockly',
        lastView: projectData.lastView || '/projects', // DEFAULT_ROUTE
        lastFacetMap: Object.fromEntries(
          Object.entries(projectData.lastFacetMap || {}).map(([key, value]) => [
            key,
            value as types.DataFacet,
          ]),
        ),
      });
    } catch (error) {
      LogError('Failed to load project data after switch: ' + String(error));
    }
  };

  newProject = async (name: string, address: string): Promise<void> => {
    await NewProject(name, address);
    await this.refreshProjects();
    await this.initialize();
  };

  openProjectFile = async (path: string): Promise<void> => {
    await OpenProjectFile(path);
    await this.refreshProjects();
    await this.initialize();
  };

  closeProject = async (projectId: string): Promise<void> => {
    await CloseProject(projectId);
    await this.refreshProjects();
  };

  clearActiveProject = async (): Promise<void> => {
    await ClearActiveProject();
    this.setState({ lastProject: '' });
    await this.refreshProjects();
  };

  get hasActiveProject(): boolean {
    return Boolean(
      this.state.lastProject &&
        this.state.activeAddress &&
        this.state.activeChain,
    );
  }

  get canExport(): boolean {
    return Boolean(
      this.state.lastProject &&
        this.state.activeAddress &&
        this.state.activeChain,
    );
  }
}

const projectStore = new ProjectStore();

if (
  typeof window !== 'undefined' &&
  typeof import.meta.env.VITEST === 'undefined'
) {
  setTimeout(() => {
    projectStore.initialize();
  }, 0);
}

export const useActiveProject = (): UseActiveProjectReturn => {
  return useSyncExternalStore(projectStore.subscribe, projectStore.getSnapshot);
};
