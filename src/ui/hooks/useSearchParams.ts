import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

type SearchParamsWrapper = {
  get: URLSearchParams['get'],
  getAll: URLSearchParams['getAll'],
  set(name: string, value: string): URLSearchParams,
  delete(name: string): URLSearchParams,
}

export function createWrapper(search: string): SearchParamsWrapper {
  const searchParams = new URLSearchParams(search);

  return {
    get(name) {
      return searchParams.get(name);
    },
    getAll(name) {
      return searchParams.getAll(name);
    },
    set(name, value) {
      searchParams.set(name, value);
      return searchParams;
    },
    delete(name) {
      searchParams.delete(name);
      return searchParams;
    },
  };
}

export function useSearchParams(): SearchParamsWrapper {
  const { search } = useLocation();

  return useMemo(() => createWrapper(search), [search]);
}
