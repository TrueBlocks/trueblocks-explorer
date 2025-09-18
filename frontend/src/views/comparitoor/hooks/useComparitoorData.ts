import { useMemo } from 'react';

import { comparitoor } from '@models';

export type AppearanceItem = {
  blockNum: string;
  txid: string;
  value: string;
  missing?: boolean;
  unique?: boolean;
};

export type ComparitoorSource = {
  key: string;
  label: string;
  data: AppearanceItem[];
  stats: { appearances: number; time?: number; unique: number };
};

const sourceDefs = [
  { key: 'chifra', label: 'Chifra', field: 'chifra' },
  { key: 'etherscan', label: 'EtherScan', field: 'etherscan' },
  { key: 'covalent', label: 'Covalent', field: 'covalent' },
  { key: 'alchemy', label: 'Alchemy', field: 'alchemy' },
];

type AnnotatedTxType = {
  blockNumber?: number;
  transactionIndex?: number;
  missing?: boolean;
  unique?: boolean;
};

export function useComparitoorData(page: comparitoor.ComparitoorPage | null) {
  return useMemo(() => {
    if (!page) return [];
    return sourceDefs.map((src) => {
      const arr = page[src.field as keyof typeof page] as
        | AnnotatedTxType[]
        | undefined;
      const data: AppearanceItem[] = (arr || []).map((tx) => ({
        blockNum: tx.blockNumber !== undefined ? String(tx.blockNumber) : '',
        txid:
          tx.transactionIndex !== undefined ? String(tx.transactionIndex) : '',
        value: `${tx.blockNumber ?? ''}.${tx.transactionIndex ?? ''}`,
        missing: !!tx.missing,
        unique: !!tx.unique,
      }));
      return {
        key: src.key,
        label: src.label,
        data,
        stats: {
          appearances: arr?.length ?? 0,
          unique: data.filter((item) => item.unique).length,
        },
      };
    });
  }, [page]);
}
