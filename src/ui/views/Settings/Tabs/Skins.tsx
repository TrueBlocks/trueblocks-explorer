import React from "react";
import { createUseStyles } from "react-jss";
import useGlobalState from "../../../state";

const themeList = [
  { theme: "Theme 1", primaryColor: "#FF0000" },
  { theme: "Theme 2", primaryColor: "#00FF00" },
];

const useStyles = createUseStyles({
  skinContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "16px",
    cursor: "pointer",
  },
  skinItem: {
    width: "20px",
    height: "20px",
    marginLeft: "8px",
  },
  skinTitle: (theme: any) => ({
    borderBottom: theme ? `2px solid ${theme.primaryColor}` : "2px solid black",
  }),
});

export const Skins = () => {
  const { theme, setTheme } = useGlobalState();

  const styles = useStyles(theme);

  return (
    <div>
      <h2 className={styles.skinTitle}>Skins</h2>
      {themeList.map((theme) => (
        <div className={styles.skinContainer} onClick={() => setTheme(theme)}>
          <div>{theme.theme}:</div>
          <div
            style={{ backgroundColor: theme.primaryColor }}
            className={styles.skinItem}
          ></div>
        </div>
      ))}
    </div>
  );
};
