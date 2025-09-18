// SortSpec utility functions for frontend
import { sdk } from '@models';

// Create a SortSpec for single field sorting (current UI behavior)
export const createSingleFieldSortSpec = (
  field: string,
  direction: 'asc' | 'desc',
): sdk.SortSpec => ({
  fields: [field],
  orders: [direction === 'asc'],
});

// Get the first field from a SortSpec (for single-field sorting UI)
export const getSortField = (sortSpec: sdk.SortSpec): string => {
  return sortSpec.fields && sortSpec.fields.length > 0
    ? sortSpec.fields[0] || ''
    : '';
};

// Get the first direction from a SortSpec as string (for single-field sorting UI)
export const getSortDirection = (sortSpec: sdk.SortSpec): 'asc' | 'desc' => {
  return sortSpec.orders && sortSpec.orders.length > 0 && sortSpec.orders[0]
    ? 'asc'
    : 'desc';
};

// Check if SortSpec is empty (no fields)
export const isEmptySort = (sortSpec: sdk.SortSpec): boolean => {
  return !sortSpec.fields || sortSpec.fields.length === 0;
};

// Create an empty SortSpec
export const EMPTY_SORT_SPEC: sdk.SortSpec = {
  fields: [],
  orders: [],
};

// Create an empty SortSpec (function version for when you need a new instance)
export const createEmptySortSpec = (): sdk.SortSpec => ({
  fields: [],
  orders: [],
});

// Multi-Field Sorting Manager
export class SortSpecManager {
  static readonly MAX_SORTS = 3;

  static handleFieldClick(
    currentSort: sdk.SortSpec,
    field: string,
  ): sdk.SortSpec {
    const fields = currentSort.fields || [];
    const orders = currentSort.orders || [];
    const fieldIndex = fields.indexOf(field);

    if (fieldIndex === -1) {
      // Case 1: New field - prepend as ascending, enforce limit
      const newFields = [field, ...fields].slice(0, this.MAX_SORTS);
      const newOrders = [true, ...orders].slice(0, this.MAX_SORTS); // true = ascending
      return { fields: newFields, orders: newOrders };
    } else if (fieldIndex > 0) {
      // Case 2: Existing secondary - promote to primary, keep direction
      const newFields = [...fields];
      const newOrders = [...orders];

      const [promotedField] = newFields.splice(fieldIndex, 1);
      const [promotedOrder] = newOrders.splice(fieldIndex, 1);

      if (promotedField !== undefined && promotedOrder !== undefined) {
        newFields.unshift(promotedField);
        newOrders.unshift(promotedOrder);
      }

      return { fields: newFields, orders: newOrders };
    } else if (orders[0] === true) {
      // Case 3: Primary ascending - toggle to descending
      const newOrders = [false, ...orders.slice(1)]; // false = descending
      return { fields: [...fields], orders: newOrders };
    } else {
      // Case 4: Primary descending - remove
      return {
        fields: fields.slice(1),
        orders: orders.slice(1),
      };
    }
  }

  static getSortInfo(
    sortSpec: sdk.SortSpec,
    field: string,
  ): {
    active: boolean;
    direction: 'asc' | 'desc' | null;
    priority: number;
  } {
    const fields = sortSpec.fields || [];
    const orders = sortSpec.orders || [];
    const index = fields.indexOf(field);

    return {
      active: index !== -1,
      direction: index !== -1 ? (orders[index] ? 'asc' : 'desc') : null,
      priority: index !== -1 ? index + 1 : 0,
    };
  }

  static createMultiFieldSortSpec(
    sortFields: Array<{ field: string; direction: 'asc' | 'desc' }>,
  ): sdk.SortSpec {
    const fields = sortFields.map((sf) => sf.field);
    const orders = sortFields.map((sf) => sf.direction === 'asc');
    return { fields, orders };
  }

  static isMultiFieldSort(sortSpec: sdk.SortSpec): boolean {
    return (sortSpec.fields || []).length > 1;
  }

  static getAllSortFields(
    sortSpec: sdk.SortSpec,
  ): Array<{ field: string; direction: 'asc' | 'desc'; priority: number }> {
    const fields = sortSpec.fields || [];
    const orders = sortSpec.orders || [];

    return fields.map((field, index) => ({
      field,
      direction: orders[index] ? 'asc' : 'desc',
      priority: index + 1,
    }));
  }
}
