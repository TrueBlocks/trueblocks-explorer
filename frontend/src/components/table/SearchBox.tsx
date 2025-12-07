import { useCallback, useEffect, useState } from 'react';

import { useFormHotkeys, useTableContext } from '@components';

interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  useFormHotkeys({ keys: ['mod+a'] });

  const { focusControls } = useTableContext();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleFocus = useCallback(() => {
    focusControls();
  }, [focusControls]);

  const commitChange = useCallback(() => {
    if (inputValue !== value) {
      onChange(inputValue);
    }
  }, [inputValue, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitChange();
    }
  };

  const handleBlur = () => {
    commitChange();
  };

  return (
    <input
      type="text"
      placeholder="Search the table..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      aria-label="Search table"
    />
  );
};
