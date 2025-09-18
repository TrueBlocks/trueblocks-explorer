import { ReactNode } from 'react';

import { Card, Text, Title } from '@mantine/core';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const DashboardCard = ({
  title,
  subtitle,
  icon,
  children,
  onClick,
  loading = false,
  error = null,
}: DashboardCardProps) => {
  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      role={onClick ? 'button' : 'region'}
      aria-label={onClick ? `Navigate to ${title}` : `${title} panel`}
      aria-describedby={
        subtitle ? `${title.toLowerCase()}-subtitle` : undefined
      }
      aria-live={loading ? 'polite' : undefined}
      aria-busy={loading}
      tabIndex={onClick ? 0 : undefined}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {icon && <div style={{ marginRight: 12 }}>{icon}</div>}
        <div style={{ flex: 1 }}>
          <Title order={4} size="h5">
            {title}
          </Title>
          {subtitle && (
            <Text size="sm" c="dimmed" id={`${title.toLowerCase()}-subtitle`}>
              {subtitle}
            </Text>
          )}
        </div>
      </div>

      {error ? (
        <Text c="red" size="sm">
          {error}
        </Text>
      ) : loading ? (
        <Text c="dimmed" size="sm">
          Loading...
        </Text>
      ) : (
        children
      )}
    </Card>
  );
};
