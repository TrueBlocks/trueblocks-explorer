import { ReactNode } from 'react';

export interface StyledLabelProps {
  children: ReactNode;
  variant?: 'default' | 'blue' | 'dimmed' | 'success' | 'error';
  weight?: 'normal' | 'strong' | 'bold';
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'right' | 'center';
  italic?: boolean;
  colon?: boolean;
  className?: string;
}

export const StyledLabel = ({
  children,
  variant = 'default',
  weight = 'strong',
  size = 'sm',
  align = 'left',
  italic = false,
  colon = true,
  className,
}: StyledLabelProps) => {
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
        return 'var(--mantine-color-blue-6)';
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'normal':
        return 500;
      case 'bold':
        return 'bold';
      default:
        return 600; // strong
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

  const displayText =
    colon && typeof children === 'string' ? `${children}:` : children;

  return (
    <span className={className} style={styles}>
      {displayText}
    </span>
  );
};

StyledLabel.displayName = 'StyledLabel';
