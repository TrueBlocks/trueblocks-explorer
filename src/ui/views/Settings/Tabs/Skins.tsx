import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, themeList } from '@modules/themes';
import { useGlobalState } from '../../../State';

const useStyles = createUseStyles({
  skinContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    cursor: 'pointer',
  },
  skinItem: {
    width: '400px',
    padding: '8px',
  },
  skinTitle: (theme: any) => ({
    borderBottom: theme ? `2px solid ${theme.primaryColor}` : '2px solid black',
  }),
});

export const Skins = () => {
  const { theme, setTheme } = useGlobalState();
  const styles = useStyles(theme);

  const onThemeClick = (clickedTheme: Theme) => setTheme(clickedTheme);

  return (
    <div>
      <h2 className={styles.skinTitle}>Skins</h2>
      {themeList.map((themeOnList) => (
        <div
          key={themeOnList.name}
          className={styles.skinContainer}
          onClick={() => onThemeClick(themeOnList)}
          role='button'
          onKeyPress={() => onThemeClick(themeOnList)}
          tabIndex={0}
        >
          <div style={{ backgroundColor: themeOnList.secondaryColor }} className={styles.skinItem}>
            <div style={{ color: themeOnList.primaryColor }}>{themeOnList.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
