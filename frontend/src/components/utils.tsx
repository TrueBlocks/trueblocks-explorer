type BarType = 'header' | 'footer' | 'menu' | 'help';

const BAR_CONFIG = {
  header: { collapsed: 0, expanded: 60 },
  footer: { collapsed: 25, expanded: 40 },
  menu: { collapsed: 50, expanded: 180 }, // Was 160 * 1
  help: { collapsed: 50, expanded: 320 }, // Was 160 * 2
};

export const getBarSize = (type: BarType, collapsed: boolean): number => {
  const config = BAR_CONFIG[type];
  return collapsed ? config.collapsed : config.expanded;
};
