import { useEffect, useState } from 'react';

export const useDateTime = (timestamp: number): string => {
  const [formattedDateTime, setFormattedDateTime] = useState('');

  useEffect(() => {
    const date = new Date(timestamp * 1000); // Convert timestamp from seconds to milliseconds

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    setFormattedDateTime(formatted);
  }, [timestamp]);

  return formattedDateTime;
};
