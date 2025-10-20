import { useCallback, useState } from 'react';

import { DressesCrud } from '@app';
import { crud, dalle, model, types } from '@models';

export interface UseSeriesModalConfig {
  getCurrentDataFacet: () => types.DataFacet;
  createPayload: (facet: types.DataFacet, address?: string) => types.Payload;
  collection: string;
}

export const useSeriesModal = ({
  getCurrentDataFacet,
  createPayload,
  collection,
}: UseSeriesModalConfig) => {
  const [seriesModalState, setSeriesModalState] = useState<{
    opened: boolean;
    mode: 'create' | 'edit' | 'duplicate';
    initial?: dalle.Series | null;
  }>({ opened: false, mode: 'create' });

  const closeSeriesModal = useCallback(
    () => setSeriesModalState((s) => ({ ...s, opened: false })),
    [],
  );

  const submitSeriesModal = useCallback(
    (s: dalle.Series) => {
      const facet = getCurrentDataFacet();
      if (facet !== types.DataFacet.SERIES) return;
      const payload = createPayload(facet);
      payload.collection = collection;
      const op =
        seriesModalState.mode === 'edit'
          ? crud.Operation.UPDATE
          : crud.Operation.CREATE;
      DressesCrud(payload, op, model.DalleDress.createFrom(s)).then(() => {});
      setSeriesModalState((prev) => ({ ...prev, opened: false }));
    },
    [getCurrentDataFacet, createPayload, collection, seriesModalState.mode],
  );

  return {
    seriesModal: seriesModalState,
    closeSeriesModal,
    submitSeriesModal,
    setSeriesModalState,
  };
};
