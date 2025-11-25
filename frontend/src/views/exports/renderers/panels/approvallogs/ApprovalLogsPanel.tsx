// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
// EXISTING_CODE
import React, { useMemo } from 'react';

import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  InfoAddressRenderer,
  InfoArticulationRenderer,
  InfoDetailsRenderer,
  logToAddressInfo,
} from '@components';
import { types } from '@models';
import { displayHash } from '@utils';

import '../../../../../components/detail/DetailTable.css';
import { logToArticulationInfo, logToDetailsInfo } from '../logs/LogsPanel';

// EXISTING_CODE

export const ApprovalLogsPanel = (rowData: Record<string, unknown> | null) => {
  // EXISTING_CODE
  const log = useMemo(
    () => (rowData as unknown as types.Log) || types.Log.createFrom({}),
    [rowData],
  );
  const addressInfo = useMemo(
    () => logToAddressInfo(log.address, log.addressName),
    [log],
  );
  const detailsInfo = useMemo(() => logToDetailsInfo(log), [log]);
  const articulationInfo = useMemo(() => logToArticulationInfo(log), [log]);

  if (!rowData) {
    return <div className="no-selection">Loading...</div>;
  }

  return (
    <DetailContainer>
      <DetailHeader>
        Log {log.logIndex} in Tx {displayHash(log.transactionHash)}
      </DetailHeader>

      <DetailSection title={'Information'}>
        <InfoAddressRenderer addressInfo={addressInfo} />
      </DetailSection>

      <DetailSection title={'Decoded Event'}>
        <InfoArticulationRenderer articulationInfo={articulationInfo} />
      </DetailSection>

      <DetailSection title={'Transaction & Block Details'}>
        <InfoDetailsRenderer detailsInfo={detailsInfo} />
      </DetailSection>
    </DetailContainer>
  );
  // EXISTING_CODE
};

// EXISTING_CODE
// EXISTING_CODE
