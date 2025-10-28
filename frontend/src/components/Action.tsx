import { useIconSets } from '@hooks';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

type IconName = keyof ReturnType<typeof useIconSets>;

interface ActionProps extends Omit<ActionIconProps, 'children' | 'onClick'> {
  icon: IconName;
  iconOff?: IconName;
  isOn?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  hotkey?: string; // Optional hotkey like 'mod+x', 'ctrl+s', etc.
}

export const Action = ({
  icon,
  iconOff,
  isOn = true,
  onClick,
  disabled = false,
  title,
  hotkey,
  ...mantineProps
}: ActionProps) => {
  const icons = useIconSets();

  const currentIcon = iconOff && !isOn ? iconOff : icon;
  const IconComponent = icons[currentIcon];

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  useHotkeys(
    hotkey
      ? [
          [
            hotkey,
            (e) => {
              if (!disabled) {
                // Check if we're not in a form field to avoid conflicts
                const activeElement = document.activeElement;
                const isInFormField =
                  activeElement &&
                  (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    (activeElement as HTMLElement).contentEditable === 'true');

                if (!isInFormField) {
                  e.preventDefault();
                  onClick();
                }
              }
            },
          ],
        ]
      : [],
  );

  return (
    <ActionIcon
      onClick={handleClick}
      disabled={disabled}
      title={title}
      c="gray.8"
      variant="transparent"
      {...mantineProps}
    >
      <IconComponent />
    </ActionIcon>
  );
};
