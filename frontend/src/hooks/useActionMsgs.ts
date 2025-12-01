import { emitError, emitStatus } from '@utils';

export type EntityType = 'names' | 'monitors' | 'abis';
type ActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'undelete'
  | 'remove'
  | 'autoname'
  | 'clean'
  | 'publish'
  | 'pin'
  | 'copy'
  | 'reload';

interface EntityConfig {
  displayName: string;
  singularName: string;
  pluralName: string;
  useAddress: boolean;
}

const ENTITY_CONFIGS: Record<EntityType, EntityConfig> = {
  names: {
    displayName: 'Name',
    singularName: 'name',
    pluralName: 'names',
    useAddress: true,
  },
  monitors: {
    displayName: 'Monitor',
    singularName: 'monitor',
    pluralName: 'monitors',
    useAddress: false,
  },
  abis: {
    displayName: 'ABI',
    singularName: 'address',
    pluralName: 'ABI',
    useAddress: false,
  },
};

export const useActionMsgs = (entityType: EntityType) => {
  const config = ENTITY_CONFIGS[entityType];

  const generateSuccessMessage = (
    action: ActionType,
    identifier?: string | number,
  ): string => {
    if (action === 'autoname') {
      return `Address ${identifier} was auto-named successfully`;
    }
    if (action === 'clean') {
      return `${config.displayName}s data cleaned successfully`;
    }
    if (action === 'reload') {
      return `Reloaded ${config.singularName} data. Fetching fresh data...`;
    }
    if (action === 'copy') {
      return `${config.displayName} was copied successfully`;
    }

    const entityName = ['create', 'update'].includes(action)
      ? config.displayName
      : `${config.displayName}${config.useAddress ? ' for address' : ''}`;

    const identifierText = ['create', 'update'].includes(action)
      ? `'${identifier}'`
      : identifier;

    return `${entityName} ${identifierText} was ${action}d successfully`;
  };

  const generateFailureMessage = (
    action: ActionType,
    identifier?: string,
    error?: string,
  ): string => {
    // Special cases that don't follow the standard pattern
    if (action === 'autoname') {
      return `Failed to auto-name address ${identifier}: ${error}`;
    }
    if (action === 'clean') {
      return `Failed to clean ${config.pluralName}: ${error}`;
    }
    if (action === 'copy') {
      return `Failed to copy ${config.singularName}: ${error}`;
    }

    // Standard pattern for most actions
    const entityName = ['create', 'update'].includes(action)
      ? config.singularName
      : `${config.singularName}${config.useAddress ? ' for address' : ''}`;

    const identifierText = ['create', 'update'].includes(action)
      ? ''
      : ` ${identifier}`;

    return `Failed to ${action} ${entityName}${identifierText}: ${error}`;
  };

  return {
    // Direct emit methods
    emitSuccess: (action: ActionType, identifier?: string | number) => {
      emitStatus(generateSuccessMessage(action, identifier));
    },

    emitFailure: (action: ActionType, identifier?: string, error?: string) => {
      emitError(generateFailureMessage(action, identifier, error));
    },

    // Message generators (for cases where you need the string without emitting)
    success: generateSuccessMessage,
    failure: generateFailureMessage,

    // Convenience methods for common patterns
    emitReloadStatus: () => {
      emitStatus(
        `Reloaded ${config.singularName} data. Fetching fresh data...`,
      );
    },
  };
};
