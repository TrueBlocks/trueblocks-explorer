import React, { useEffect, useState } from 'react';
import { addActionListener, removeListener } from '../../websockets';

function getProgress(string: string) {
  var str = string.replace(/\s+/g, ' ');
  var tokens = str.split(' ');
  return { msg: tokens[1], done: tokens[2], total: tokens[4] };
}

//-----------------------------------------------------
export const Console = (props: any) => {
  const [progPct, setProgressPct] = useState<string | 0>(0);
  const [finished, setFinished] = useState(false);
  const [op, setOp] = useState('');

  useEffect(() => {
    const listener = addActionListener('progress', ({ id, content }: { id: any; content: any }) => {
      //const {content} = content;
      if (content) {
        const { msg, done, total } = getProgress(content);
        const toPercent = () => ((parseInt(done) / parseInt(total)) * 100).toFixed(0);
        const finished = msg.includes('Finished');
        const prevPct = progPct;
        const progressPercentage = finished ? 0 : toPercent();
        if (progressPercentage !== prevPct) {
          setOp(finished ? '' : content);
          setFinished(finished);
          setProgressPct(progressPercentage);
        }
      }
    });
    return () => removeListener(listener);
  }, []);

  const item = props.asText ? <div>{op}</div> : finished ? null : <progress max='100' value={progPct}></progress>;

  return (
    <div
      style={{
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '8px',
        height: '40px',
        padding: '8px',
        minWidth: '600px',
        display: 'flex',
        alignItems: 'center',
      }}>
      <div style={{ marginRight: '12px' }}>Console:</div> {item}
    </div>
  );
};
