export function goToUrl(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.setAttribute('target', '_blank');
  a.click();
}

export const chartColors = [
  '#63b598',
  '#ce7d78',
  '#ea9e70',
  '#a48a9e',
  '#c6e1e8',
  '#648177',
  '#0d5ac1',
  '#f205e6',
  '#1c0365',
  '#14a9ad',
  '#4ca2f9',
  '#a4e43f',
  '#d298e2',
  '#6119d0',
  '#d2737d',
  '#c0a43c',
  '#f2510e',
  '#651be6',
  '#79806e',
  '#61da5e',
  '#cd2f00',
  '#9348af',
  '#01ac53',
  '#c5a4fb',
  '#996635',
  '#b11573',
  '#4bb473',
  '#75d89e',
  '#2f3f94',
  '#2f7b99',
  '#da967d',
  '#34891f',
  '#b0d87b',
  '#ca4751',
  '#7e50a8',
  '#c4d647',
  '#e0eeb8',
  '#11dec1',
  '#289812',
  '#566ca0',
  '#ffdbe1',
  '#2f1179',
  '#935b6d',
  '#916988',
  '#513d98',
  '#aead3a',
  '#9e6d71',
  '#4b5bdc',
  '#0cd36d',
  '#250662',
  '#cb5bea',
  '#228916',
  '#ac3e1b',
  '#df514a',
  '#539397',
  '#880977',
  '#f697c1',
  '#ba96ce',
  '#679c9d',
  '#c6c42c',
  '#5d2c52',
  '#48b41b',
  '#e1cf3b',
  '#5be4f0',
  '#57c4d8',
  '#a4d17a',
  '#225b8',
  '#be608b',
  '#96b00c',
  '#088baf',
  '#f158bf',
  '#e145ba',
  '#ee91e3',
  '#05d371',
  '#5426e0',
  '#4834d0',
  '#802234',
  '#6749e8',
  '#0971f0',
  '#8fb413',
  '#b2b4f0',
  '#c3c89d',
  '#c9a941',
  '#41d158',
  '#fb21a3',
  '#51aed9',
  '#5bb32d',
  '#807fb',
  '#21538e',
  '#89d534',
  '#d36647',
  '#7fb411',
  '#0023b8',
  '#3b8c2a',
  '#986b53',
  '#f50422',
  '#983f7a',
  '#ea24a3',
  '#79352c',
  '#521250',
  '#c79ed2',
  '#d6dd92',
  '#e33e52',
  '#b2be57',
  '#fa06ec',
  '#1bb699',
  '#6b2e5f',
  '#64820f',
  '#1c271',
  '#21538e',
  '#89d534',
  '#d36647',
  '#7fb411',
  '#0023b8',
  '#3b8c2a',
  '#986b53',
  '#f50422',
  '#983f7a',
  '#ea24a3',
  '#79352c',
  '#521250',
  '#c79ed2',
  '#d6dd92',
  '#e33e52',
  '#b2be57',
  '#fa06ec',
  '#1bb699',
  '#6b2e5f',
  '#64820f',
  '#1c271',
  '#9cb64a',
  '#996c48',
  '#9ab9b7',
  '#06e052',
  '#e3a481',
  '#0eb621',
  '#fc458e',
  '#b2db15',
  '#aa226d',
  '#792ed8',
  '#73872a',
  '#520d3a',
  '#cefcb8',
  '#a5b3d9',
  '#7d1d85',
  '#c4fd57',
  '#f1ae16',
  '#8fe22a',
  '#ef6e3c',
  '#243eeb',
  '#1dc18',
  '#dd93fd',
  '#3f8473',
  '#e7dbce',
  '#421f79',
  '#7a3d93',
  '#635f6d',
  '#93f2d7',
  '#9b5c2a',
  '#15b9ee',
  '#0f5997',
  '#409188',
  '#911e20',
  '#1350ce',
  '#10e5b1',
  '#fff4d7',
  '#cb2582',
  '#ce00be',
  '#32d5d6',
  '#17232',
  '#608572',
  '#c79bc2',
  '#00f87c',
  '#77772a',
  '#6995ba',
  '#fc6b57',
  '#f07815',
  '#8fd883',
  '#060e27',
  '#96e591',
  '#21d52e',
  '#d00043',
  '#b47162',
  '#1ec227',
  '#4f0f6f',
  '#1d1d58',
  '#947002',
  '#bde052',
  '#e08c56',
  '#28fcfd',
  '#bb09b',
  '#36486a',
  '#d02e29',
  '#1ae6db',
  '#3e464c',
  '#a84a8f',
  '#911e7e',
  '#3f16d9',
  '#0f525f',
  '#ac7c0a',
  '#b4c086',
  '#c9d730',
  '#30cc49',
  '#3d6751',
  '#fb4c03',
  '#640fc1',
  '#62c03e',
  '#d3493a',
  '#88aa0b',
  '#406df9',
  '#615af0',
  '#4be47',
  '#2a3434',
  '#4a543f',
  '#79bca0',
  '#a8b8d4',
  '#00efd4',
  '#7ad236',
  '#7260d8',
  '#1deaa7',
  '#06f43a',
  '#823c59',
  '#e3d94c',
  '#dc1c06',
  '#f53b2a',
  '#b46238',
  '#2dfff6',
  '#a82b89',
  '#1a8011',
  '#436a9f',
  '#1a806a',
  '#4cf09d',
  '#c188a2',
  '#67eb4b',
  '#b308d3',
  '#fc7e41',
  '#af3101',
  '#ff065',
  '#71b1f4',
  '#a2f8a5',
  '#e23dd0',
  '#d3486d',
  '#00f7f9',
  '#474893',
  '#3cec35',
  '#1c65cb',
  '#5d1d0c',
  '#2d7d2a',
  '#ff3420',
  '#5cdd87',
  '#a259a4',
  '#e4ac44',
  '#1bede6',
  '#8798a4',
  '#d7790f',
  '#b2c24f',
  '#de73c2',
  '#d70a9c',
  '#25b67',
  '#88e9b8',
  '#c2b0e2',
  '#86e98f',
  '#ae90e2',
  '#1a806b',
  '#436a9e',
  '#0ec0ff',
  '#f812b3',
  '#b17fc9',
  '#8d6c2f',
  '#d3277a',
  '#2ca1ae',
  '#9685eb',
  '#8a96c6',
  '#dba2e6',
  '#76fc1b',
  '#608fa4',
  '#20f6ba',
  '#07d7f6',
  '#dce77a',
  '#77ecca',
];

// export const getSiblings = (e: any) => {
//   // for collecting siblings
//   let siblings: any[] = [];
//   // if no parent, return no sibling
//   if (!e || !e.parentNode) {
//     return siblings;
//   }
//   // first child of the parent node
//   let sibling = e.parentNode.firstChild;

//   // collecting siblings
//   while (sibling) {
//     if (sibling.nodeType === 1 && sibling !== e) {
//       siblings.push(sibling);
//     }
//     sibling = sibling.nextSibling;
//   }
//   return siblings;
// };

// export const useKeyBindings = (
//   expandedRowKeys: readonly React.ReactText[],
//   setExpandedRowKeys: any,
//   currentPage: number,
//   pageSize: number,
//   dataLength: number,
//   nextPage: () => void,
//   previousPage: () => void,
//   firstPage: () => void,
//   lastPage: (event: any) => void,
//   curRow: number,
//   setFocusedRow: (row: number) => void
// ) => {
//   const [isFocused, setIsFocused] = useState(false);

//   useEffect(() => {
//     setIsFocused(true);
//   }, []);

//   const handleOnFocus = useCallback((event) => {
//     // Check if the element with querySelector string is
//     // in focus, if so, take over the control from here.
//     const blurredFrom = event.relatedTarget;
//     // const focusedTo = event.target;

//     // If the blurredFrom and focusedTo have different parents,
//     // then we turn the focused flag on.
//     if (blurredFrom === null || blurredFrom.tagName !== 'TR') {
//       setIsFocused(true);
//     }
//   }, []);

//   const handleOnBlur = useCallback((event) => {
//     const blurredTo = event.relatedTarget;
//     // const focusedFrom = event.target;

//     // if blurredTo belongs to an element outside the currentDOM tree, then
//     // we should mark this element as not-focused
//     if (blurredTo === null || blurredTo.tagName !== 'TR') {
//       setIsFocused(false);
//     }
//   }, []);

//   // Go to previous row
//   const handleUpKey = useCallback(
//     (event) => {
//       // If activeElement is a TR element or has any of it's parent as TR element, then we must look for next TR element
//       if (event.target) {
//         // let's check if this itself is a TR element, if not, lets find one
//         const currentRow =
//           event.target.tagName === 'TR'
//             ? event.target
//             : event.target.parents?.find((element: HTMLElement) => element.tagName === 'TR') ??
//               event.target.querySelector(`tr[data-row-key]`);

//         if (currentRow) {
//           if (document.activeElement?.isSameNode(currentRow)) {
//             // look for previous sibling
//             let previousSibling = currentRow.previousElementSibling;
//             if (!previousSibling.getAttribute('data-row-key') && currentPage !== 1) {
//               previousPage();
//             } else {
//               while (!previousSibling?.getAttribute('data-row-key')) {
//                 previousSibling = previousSibling.previousElementSibling;
//                 if (!previousSibling) break;
//               }
//               const index = getSiblings(currentRow)
//                 .map((e) => e.getAttribute('data-row-key'))
//                 .indexOf(previousSibling ? previousSibling.getAttribute('data-row-key') : 0);
//               setFocusedRow(Math.max(index - 1, 0));
//               previousSibling?.focus();
//             }
//           } else {
//             // highlight itself
//             currentRow.focus();
//           }
//         }
//       }
//     },
//     [isFocused, currentPage, dataLength, curRow, setFocusedRow]
//   );

//   // Go to next row
//   const handleDownKey = useCallback(
//     (event) => {
//       // If activeElement is a TR element or has any of it's parent as TR element, then we must look for next TR element
//       if (event.target) {
//         // let's check if this itself is a TR element, if not, lets find one
//         const currentRow =
//           event.target.tagName === 'TR'
//             ? event.target
//             : event.target.parents?.find((element: HTMLElement) => element.tagName === 'TR') ??
//               event.target.querySelector(`tr[data-row-key]`);

//         if (currentRow) {
//           if (document.activeElement?.isSameNode(currentRow)) {
//             // look for next sibling
//             let nextSibling = currentRow.nextElementSibling;
//             if (!nextSibling) {
//               nextPage();
//             } else {
//               while (!nextSibling?.getAttribute('data-row-key')) {
//                 nextSibling = nextSibling.nextElementSibling;
//                 if (!nextSibling) break;
//               }
//               const index = getSiblings(currentRow)
//                 .map((e) => e.getAttribute('data-row-key'))
//                 .indexOf(nextSibling.getAttribute('data-row-key'));
//               setFocusedRow(index);
//               nextSibling?.focus();
//             }
//           } else {
//             // highlight itself
//             currentRow.focus();
//           }
//         }
//       }
//     },
//     [isFocused, currentPage, dataLength, curRow, setFocusedRow]
//   );

//   const handleEnterKey = useCallback(
//     (event) => {
//       // If activeElement is a TR element or has any of it's parent as TR element, then we must look for next TR element
//       if (isFocused && event.target) {
//         // let's check if this itself is a TR element, if not, lets find one
//         const currentRow =
//           event.target.tagName === 'TR'
//             ? event.target
//             : event.target.parents?.find((element: HTMLElement) => element.tagName === 'TR') ??
//               event.target.querySelector('tr');

//         if (currentRow) {
//           if (document.activeElement?.isSameNode(currentRow)) {
//             const rowKey = currentRow.getAttribute('data-row-key');
//             if (expandedRowKeys.find((key) => key === rowKey)) {
//               setExpandedRowKeys(expandedRowKeys.filter((keys) => keys !== rowKey));
//             } else {
//               setExpandedRowKeys(Array.from(new Set([...expandedRowKeys, rowKey])));
//             }
//           }
//         }
//       }
//     },
//     [isFocused, setExpandedRowKeys, expandedRowKeys, dataLength]
//   );

//   const handleHomeKey = useCallback(
//     (event) => {
//       if (currentPage !== 1) {
//         setFocusedRow(0);
//         firstPage();
//       } else {
//         if (event.target) {
//           const currentRow =
//             event.target.tagName === 'TR'
//               ? event.target
//               : event.target.parents?.find((element: HTMLElement) => element.tagName === 'TR') ??
//                 event.target.querySelector(`tr[data-row-key]`);

//           if (currentRow) {
//             if (document.activeElement?.isSameNode(currentRow)) {
//               const siblings = getSiblings(currentRow);
//               if (siblings && siblings.length > 0 && currentRow.getAttribute('data-row-key').toString() !== '1') {
//                 setFocusedRow(0);
//                 siblings[1].focus();
//               }
//             } else {
//               currentRow.focus();
//             }
//           }
//         }
//       }
//     },
//     [isFocused, currentPage, dataLength, curRow, setFocusedRow]
//   );

//   const handleEndKey = useCallback(
//     (event) => {
//       lastPage(event);
//       // If activeElement is a TR element or has any of it's parent as TR element, then we must look for next TR element
//       if (event.target) {
//         // let's check if this itself is a TR element, if not, lets find one
//         const currentRow =
//           event.target.tagName === 'TR'
//             ? event.target
//             : event.target.parents?.find((element: HTMLElement) => element.tagName === 'TR') ??
//               event.target.querySelector(`tr[data-row-key]`);

//         if (currentRow) {
//           if (document.activeElement?.isSameNode(currentRow)) {
//             // look for previous sibling
//             const siblings = getSiblings(currentRow);
//             const currentRowString = currentRow.getAttribute('data-row-key').toString();
//             if (
//               siblings &&
//               siblings.length > 0 &&
//               currentRowString.charAt(currentRowString.length - 1) !== siblings.length.toString()
//             ) {
//               setFocusedRow(siblings.length - 1);
//               siblings[siblings.length - 1].focus();
//             }
//           } else {
//             // highlight itself
//             currentRow.focus();
//           }
//         }
//       }
//     },
//     [isFocused, currentPage, pageSize, dataLength, curRow, setFocusedRow]
//   );

//   useHotkeys('up', handleUpKey, [handleUpKey]);
//   useHotkeys('down', handleDownKey, [handleDownKey]);
//   useHotkeys('enter', handleEnterKey, [handleEnterKey]);
//   useHotkeys(',, home', handleHomeKey, [handleHomeKey]);
//   useHotkeys('., end', handleEndKey, [handleEndKey]);

//   return {
//     handleOnFocus,
//     handleOnBlur,
//   };
// };

// export function triggerFocus(element: any) {
//   var eventType = 'onfocusin' in element ? 'focusin' : 'focus',
//     bubbles = 'onfocusin' in element,
//     event;

//   if ('createEvent' in document) {
//     event = document.createEvent('Event');
//     event.initEvent(eventType, bubbles, true);
//   } else if ('Event' in window) {
//     event = new Event(eventType, { bubbles: bubbles, cancelable: true });
//   }

//   element.focus();
//   element.dispatchEvent(event);
// }

//-------------------------------------------------------------------------
export const downloadRecords = (theData: any, columns: any, delim: string, surr: string) => {
  const ext = delim === ',' ? '.csv' : '.txt';
  const exportFileName = `Txs_${
    new Date()
      .toISOString()
      .replace(/[ -.T]/g, '_')
      .replace(/Z/, '')
  }${ext}`;

  const theHeader = columns
    .map((column: any) => surr + (!column.title ? column.dataIndex : column.title) + surr)
    .join(delim);

  const theRows = theData.map((record: any, index: number) => {
    const row = columns.map((column: any) => {
      if (column.render) {
        let value = column.render(record[column.dataIndex], record);
        if (!value || value === undefined) value = '';
        return surr + value + surr;
      }
      if (!column) return `${surr}${surr}`;
      if (!record[column.dataIndex] || record[column.dataIndex] === '') return `${surr}${surr}`;
      return surr + record[column.dataIndex] + surr;
    });
    return row.join(delim);
  });

  const theOutput = `${theHeader}\n${theRows.join('\n')}`;
  sendTheExport(exportFileName, 'CSV', theOutput);
};

const sendTheExport = (fileName: string, outFmt: string, theOutput: string) => {
  const expElement = document.createElement('a');
  expElement.href = `data:text/${outFmt};charset=utf-8,${encodeURI(theOutput)}`;
  expElement.target = '_blank';
  expElement.download = fileName;
  expElement.click();
};
