import React from 'react';

import { GridTable } from '@components/GridTable';

import { indexSchema } from '../Indexes';

export const IndexGrid = ({ theData, loading }: { theData: any[]; loading: boolean }) => <GridTable data={theData} columns={indexSchema} />;
