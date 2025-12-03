import { ReactNode } from 'react';

export interface StyledValueProps {
  children: ReactNode;
  variant?: 'default' | 'blue' | 'dimmed' | 'success' | 'error';
  weight?: 'normal' | 'strong' | 'bold';
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'right' | 'center';
  italic?: boolean;
  className?: string;
}

export const StyledValue = ({
  children,
  variant = 'default',
  weight = 'normal',
  size = 'sm',
  align = 'left',
  italic = false,
  className,
}: StyledValueProps) => {
  const getColor = () => {
    switch (variant) {
      case 'blue':
        return 'var(--mantine-color-blue-6)';
      case 'dimmed':
        return 'var(--mantine-color-dimmed)';
      case 'success':
        return 'var(--mantine-color-green-6)';
      case 'error':
        return 'var(--mantine-color-red-6)';
      default:
        return 'inherit';
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'strong':
        return 600;
      case 'bold':
        return 'bold';
      default:
        return 500; // normal
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs':
        return '11px';
      case 'md':
        return '13px';
      default:
        return '12px'; // sm
    }
  };

  const styles: React.CSSProperties = {
    color: getColor(),
    fontWeight: getFontWeight(),
    fontSize: getFontSize(),
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    display: 'inline',
  };

  return (
    <span className={className} style={styles}>
      {children}
    </span>
  );
};

StyledValue.displayName = 'StyledValue';
