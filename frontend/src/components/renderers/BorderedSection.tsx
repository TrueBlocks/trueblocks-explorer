import './PanelComponents.css';

export interface BorderedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const BorderedSection = ({
  children,
  className,
}: BorderedSectionProps) => {
  return <div className={`panel-section ${className || ''}`}>{children}</div>;
};

BorderedSection.displayName = 'BorderedSection';
