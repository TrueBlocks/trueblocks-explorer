export type ThemeName =
    | 'default'
    | 'Blue on Black'
    | 'Yellow on Green'
    | 'Orange on Black';

export type Theme = {
  name: ThemeName,
  primaryColor: string,
  secondaryColor: string,
};

export const themeList: Theme[] = [
  { name: 'Blue on Black', primaryColor: 'lightblue', secondaryColor: 'black' },
  { name: 'Yellow on Green', primaryColor: 'yellow', secondaryColor: 'forestgreen' },
  { name: 'Orange on Black', primaryColor: 'orange', secondaryColor: 'black' },
];

const defaultTheme = themeList[0];

export const getDefaultTheme = () => defaultTheme;

export const getThemeByName = (name: ThemeName): Theme => {
  if (name === 'default') return defaultTheme;

  const foundTheme = themeList.find(({ name: someName }) => someName === name);

  if (!foundTheme) return defaultTheme;

  return foundTheme;
};
