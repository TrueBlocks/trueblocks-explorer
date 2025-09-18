import { Action } from './Action';

export const ChevronButton = ({
  collapsed,
  onToggle,
  direction = 'none',
  title,
}: {
  collapsed: boolean;
  onToggle: () => void;
  direction?: 'left' | 'right' | 'up' | 'down' | 'none';
  title?: string;
}) => {
  if (direction === 'none') {
    return (
      <Action
        icon="ChevronRight"
        iconOff="ChevronLeft"
        isOn={!collapsed}
        onClick={onToggle}
        variant="subtle"
        size="sm"
        radius="md"
        title={title}
      />
    );
  }
  type IconName = 'ChevronLeft' | 'ChevronRight' | 'ChevronUp' | 'ChevronDown';
  const pairs: Record<
    'left' | 'right' | 'up' | 'down',
    { icon: IconName; iconOff: IconName }
  > = {
    left: { icon: 'ChevronLeft', iconOff: 'ChevronRight' },
    right: { icon: 'ChevronRight', iconOff: 'ChevronLeft' },
    up: { icon: 'ChevronUp', iconOff: 'ChevronDown' },
    down: { icon: 'ChevronDown', iconOff: 'ChevronUp' },
  };
  const d = direction as 'left' | 'right' | 'up' | 'down';
  const { icon, iconOff } = pairs[d];
  return (
    <Action
      icon={icon}
      iconOff={iconOff}
      isOn={!collapsed}
      onClick={onToggle}
      variant="subtle"
      size="sm"
      radius="md"
      title={title}
    />
  );
};
