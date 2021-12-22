// import Handlebars from 'handlebars';
import {
  Transaction,
} from '@sdk';
import dayjs from 'dayjs';
import Mustache from 'mustache';

import { sendTheExport } from '../../../../../../Utilities';
import { incomeFields, outflowFields } from './ExportText';

//-------------------------------------------------------------------------
export const exportToOfx = (theData: Transaction[]) => {
  const transactions = {
    assetSymbol: 'USD',
    transactions: JSON.parse(convertToOfx(theData)),
  };

  sendTheExport('ofx', Mustache.render(templateString, transactions));
};

//-------------------------------------------------------------------------
export const convertToOfx = (theData: any) => {
  const sorted = theData;
  const transactions = [sorted.flatMap((trans: any) => trans.statements.flatMap((statement: any) => {
    const {
      hash, blockNumber, transactionIndex, compressedTx, toName, to,
    } = trans;
    const { assetAddr, assetSymbol, timestamp } = statement;
    const date = dayjs.unix(timestamp).format('YYYYMMDDHHmmss');
    const parts = compressedTx.split('(');
    const func = parts.length > 0 ? parts[0] : '';

    const inflows = incomeFields.map((field: any) => ({
      id: `${assetAddr}`,
      type: 'CREDIT',
      amount: statement[field],
      date,
      checkNum: `${blockNumber}.${transactionIndex}`,
      refNum: `${hash}`,
      memo: `${field} - ${toName.name} - ${to} - ${assetSymbol} - ${func}`,
    }));

    const outflows = outflowFields.map((field: any) => ({
      id: `${assetAddr}`,
      type: 'DEBIT',
      amount: `-${statement[field]}`,
      date,
      checkNum: `${blockNumber}.${transactionIndex}`,
      refNum: `${hash}`,
      memo: `${field} - ${toName.name} - ${to} - ${assetSymbol} - ${func}`,
    }));

    return inflows
      .concat(outflows)
      .filter(({ amount }) => amount.length > 0 && amount !== '-');
  }))];

  return `${transactions.map((row: any) => JSON.stringify(row, null, 2)).join('\n')}\n`;
};

//-------------------------------------------------------------------------
const header = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE`;

//-------------------------------------------------------------------------
const templateString = `${header}

<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>2
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <STMTRS>
      <CURDEF>USD

      <BANKACCTFROM>
        <BANKID>Crypto-Bankless
        <ACCTID>{{assetSymbol}}
        <ACCTTYPE>Cyrpto
      </BANKACCTFROM>

      <BANKTRANLIST>
        {{#transactions}}
        <STMTTRN>
          <FITID>{{id}}
          <TRNTYPE>{{type}}
          <TRNAMT>{{amount}}
          <CHECKNUM>{{checkNum}}
          <REFNUM>{{refNum}}
          <MEMO>{{memo}}
          <DTPOSTED>{{date}}
        </STMTTRN>

        {{/transactions}}
      </BANKTRANLIST>

    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

/*
BANKTRANLIST, BankTransactionList
    DTSTART, DateTimeType
    DTEND, DateTimeType
    STMTTRN, StatementTransaction
        TRNTYPE, TransactionEnum,
          one of [
            CREDIT|DEBIT|INT|DIV|FEE|SRVCHG|DEP|ATM|POS|XFER|CHECK|
            PAYMENT|CASH|DIRECTDEP|DIRECTDEBIT|REPEATPMT|HOLD|OTHER
          ]
        DTPOSTED, DateTimeType, at least 8 chars,
          format:
            [0-9]{4}
              ((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))|
            [0-9]{4}
              ((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))(([0-1][0-9])|(2[0-3]))[0-5][0-9](([0-5][0-9])|(60))|
            [0-9]{4}
              ((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))(([0-1][0-9])|(2[0-3]))[0-5][0-9](([0-5][0-9])|(60))
                \.[0-9]{3}|
            [0-9]{4}
              ((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))(([0-1][0-9])|(2[0-3]))[0-5][0-9](([0-5][0-9])|(60))
                \.[0-9]{3}(\[[\+\-]?.+(:.+)?\])?
        TRNAMT, AmountType, at most 32 chars,
          format:
            [\+\-]?[0-9]*(([0-9][,\.]?)|([,\.][0-9]))[0-9]*
        LOANPMTINFO, LoanPaymentInfo,
          object:
            {
              PRINAMT, AmountType
              INTAMT, AmountType
              ESCRWAMT, EscrowAmount
              INSURANCE, AmountType
              LATEFEEAMT, AmountType
              OTHERAMT, AmountType
            }
        FITID, FinancialInstitutionTransactionIdType
          max 255 chars,
        SRVRTID, ServerIdType
          max 10 chars
        CHECKNUM, CheckNumberType
          max 12 chars
        REFNUM, ReferenceNumberType
          max 32 chars
        SIC, StandardIndustryCodeType
        PAYEEID, PayeeIdType
          max 12 chars
        MEMO, MessageType
          max 256 chars
        IMAGEDATA, ImageData
        INV401KSOURCE, Investment401kSourceEnum
*/
