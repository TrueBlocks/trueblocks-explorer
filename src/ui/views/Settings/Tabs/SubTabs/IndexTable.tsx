import React from 'react';

import { BaseTable } from '@components/Table';

import { indexSchema } from '../Indexes';

export const IndexTable = ({ theData, loading }: { theData: any[]; loading: boolean }) => <BaseTable dataSource={theData} columns={indexSchema} loading={loading} />;
