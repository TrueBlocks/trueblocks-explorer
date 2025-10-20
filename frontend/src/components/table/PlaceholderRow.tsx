import { generateFakeData } from './fakeDataGenerator';

interface PlaceholderRowProps {
  index: number;
  columns: Array<{ type?: string }>; // Simple column interface
  isActive?: boolean;
}

export function PlaceholderRow({
  index: _index,
  columns,
  isActive = false,
}: PlaceholderRowProps) {
  return (
    <tr className="placeholder-row" style={{ opacity: isActive ? 1.0 : 0.5 }}>
      {columns.map((column, colIndex) => (
        <td
          key={colIndex}
          style={{
            padding: '8px',
            color: 'var(--mantine-color-text)',
            fontStyle: 'italic',
            backgroundColor: isActive
              ? 'var(--mantine-color-blue-light)'
              : 'transparent',
          }}
        >
          {generateFakeData(column.type || 'text', _index)}
        </td>
      ))}
    </tr>
  );
}
