import {
  ChevronButton,
  StyledButton,
  StyledDivider,
  getBarSize,
} from '@components';
import { useEnabledMenuItems, useIconSets, usePreferences } from '@hooks';
import { AppShell, Stack } from '@mantine/core';
import { MenuItem } from 'src/Menu';
import { useLocation } from 'wouter';

interface MenuBarProps {
  disabled?: boolean;
}

export const MenuBar = ({ disabled = false }: MenuBarProps) => {
  const [currentLocation, navigate] = useLocation();
  const {
    menuCollapsed,
    setMenuCollapsed,
    chromeCollapsed,
    setChromeCollapsed,
  } = usePreferences();

  const { items: enabledMenuItems, isLoading } = useEnabledMenuItems();

  // Use empty array while loading to prevent rendering incomplete menu
  const menuItems = isLoading ? [] : enabledMenuItems;

  const topMenuItems = menuItems.filter((item) => item.position === 'top');
  const botMenuItems = menuItems.filter((item) => item.position === 'bottom');
  const icons = useIconSets();

  const renderMenuItem = ({ label, path, separator }: MenuItem) => {
    const Icon = icons[label as keyof typeof icons] || icons.Missing;

    const menuButton = (
      <StyledButton
        variant={currentLocation === path ? 'menu-selected' : 'menu'}
        key={path}
        fullWidth
        h={36}
        w={menuCollapsed ? 36 : '100%'}
        leftSection={<Icon style={{ marginLeft: menuCollapsed ? 9 : 0 }} />}
        justify={menuCollapsed ? 'center' : 'flex-start'}
        px={menuCollapsed ? 0 : 'md'}
        style={{
          marginLeft: menuCollapsed ? -9 : 0,
        }}
        disabled={disabled}
        onClick={() => {
          if (!disabled) navigate(path);
        }}
      >
        {!menuCollapsed && label}
      </StyledButton>
    );

    if (separator) {
      return (
        <div key={`${path}-with-separator`}>
          <StyledDivider
            orientation="horizontal"
            color="gray.6"
            margin="8px 0"
          />
          {menuButton}
        </div>
      );
    }

    return menuButton;
  };

  if (chromeCollapsed) {
    return (
      <AppShell.Navbar
        style={{
          padding: 0,
          height: 'calc(100vh - 30px)',
          width: 25,
          transition: 'width 0.2s ease',
          borderRight: '1px solid var(--mantine-color-gray-4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <ChevronButton
          collapsed={chromeCollapsed}
          onToggle={() => setChromeCollapsed(false)}
          direction="left"
          title="Restore layout"
        />
      </AppShell.Navbar>
    );
  }

  return (
    <AppShell.Navbar
      p="md"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        height: 'calc(100vh - 30px)',
        width: getBarSize('menu', menuCollapsed),
        transition: 'width 0.2s ease',
      }}
    >
      <Stack h="100%" justify="space-between" gap="sm">
        <Stack gap="sm">
          <ChevronButton
            collapsed={menuCollapsed}
            onToggle={() => setMenuCollapsed(!menuCollapsed)}
            direction="left"
          />
          {topMenuItems.map(renderMenuItem)}
        </Stack>
        <Stack gap="sm" pb="md">
          {botMenuItems.map(renderMenuItem)}
        </Stack>
      </Stack>
    </AppShell.Navbar>
  );
};
