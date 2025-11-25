import './PanelComponents.css';

export interface CustomSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const CustomSection = ({ children, className }: CustomSectionProps) => {
  return <div className={`panel-section ${className || ''}`}>{children}</div>;
};

CustomSection.displayName = 'CustomSection';
