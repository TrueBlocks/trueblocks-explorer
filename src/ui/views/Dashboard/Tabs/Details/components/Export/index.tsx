import {
  Transaction,
} from '@sdk';

import { sendTheExport } from '../../../../../../Utilities';

export * from './ExportOfx';
export * from './ExportText';

//-------------------------------------------------------------------------
export const exportToJson = (theData: Transaction[]) => {
  sendTheExport('json', JSON.stringify(theData, null, 2));
};
