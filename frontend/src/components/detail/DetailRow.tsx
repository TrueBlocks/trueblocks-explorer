import { Grid } from '@mantine/core';

export interface DetailRowProps {
  children: React.ReactNode;
  nColumns?: number; // Number of columns (default: 1)
  className?: string;
}

/**
 * DetailRow groups multiple DetailField components using Mantine Grid.
 * For nColumns=1: 25%/75% layout (3/9 in 12-column grid)
 * For nColumns=2: 12.5%/37.5%/12.5%/37.5% layout (2/4/2/4 in 12-column grid)
 */
export const DetailRow = ({ children, className }: DetailRowProps) => {
  return <Grid className={className}>{children}</Grid>;
};

DetailRow.displayName = 'DetailRow';
