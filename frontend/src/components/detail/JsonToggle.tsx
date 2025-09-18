import { useState } from 'react';

interface JsonToggleProps {
  text?: string;
  buttonLabels?: { show: string; hide: string };
  className?: string;
  preClassName?: string;
}

export const JsonToggle = ({
  text,
  buttonLabels = { show: 'Show JSON', hide: 'Hide JSON' },
  className,
  preClassName,
}: JsonToggleProps) => {
  const [open, setOpen] = useState(false);
  if (!text) return <span>-</span>;
  return (
    <div className={className || ''}>
      <button
        type="button"
        className="detail-json-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {open ? buttonLabels.hide : buttonLabels.show}
      </button>
      {open ? (
        <pre className={preClassName ? preClassName : 'detail-json-block'}>
          {text}
        </pre>
      ) : null}
    </div>
  );
};
