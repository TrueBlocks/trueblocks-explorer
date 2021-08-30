import React, { useEffect, useState } from 'react';
import { addActionListener, removeListener } from '../../websockets';

function getProgress(string: string) {
  const str = string.replace(/\s+/g, ' ');
  const tokens = str.split(' ');
  return { msg: tokens[1], done: tokens[2], total: tokens[4] };
}

//-----------------------------------------------------
export const Console = (props: any) => {
  const [progPct, setProgressPct] = useState<string | 0>(0);
  const [finished, setFinished] = useState(false);
  const [op, setOp] = useState('');

  useEffect(() => {
    const listener = addActionListener('progress', ({ id, content }: { id: any; content: any }) => {
      if (content) {
        const { msg, done, total } = getProgress(content);
        const toPercent = () => ((parseInt(done, 10) / parseInt(total, 10)) * 100).toFixed(0);
        const completed = msg.includes('Finished') || msg.includes('Completed');
        const progressPercentage = completed ? 0 : toPercent();
        setOp(completed ? '' : content);
        setProgressPct(progressPercentage);
        setFinished(completed);
      }
    });
    return () => removeListener(listener);
  }, []);

  const { asText, style } = props;
  const item = asText ? (
    <pre>
      {op}
    </pre>
  ) : <progress max='100' value={progPct} />;

  if (finished) return <></>;
  return (
    <>
      {asText ? (
        <div
          style={{
            backgroundColor: 'black',
            color: 'yellow',
            borderRadius: '4px',
            padding: '4px',
            minWidth: '600px',
            width: '50%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {item}
        </div>
      ) : (
        <div style={{ ...style }}>{item}</div>
      )}
    </>
  );
};
