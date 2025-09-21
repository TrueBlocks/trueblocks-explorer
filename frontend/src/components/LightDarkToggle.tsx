import { Action } from '@components';
import { usePreferences } from '@hooks';

export const LightDarkToggle = () => {
  const { toggleTheme, isDarkMode } = usePreferences();

  return (
    <Action
      icon="Light"
      iconOff="Dark"
      isOn={!isDarkMode}
      onClick={() => toggleTheme()}
      title={
        isDarkMode
          ? 'Dark mode ON - Click for light mode'
          : 'Light mode ON - Click for dark mode'
      }
    />
  );
};
